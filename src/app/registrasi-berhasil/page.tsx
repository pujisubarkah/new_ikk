// app/registrasi-berhasil/page.tsx
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function RegistrasiBerhasil() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Pendaftaran Berhasil!
        </h2>
        <p className="mt-2 text-lg text-gray-600">
          Command Center akan segera memverifikasi status Anda. Anda akan menerima
          notifikasi via email setelah verifikasi selesai.
        </p>
        <div className="mt-8 space-y-4">
          <Button asChild className="w-full">
            <Link href="/">Kembali ke Beranda</Link>
          </Button>
          <Button variant="secondary" asChild className="w-full">
            <Link href="/kontak">Hubungi Admin</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}