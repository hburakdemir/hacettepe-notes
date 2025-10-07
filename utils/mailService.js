import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail', // yada gmail.com denerizs
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASSWORD, 
  },
});

export async function sendVerificationEmail(email, code) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Email Doğrulama Kodu',
    html: `
      <h2>Hoş Geldiniz!</h2>
      <p>Email adresinizi doğrulamak için aşağıdaki kodu girin:</p>
      <h1 style="color: #2F5755; font-size: 32px; letter-spacing: 5px;">${code}</h1>
      <p>Bu kod 10 dakika geçerlidir.</p>
      <p>Eğer bu kaydı siz yapmadıysanız, bu maili görmezden gelebilirsiniz.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Doğrulama maili gönderildi:', email);
  } catch (error) {
    console.error('Mail gönderme hatası:', error);
    throw error;
  }
}