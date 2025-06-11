import { Property } from "./Property";
import { createTestProperty } from "./testHelpers"; 

let property = createTestProperty();

describe('Property', () => {
  beforeEach(() => {
    property = createTestProperty() 
  });

  it("can be instantiated", () => {
    expect(property).toBeInstanceOf(Property);
  });
  
  it("correctly calculates the newBuildPrice", () => {
    expect(property.newBuildPrice).toBeCloseTo(148400);
  });
  
  it("correctly calculates the landPrice", () => {
    expect(property.landPrice).toBeCloseTo(301600);
  });
  
  it("correctly calculates the landToTotalRatio", () => {
    expect(property.landToTotalRatio).toBeCloseTo(0.67);
  });
  
  it("correctly calculates the values even for number of bedroooms exceeding the max ", () => {
    property = createTestProperty({
      numberOfBedrooms: 20
    })
  });

  it("correctly returns newBuildPrice if newbuild", () => {
    property = createTestProperty({
      age: 0
    })

    expect(property.depreciatedBuildPrice).toBe(property.newBuildPrice);
  });

  describe('depreciation calculations (existing build)', () => {

    it("correctly calculates newComponentValue for foundations", () => {
      const result = property.calculateComponentValue(
        'foundations',
        property.newBuildPrice,
        property.age,
      );

      expect(result.newComponentValue).toBe(31164);
      expect(result.maintenanceAddition).toBe(0); // Foundations should have no maintenance
    });

    it("correctly calculates depreciationFactor for internal linings", () => {
      const result = property.calculateComponentValue(
        'internalLinings',
        property.newBuildPrice,
        property.age,
      );

      expect(result.depreciationFactor).toBe(.968);
    });

    it("correctly calculates maintenanceAddition for electrical appliances", () => {
      const result = property.calculateComponentValue(
        'electricalAppliances',
        property.newBuildPrice,
        property.age,
      );

      expect(result.maintenanceAddition).toBe(164.724);
    });

    it("correctly calculates depreciatedComponentValue for ventilation services", () => {
      const result = property.calculateComponentValue(
        'ventilationServices',
        property.newBuildPrice,
        property.age,
      );

      expect(result.depreciatedComponentValue).toBeCloseTo(5704.7928);
    });

    it("ensures depreciatedComponentValue never goes below 0", () => {
      const result = property.calculateComponentValue(
        'ventilationServices',
        property.newBuildPrice,
        100, // High age to test possible negative values
      );

      expect(result.depreciatedComponentValue).toBeGreaterThanOrEqual(0);
    });

    it('should calculate correct depreciation for a 10-year-old house', () => {
      property = createTestProperty({
        age: 10
      })
      expect(property.depreciatedBuildPrice).toBeCloseTo(136394.44);
    });
  });
});