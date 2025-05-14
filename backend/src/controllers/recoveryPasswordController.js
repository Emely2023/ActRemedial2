import jsonwebtoken from "jsonwebtoken"; // Token
import bcryptjs from "bcryptjs"; // Asegúrate que esté bien escrito (era 'bycryptjs' antes)

import doctorModel from "../models/Doctor.js";
import { sendEmail, HTMLRecoveryEmail } from "../utils/mailPasswordRecovery.js";
import { config } from "../config.js";

const recoveryPasswordController = {};

// Enviar código de recuperación
recoveryPasswordController.requestCode = async (req, res) => {
  const { email } = req.body;

  try {
    const userFound = await doctorModel.findOne({ email });

    if (!userFound) {
      return res.json({ message: "User not found" });
    }

    // Generar código de 5 dígitos
    const code = Math.floor(10000 + Math.random() * 90000).toString();

    // Guardar en token
    const token = jsonwebtoken.sign(
      { email, code, verified: false },
      config.JWT.secret,
      { expiresIn: "20m" }
    );

    // Guardar token en cookie
    res.cookie("tokenRecoveryCode", token, { maxAge: 20 * 60 * 1000 });

    // Enviar correo
    await sendEmail(
      email,
      "Your Verification Code",
      "Hello! Here's your verification code.",
      HTMLRecoveryEmail(code)
    );

    res.json({ message: "Correo enviado a Emely" });
  } catch (error) {
    console.error("Error al enviar código:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Verificar código recibido
recoveryPasswordController.verifyCode = async (req, res) => {
  const { code } = req.body;

  try {
    const token = req.cookies.tokenRecoveryCode;

    const decoded = jsonwebtoken.verify(token, config.JWT.secret);

    if (decoded.code !== code) {
      return res.json({ message: "Invalid code" });
    }

    // Crear nuevo token marcado como verificado
    const newToken = jsonwebtoken.sign(
      {
        email: decoded.email,
        code: decoded.code,
        verified: true,
      },
      config.JWT.secret,
      { expiresIn: "20m" }
    );

    res.cookie("tokenRecoveryCode", newToken, { maxAge: 20 * 60 * 1000 });

    res.json({ message: "Código verificado con éxito" });
  } catch (error) {
    console.error("Error al verificar código:", error);
    res.status(401).json({ message: "Token inválido o expirado" });
  }
};
//Cambiar Contraseña
recoveryPasswordController.changePassword = async (req, res) => {
  const { newPassword } = req.body;

  try {
    const token = req.cookies.tokenRecoveryCode;
    const decoded = jsonwebtoken.verify(token, config.JWT.secret);

    if (!decoded.verified) {
      return res.status(401).json({ message: "Code not verified" });
    }

    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    await doctorModel.updateOne(
      { email: decoded.email },
      { $set: { password: hashedPassword } }
    );

    res.clearCookie("tokenRecoveryCode");
    res.json({ message: "Tu contraseña ha sido actualizada exitosamente" });
  } catch (error) {
    console.log("Error updating password: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export default recoveryPasswordController;
