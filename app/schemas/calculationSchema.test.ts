import { calculationSchema, maintenanceLevelSchema } from "../schemas/calculationSchema";
import { MAINTENANCE_LEVELS } from "../models/constants";

describe("calculationSchema", () => {
  it("should validate valid input (whole postcode)", () => {
    const validInput = {
      housePostcode: "SE17 1PE",
      houseBedrooms: 2,
      houseAge: 3,
      houseType: "D",
      maintenanceLevel: "medium",
    };

    const result = calculationSchema.parse(validInput);
    expect(result).toEqual({
      ...validInput,
      housePostcode: {
        outcode: "SE17",
        incode: "1PE",
        area: "SE",
        district: "SE17",
        sector: "SE17 1",
        postcode: "SE17 1PE"
      },
    });
  });

  it("should validate valid input (outward postcode only)", () => {
    const validInput = {
      housePostcode: "SE17",
      houseBedrooms: 2,
      houseAge: 3,
      houseType: "D",
      maintenanceLevel: "medium",
    };

    const result = calculationSchema.parse(validInput);
    expect(result).toEqual({
      ...validInput,
      housePostcode: {
        outcode: "SE17",
        incode: null,
        area: "SE",
        district: "SE17",
        sector: null,
        postcode: null
      },
    });
  });

  it("should throw error for invalid postcode", () => {
    const invalidInput = {
      housePostcode: "INVALID",
      houseBedrooms: 2,
      houseAge: 3,
      houseType: "D",
      maintenanceLevel: "medium",
    };

    expect(() => calculationSchema.parse(invalidInput)).toThrow();
  });

  it("should throw error for negative house age", () => {
    const invalidInput = {
      housePostcode: "SE17 1PE",
      houseBedrooms: 2,
      houseAge: -1,
      houseType: "D",
      maintenanceLevel: "medium",
    };

    expect(() => calculationSchema.parse(invalidInput)).toThrow();
  });

  it("should throw error for invalid house type", () => {
    const invalidInput = {
      housePostcode: "SE17 1PE",
      houseBedrooms: 2,
      houseAge: 3,
      houseType: "X", // invalid house type
      maintenanceLevel: "medium",
    };

    expect(() => calculationSchema.parse(invalidInput)).toThrow();
  });

  it("should throw error for invalid maintenance level", () => {
    const invalidInput = {
      housePostcode: "SE17 1PE",
      houseBedrooms: 2,
      houseAge: 3,
      houseType: "D",
      maintenanceLevel: "invalid",
    };

    expect(() => calculationSchema.parse(invalidInput)).toThrow();
  });
});

describe("maintenanceLevelSchema", () => {
  it("should validate all maintenance levels", () => {
    for (const level of Object.keys(MAINTENANCE_LEVELS)) {
      expect(() => maintenanceLevelSchema.parse(level)).not.toThrow();
    }
  });

  it("should throw for invalid maintenance level", () => {
    expect(() => maintenanceLevelSchema.parse("invalid")).toThrow();
  });
});