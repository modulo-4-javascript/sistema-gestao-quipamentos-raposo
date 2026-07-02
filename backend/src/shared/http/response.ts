import type { Response } from "express";

export function ok<T>(response: Response, data: T): Response {
  return response.status(200).json(data);
}

export function created<T>(response: Response, data: T): Response {
  return response.status(201).json(data);
}

export function noContent(response: Response): Response {
  return response.status(204).send();
}
