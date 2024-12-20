import nodemailer from "nodemailer";

// Crear el transportador usando las variables de entorno
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || "sandbox.smtp.mailtrap.io",
  port: 587,
  auth: {
    user: process.env.MAIL_USER || "0c99805fcdaaba",
    pass: process.env.MAIL_PASS || "e7cd6702a29d82",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Actualizamos la función para aceptar un objeto mailOptions
export const sendMail = async (mailOptions) => {
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Correo enviado: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error al enviar correo:", error.message);
    throw new Error("No se pudo enviar el correo electrónico.");
  }
};
