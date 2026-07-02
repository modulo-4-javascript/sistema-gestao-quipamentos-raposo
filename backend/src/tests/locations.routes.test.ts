import request from "supertest";

import { app } from "../app";
import { LOCATION_SEED_IDS } from "../features/locations/locations.seed";
import { resetInMemoryData } from "../shared/data/resetInMemoryData";

describe("Locations routes", () => {
  beforeEach(() => {
    resetInMemoryData();
  });

  it("lists locations with pagination metadata", async () => {
    const response = await request(app).get("/api/v1/locations");

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(6);
    expect(response.body.meta).toMatchObject({
      page: 1,
      pageSize: 10,
      total: 6,
      totalPages: 1
    });
  });

  it("creates a location", async () => {
    const response = await request(app).post("/api/v1/locations").send({
      code: "AUD-01",
      name: "Auditorium 01",
      type: "OTHER",
      building: "Main Building",
      room: "A01"
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      code: "AUD-01",
      name: "Auditorium 01",
      status: "ACTIVE",
      equipmentCount: 0
    });
  });

  it("does not allow duplicated location code", async () => {
    const response = await request(app).post("/api/v1/locations").send({
      code: "LAB-01",
      name: "Duplicated Lab",
      type: "LABORATORY"
    });

    expect(response.status).toBe(409);
    expect(response.body.code).toBe("LOCATION_CODE_ALREADY_EXISTS");
  });

  it("blocks deleting a location with linked equipment", async () => {
    const response = await request(app).delete(
      `/api/v1/locations/${LOCATION_SEED_IDS.lab01}`
    );

    expect(response.status).toBe(409);
    expect(response.body).toMatchObject({
      code: "LOCATION_HAS_LINKED_EQUIPMENT",
      message: "This location has linked equipment and cannot be deleted."
    });
  });

  it("lists equipment linked to a location", async () => {
    const response = await request(app).get(
      `/api/v1/locations/${LOCATION_SEED_IDS.lab01}/equipment`
    );

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(2);
    expect(response.body.data[0].locationId).toBe(LOCATION_SEED_IDS.lab01);
  });

  it("lists equipment history related to a location", async () => {
    const response = await request(app).get(
      `/api/v1/locations/${LOCATION_SEED_IDS.lab01}/equipment-history`
    );

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBeGreaterThan(0);
    expect(response.body.data[0]).toHaveProperty("equipmentId");
  });
});
