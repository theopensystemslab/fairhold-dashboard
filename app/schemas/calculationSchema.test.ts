import { calculationSchema, maintenanceLevelSchema } from "../schemas/calculationSchema";
import { MAINTENANCE_LEVELS } from "../models/constants";

describe("calculationSchema", () => {
  it("should validate valid input", () => {
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
        area: "SE",
        district: "SE17",
        incode: "1PE",
        outcode: "SE17",
        postcode: "SE17 1PE",
        sector: "SE17 1",
        subDistrict: null,
        unit: "PE",
        valid: true,
      },
      houseSize: 70, // auto-assigned for 2 bedrooms
    });
  });

  it("should validate input with explicit house size", () => {
    const inputWithSize = {
      housePostcode: "SE17 1PE",
      houseBedrooms: 2,
      houseSize: 100,
      houseAge: 3,
      houseType: "D",
      maintenanceLevel: "medium",
    };

    const result = calculationSchema.parse(inputWithSize);
    
    expect(result.houseSize).toBe(100);
  });

  it("should auto-assign correct house size based on bedrooms", () => {
    // Test all the size mappings
    const testCases = [
      { bedrooms: 1, expectedSize: 55 },
      { bedrooms: 2, expectedSize: 70 },
      { bedrooms: 3, expectedSize: 95 },
      { bedrooms: 4, expectedSize: 110 },
      { bedrooms: 5, expectedSize: 125 },
      { bedrooms: 6, expectedSize: 135 },
      { bedrooms: 7, expectedSize: 135 }, // more than 6 should get 135
    ];

    for (const { bedrooms, expectedSize } of testCases) {
      const input = {
        housePostcode: "SE17 1PE",
        houseBedrooms: bedrooms,
        houseAge: 3,
        houseType: "D",
        maintenanceLevel: "medium",
      };
      
      const result = calculationSchema.parse(input);
      expect(result.houseSize).toBe(expectedSize);
    }
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