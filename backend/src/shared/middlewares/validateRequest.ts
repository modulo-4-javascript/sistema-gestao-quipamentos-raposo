import type { RequestHandler } from "express";
import { ZodError, type ZodTypeAny } from "zod";

import { AppError } from "../errors/AppError";

type RequestSchemas = {
  body?: ZodTypeAny;
  params?: ZodTypeAny;
  query?: ZodTypeAny;
};

export function validateRequest(schemas: RequestSchemas): RequestHandler {
  return (request, _response, next) => {
    try {
      if (schemas.params) {
        request.params = schemas.params.parse(request.params);
      }

      if (schemas.query) {
        request.query = schemas.query.parse(request.query);
      }

      if (schemas.body) {
        request.body = schemas.body.parse(request.body);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(
          new AppError(
            422,
            "VALIDATION_ERROR",
            "Invalid request data.",
            error.issues.map((issue) => ({
              field: issue.path.join("."),
              message: issue.message
            }))
          )
        );
      }

      next(error);
    }
  };
}
