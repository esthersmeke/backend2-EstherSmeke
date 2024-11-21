import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserRepository from "../repositories/userRepository.js";
import UserDTO from "../dto/UserDTO.js";

class UserService {
  async registerUser(userData) {
    const { email, password, ...rest } = userData;

    // Verifica si el usuario ya existe
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) throw new Error("El email ya está registrado");

    // Encripta la contraseña
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Crea el usuario
    return await UserRepository.createUser({
      email,
      password: hashedPassword,
      ...rest,
    });
  }

  async loginUser(email, password) {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new Error("Credenciales inválidas");

    // Verificar la contraseña
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) throw new Error("Credenciales inválidas");

    // Generar el token JWT con los datos necesarios
    const token = jwt.sign(
      {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        age: user.age,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Retornar el token y el usuario transformado con el DTO
    return { token, user: new UserDTO(user) };
  }

  async getUserProfile(userId) {
    const user = await UserRepository.findById(userId);
    if (!user) throw new Error("Usuario no encontrado");

    // Devuelve solo información relevante
    return {
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      age: user.age,
      role: user.role,
    };
  }

  async generatePasswordResetToken(email) {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new Error("Usuario no encontrado");

    // Genera un token de recuperación
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return token;
  }

  async resetPassword(userId, newPassword) {
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    return await UserRepository.updateUser(userId, {
      password: hashedPassword,
    });
  }
}

export default new UserService();
