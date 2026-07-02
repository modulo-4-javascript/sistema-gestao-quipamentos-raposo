import { z } from "zod";

import { EquipmentStatus, EquipmentType } from "./equipment.types";

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

export const equipmentIdParamsSchema = z.object({
  equipmentId: z.string().uuid()
});

export const listEquipmentQuerySchema = z.object({
  search: optionalSearch,
  status: z.nativeEnum(EquipmentStatus).optional(),
  type: z.nativeEnum(EquipmentType).optional(),
  locationId: z.string().uuid().optional(),
  ...paginationFields
});

export const createEquipmentBodySchema = z
  .object({
    name: z.string().trim().min(2).max(120),
    type: z.nativeEnum(EquipmentType).default(EquipmentType.OTHER),
    model: z.string().trim().max(120).optional(),
    serialNumber: z.string().trim().max(80).optional(),
    status: z.nativeEnum(EquipmentStatus).default(EquipmentStatus.AVAILABLE),
    locationId: z.string().uuid().nullable().optional(),
    responsibleUserId: z.string().uuid().nullable().optional(),
    notes: nullableText(1000)
  })
  .strict();

export const updateEquipmentBodySchema = z
  .object({
    name: z.string().trim().min(2).max(120).optional(),
    type: z.nativeEnum(EquipmentType).optional(),
    model: z.string().trim().max(120).optional(),
    serialNumber: z.string().trim().max(80).optional(),
    status: z.nativeEnum(EquipmentStatus).optional(),
    locationId: z.string().uuid().nullable().optional(),
    responsibleUserId: z.string().uuid().nullable().optional(),
    notes: nullableText(1000)
  })
  .strict()
  .refine((body) => Object.keys(body).length > 0, {
    message: "At least one field must be provided."
  });

export const updateEquipmentStatusBodySchema = z
  .object({
    status: z.nativeEnum(EquipmentStatus),
    note: nullableText(500)
  })
  .strict();
