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
    from: process.env.EMAIL_USER,
    to: adminEmail,
    subject: `User Approved: ${userName}`,
    text: `Hello Admin,\n\nThe user ${userName} (${userEmail}) sudah disetujui dan sudah bisa mengunakan aplikasi IKK.\n\nSalam,\nYour Application`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Approval email sent');
  } catch (error) {
    console.error('Error sending approval email:', error);
  }
};
