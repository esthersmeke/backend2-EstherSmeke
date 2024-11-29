import bcrypt from "bcryptjs";

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidpassword = (user, password) =>
  bcrypt.compareSync(password, user.password);
