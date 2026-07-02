import request from "supertest";

import { app } from "../app";
import { EQUIPMENT_SEED_IDS } from "../features/equipment/equipment.seed";
import { EquipmentHistoryType } from "../features/history/history.types";
import { LOCATION_SEED_IDS } from "../features/locations/locations.seed";
import { resetInMemoryData } from "../shared/data/resetInMemoryData";

describe("Equipment routes", () => {
  beforeEach(() => {
    resetInMemoryData();
  });

  it("lists equipment with pagination metadata", async () => {
    const response = await request(app).get("/api/v1/equipment");

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(6);
    expect(response.body.meta).toMatchObject({
      page: 1,
      pageSize: 10,
      total: 6,
      totalPages: 1
    });
  });

  it("creates equipment with default status and generated code", async () => {
    const response = await request(app).post("/api/v1/equipment").send({
      name: "Lenovo Notebook",
      type: "NOTEBOOK",
      model: "ThinkPad E14",
      locationId: LOCATION_SEED_IDS.lab02
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      code: "EQP-007",
      name: "Lenovo Notebook",
      type: "NOTEBOOK",
      status: "AVAILABLE",
      locationId: LOCATION_SEED_IDS.lab02
    });
    expect(response.body.id).toEqual(expect.any(String));
  });

  it("validates equipment creation without name", async () => {
    const response = await request(app).post("/api/v1/equipment").send({
      type: "MONITOR"
    });

    expect(response.status).toBe(422);
    expect(response.body.code).toBe("VALIDATION_ERROR");
    expect(response.body.fields[0].field).toBe("name");
  });

  it("gets equipment by id", async () => {
    const response = await request(app).get(
      `/api/v1/equipment/${EQUIPMENT_SEED_IDS.notebook}`
    );

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: EQUIPMENT_SEED_IDS.notebook,
      name: "Dell Notebook"
    });
  });

  it("updates equipment status", async () => {
    const response = await request(app)
      .patch(`/api/v1/equipment/${EQUIPMENT_SEED_IDS.notebook}/status`)
      .send({
        status: "INACTIVE",
        note: "Equipment reserved for audit."
      });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("INACTIVE");
  });

  it("creates history when equipment status changes", async () => {
    await request(app)
      .patch(`/api/v1/equipment/${EQUIPMENT_SEED_IDS.notebook}/status`)
      .send({
        status: "IN_MAINTENANCE",
        note: "Sent to preventive maintenance."
      });

    const historyResponse = await request(app).get(
      `/api/v1/equipment/${EQUIPMENT_SEED_IDS.notebook}/history`
    );

    expect(historyResponse.status).toBe(200);
    expect(historyResponse.body[0]).toMatchObject({
      type: EquipmentHistoryType.STATUS_CHANGED,
      equipmentId: EQUIPMENT_SEED_IDS.notebook,
      description: "Sent to preventive maintenance."
    });
  });
});
