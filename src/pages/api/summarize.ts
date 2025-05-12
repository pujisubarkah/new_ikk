import formidable from 'formidable'; // Import formidable
import { NextApiRequest, NextApiResponse } from 'next';

// Agar Next.js dapat memproses file upload
export const config = {
  api: {
    bodyParser: false, // Nonaktifkan bodyParser default Next.js karena kita akan menggunakan formidable
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Membuat form baru menggunakan form.parse tanpa 'new'
  const form = formidable({
    multiples: false, // Apakah memungkinkan upload file multiple
    uploadDir: './public/uploads', // Direktori upload untuk menyimpan file
    keepExtensions: true, // Menyimpan ekstensi file
  });

  // Parsing form data
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error during form parsing:", err);
      return res.status(500).json({ message: 'Error parsing file', error: err });
    }

    // Cek jika tidak ada file yang di-upload
    if (!files.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Dapatkan file yang di-upload
    const uploadedFile = files.file[0];
    const filePath = uploadedFile.filepath;

    // Di sini, kamu bisa memproses file PDF menggunakan tools lain untuk rangkuman, misalnya menggunakan PDF library atau API eksternal
    // Sebagai contoh, kita hanya mengembalikan nama file sebagai placeholder
    console.log("File successfully uploaded:", uploadedFile);

    return res.status(200).json({ summary: 'File successfully uploaded', filePath });
  });
}
