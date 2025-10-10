import userRepo from "./user.repo.js";

export const createUser = async (data) => {
  const existingUser = await userRepo.findOne({ email: data.email });
  if (existingUser) {
    throw new Error("Email already in use");
  }
  return userRepo.create(data);
};

export const getUsers = async (query) => {
  return userRepo.findAll(query);
};

export const getUserByEmail = async (email) => {
  return await userRepo.findOne({ email });
};

export const getUserById = async (id) => {
  return await userRepo.findById(id);
};

export const updateUser = async (id, data) => {
  const existingUser = await userRepo.findById(id);
  if (!existingUser) {
    throw new Error("User not found");
  }
  return userRepo.updateById(id, data);
};

export const deleteUser = async (id) => {
  const existingUser = await userRepo.findById(id);
  if (!existingUser) {
    throw new Error("User not found");
  }
  return userRepo.deleteById(id);
};
