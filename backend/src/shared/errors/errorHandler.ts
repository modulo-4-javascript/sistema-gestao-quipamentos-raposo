import type { ErrorRequestHandler } from "express";

import { AppError } from "./AppError";

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      code: error.code,
      message: error.message,
      ...(error.fields ? { fields: error.fields } : {})
    });
  }

  console.error(error);

  return response.status(500).json({
    code: "INTERNAL_SERVER_ERROR",
    message: "Internal server error."
  });
};
