import { Property } from "./Property";
import { MAINTENANCE_LEVELS } from "./constants";
import { createTestProperty } from "./testHelpers";

let property = createTestProperty();

describe("Property", () => {
  beforeEach(() => {
    property = createTestProperty();
  });

  it("can be instantiated", () => {
    expect(property).toBeInstanceOf(Property);
  });

  it("correctly calculates the newBuildPrice", () => {
    expect(property.newBuildPrice).toBeCloseTo(186560);
  });

  it("correctly calculates the landPrice", () => {
    expect(property.landPrice).toBeCloseTo(313440);
  });

  it("correctly calculates the landToTotalRatio", () => {
    expect(property.landToTotalRatio).toBeCloseTo(0.62688);
  });

  it("correctly calculates the values even for number of bedroooms exceeding the max ", () => {
    property = createTestProperty({
      numberOfBedrooms: 20,
    });
  });

  it("correctly returns newBuildPrice if newbuild", () => {
    property = createTestProperty({
      age: 0,
    });

    expect(property.depreciatedBuildPrice).toBe(property.newBuildPrice);
  });

  describe("depreciation calculations (existing build)", () => {
    it("correctly calculates newComponentValue for foundations", () => {
      const result = property.calculateComponentValue(
        "foundations",
        property.newBuildPrice,
        property.age,
        MAINTENANCE_LEVELS[1]
      );

      expect(result.newComponentValue).toBe(39177.6);
      expect(result.maintenanceAddition).toBe(0); // Foundations should have no maintenance
    });

    it("correctly calculates depreciationFactor for internal linings", () => {
      const result = property.calculateComponentValue(
        "internalLinings",
        property.newBuildPrice,
        property.age,
        MAINTENANCE_LEVELS[1]
      );

      expect(result.depreciationFactor).toBe(0.968);
    });

    it("correctly calculates maintenanceAddition for electrical appliances", () => {
      const result = property.calculateComponentValue(
        "electricalAppliances",
        property.newBuildPrice,
        property.age,
        MAINTENANCE_LEVELS[1]
      );

      expect(result.maintenanceAddition).toBe(207.0816);
    });

    it("correctly calculates depreciatedComponentValue for ventilation services", () => {
      const result = property.calculateComponentValue(
        "ventilationServices",
        property.newBuildPrice,
        property.age,
        MAINTENANCE_LEVELS[1]
      );

      expect(result.depreciatedComponentValue).toBeCloseTo(7171.739);
    });

    it("ensures depreciatedComponentValue never goes below 0", () => {
      const result = property.calculateComponentValue(
        "ventilationServices",
        property.newBuildPrice,
        100, // High age to test possible negative values
        MAINTENANCE_LEVELS[1]
      );

      expect(result.depreciatedComponentValue).toBeGreaterThanOrEqual(0);
    });

    it("should calculate correct depreciation for a 10-year-old house", () => {
      property = createTestProperty({
        age: 10,
      });
      expect(property.depreciatedBuildPrice).toBeCloseTo(171467.3);
    });
  });
});
