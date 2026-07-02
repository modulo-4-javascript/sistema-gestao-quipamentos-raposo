import { z } from "zod";

import { EquipmentStatus } from "../equipment/equipment.types";
import { LocationStatus, LocationType } from "./locations.types";

const paginationFields = {
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10)
};

const optionalSearch = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().trim().optional()
);

const nullableText = (maxLength: number) =>
  z.string().trim().max(maxLength).nullable().optional();

export const locationIdParamsSchema = z.object({
  locationId: z.string().uuid()
});

export const listLocationsQuerySchema = z.object({
  search: optionalSearch,
  status: z.nativeEnum(LocationStatus).optional(),
  type: z.nativeEnum(LocationType).optional(),
  ...paginationFields
});

export const listLocationEquipmentQuerySchema = z.object({
  status: z.nativeEnum(EquipmentStatus).optional(),
  ...paginationFields
});

export const locationHistoryQuerySchema = z.object({
  ...paginationFields
});

export const createLocationBodySchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(2)
      .max(20)
      .regex(/^[A-Z0-9-]+$/),
    name: z.string().trim().min(2).max(120),
    type: z.nativeEnum(LocationType),
    building: z.string().trim().max(120).optional(),
    floor: z.string().trim().max(40).optional(),
    room: z.string().trim().max(40).optional(),
    description: nullableText(1000),
    status: z.nativeEnum(LocationStatus).default(LocationStatus.ACTIVE)
  })
  .strict();

export const updateLocationBodySchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(2)
      .max(20)
      .regex(/^[A-Z0-9-]+$/)
      .optional(),
    name: z.string().trim().min(2).max(120).optional(),
    type: z.nativeEnum(LocationType).optional(),
    building: z.string().trim().max(120).optional(),
    floor: z.string().trim().max(40).optional(),
    room: z.string().trim().max(40).optional(),
    description: nullableText(1000),
    status: z.nativeEnum(LocationStatus).optional()
  })
  .strict()
  .refine((body) => Object.keys(body).length > 0, {
    message: "At least one field must be provided."
  });

export const updateLocationStatusBodySchema = z
  .object({
    status: z.nativeEnum(LocationStatus),
    note: nullableText(500)
  })
  .strict();
