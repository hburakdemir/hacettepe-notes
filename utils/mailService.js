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


export async function sendPasswordResetEmail(email, resetCode) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Şifre Sıfırlama Kodu - Nottepe",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2F5755;">Şifre Sıfırlama</h2>
        <p>Merhaba,</p>
        <p>Şifrenizi sıfırlamak için aşağıdaki kodu kullanın:</p>
        <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 32px; letter-spacing: 5px; font-weight: bold; margin: 20px 0;">
          ${resetCode}
        </div>
        <p style="color: #666;">Bu kod 5 dakika içinde geçerliliğini yitirecektir.</p>
        <p style="color: #999; font-size: 12px;">Eğer bu isteği siz yapmadıysanız, bu maili görmezden gelebilirsiniz.</p>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
}