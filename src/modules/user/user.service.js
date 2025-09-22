import userRepo from "./user.repo.js";

export const createUser = async (data) => {
  return userRepo.create(data);
};

export const getUsers = async (query) => {
  return userRepo.findAll({}, query);
};

export const getUserById = async (id) => {
  return userRepo.findById(id);
};

export const updateUser = async (id, data) => {
  return userRepo.updateById(id, data);
};

export const deleteUser = async (id) => {
  return userRepo.deleteById(id);
};
