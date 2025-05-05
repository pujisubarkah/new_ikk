import nodemailer from 'nodemailer';

export const sendApprovalEmail = async (adminEmail: string, userName: string, userEmail: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"No-Reply IKK" <no-reply@ikk.lan.go.id>`,
    to: userEmail,
    subject: `Persetujuan Pengguna: ${userName}`,
    text: `Halo Admin,\n\nPengguna dengan nama ${userName} (${userEmail}) telah disetujui dan kini dapat menggunakan aplikasi IKK.\n\nSalam hormat,\nTim Penilaian Indeks Kualitas Kebijakan`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Approval email sent');
  } catch (error) {
    console.error('Error sending approval email:', error);
  }
};
