import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Konfigurasi
const SALT_ROUNDS = 10;

// Schema Validasi dengan Zod
const createVerifikatorSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  username: z.string().min(3, "Username minimal 3 karakter").optional(),
  email: z.string().email("Email tidak valid"),
  position: z.string().min(2, "Jabatan minimal 2 karakter"),
  phone: z.string().min(10, "Nomor telepon minimal 10 karakter"),
  work_unit: z.string().optional(),
  koorNasionalId: z.string().min(1, "ID Koordinator Nasional diperlukan"),
  password: z.string().min(8, "Password minimal 8 karakter").optional(),
  status: z.enum(["aktif", "non_aktif"]).default("aktif"), // Huruf kecil
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const body = req.body;

    // 🔍 Tambahkan ini untuk lihat isi body yang diterima
    console.log("📦 Received body:", body);

    const validationResult = createVerifikatorSchema.safeParse(body);

    if (!validationResult.success) {
      console.error("❌ Validasi gagal:", validationResult.error.flatten());
      return res.status(400).json({
        error: "Validasi gagal",
        details: validationResult.error.flatten(),
      });
    }

    const {
      name,
      username,
      email,
      position,
      phone,
      work_unit,
      koorNasionalId,
      password: inputPassword,
      status,
    } = validationResult.data;

    // Hash password
    const finalPassword = inputPassword || "12345678";
    const hashedPassword = await bcrypt.hash(finalPassword, SALT_ROUNDS);

    // Cari koordinator nasional berdasarkan ID
    const koorUser = await prisma.user.findUnique({
      where: { id: BigInt(koorNasionalId) },
      select: { id: true, agency_id_panrb: true },
    });

    if (!koorUser || !koorUser.agency_id_panrb) {
      console.warn("⚠️ Koordinator tidak valid atau tidak memiliki instansi");
      return res.status(400).json({
        error: "Koordinator tidak valid atau tidak memiliki instansi terkait.",
      });
    }

    // Cek apakah user/email/username sudah ada
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      console.warn("⚠️ Pengguna sudah ada:", {
        email: existingUser.email === email,
        username: existingUser.username === username,
      });
      return res.status(409).json({
        error: "Pengguna dengan email atau username ini sudah ada.",
        conflicts: {
          email: existingUser.email === email,
          username: existingUser.username === username,
        },
      });
    }

    // Buat pengguna baru dalam transaksi
    const newUser = await prisma.user.create({
      data: {
        name,
        username,
        email,
        position,
        phone,
        work_unit,
        password: hashedPassword,
        status,
        agency_id_panrb: koorUser.agency_id_panrb,
        role_user: {
          create: {
            role_id: BigInt(3), // Role Verifikator
          },
        },
      },
    });

    // Simpan relasi di tabel koor_nasional_validator
    const relation = await prisma.koor_nasional_validator.create({
      data: {
        koor_nasional_id: koorUser.id,
        validator_id: newUser.id,
      },
    });

    return res.status(201).json({
      success: true,
      data: {
        user: {
          ...newUser,
          id: newUser.id.toString(),
        },
        relation: {
          ...relation,
          id: relation.id.toString(),
          koor_nasional_id: relation.koor_nasional_id?.toString(),
          validator_id: relation.validator_id?.toString(),
        },
      },
    });
  } catch (error) {
    console.error("💥 Error pada server:", error);
    return res.status(500).json({
      error: "Terjadi kesalahan server",
      details: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
}