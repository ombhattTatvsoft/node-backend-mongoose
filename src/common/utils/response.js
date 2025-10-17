export const success = ({
  res,
  status = 200,
  message = "Request processed successfully",
  data = null,
}) => res.status(status).json({ message, data });

export const createError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const badRequest = (message = "Bad Request") => {
  return createError(message, 400);
};

export const unauthorized = (message = "Unauthorized") => {
  return createError(message, 401);
};

export const forbidden = (message = "Forbidden") => {
  return createError(message, 403);
};

export const notFound = (message = "Not Found") => {
  return createError(message, 404);
};

export const internalError = (message = "Internal Server Error") => {
  return createError(message, 500);
};
