import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({
      success: false,
      error: 'Method tidak diizinkan'
    });
  }

  const { username, password } = req.body;

  // Validasi input
  if (typeof username !== 'string' || username.trim().length === 0 || !password) {
    return res.status(400).json({
      success: false,
      error: 'Username dan password wajib diisi'
    });
  }

  try {
    // Cari user berdasarkan username
    const user = await prisma.user.findFirst({
      where: { username: username },
      include: {
        role_user: {
          include: {
            role: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User tidak ditemukan'
      });
    }

    // Pengecekan status akun
    if (user.status !== 'aktif') {
      return res.status(403).json({
        success: false,
        error: 'Akun Anda belum aktif. Silakan tunggu verifikasi admin.'
      });
    }

    // Verifikasi password
    if (!user.password) {
      return res.status(400).json({
        success: false,
        error: 'Password tidak valid'
      });
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return res.status(401).json({
        success: false,
        error: 'Password salah'
      });
    }

    // Response sukses
    return res.status(200).json({
      success: true,
      data: {
        id: user.id.toString(),
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role_user?.role?.name || 'user',
        role_id: user.role_user?.role?.id.toString(),
        status: user.status
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'Terjadi kesalahan saat proses login'
    });
  }
}
