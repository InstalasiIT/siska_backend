import bcrypt from "bcrypt";

const saltRounds = 10;

export const hashPassword = async (plainPassword) => {
  const hash = await bcrypt.hash(plainPassword, saltRounds);
  return hash;
};

export const verifyPassword = async (plainPassword, hashedPassword) => {
  const match = await bcrypt.compare(plainPassword, hashedPassword);
  return match;
};
