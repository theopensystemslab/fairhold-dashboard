import { Property } from "./Property";
import { HOUSE_BREAKDOWN_PERCENTAGES, MAINTENANCE_LEVELS, HouseBreakdown } from './constants';
describe('Property', () => {
  beforeEach(() => {
    property = new Property({
      postcode: "MK14 7AG",
      houseType: "T",
      numberOfBedrooms: 2,
      age: 10,
      size: 88,
      maintenancePercentage: 0.02,
      newBuildPricePerMetre: 2120,
      averageMarketPrice: 219135,
      itl3: "TLJ12",
    });
  });

  let property: Property;

  it("can be instantiated", () => {
    expect(property).toBeInstanceOf(Property);
  });
  
  it("correctly calculates the newBuildPrice", () => {
    expect(property.newBuildPrice).toBeCloseTo(186560);
  });

  it("correctly calculates the bedWeightedAveragePrice", () => {
    expect(property.bedWeightedAveragePrice).toBeCloseTo(219135);
  });
  
  it("correctly calculates the landPrice", () => {
    expect(property.landPrice).toBeCloseTo(32575);
  });
  
  it("correctly calculates the landToTotalRatio", () => {
    expect(property.landToTotalRatio).toBeCloseTo(0.1446);
  });
  
  it("correctly calculates the values even for number of bedroooms exceeding the max ", () => {
    // Any bedroom size bigger than 6 beds should be treated as 6 beds, so this compares one instantiated with 20 beds with one instantiated with 6
    const propertyBig = new Property({
      postcode: "WV8 1HG",
      houseType: "T",
      numberOfBedrooms: 20,
      age: 11,
      size: 88,
      maintenancePercentage: 0.02,
      newBuildPricePerMetre: 2120,
      averageMarketPrice: 218091.58,
      itl3: "TLG24",
    });

    const propertySmall = new Property({
      postcode: "WV8 1HG",
      houseType: "T",
      numberOfBedrooms: 6,
      age: 11,
      size: 88,
      maintenancePercentage: 0.02,
      newBuildPricePerMetre: 2120,
      averageMarketPrice: 218091.58,
      itl3: "TLG24",
    });

    expect(propertyBig.bedWeightedAveragePrice).toEqual(propertySmall.bedWeightedAveragePrice);
  });

  it("correctly returns newBuildPrice if newbuild", () => {
    property = new Property({
      postcode: "WV8 1HG",
      houseType: "T",
      numberOfBedrooms: 20,
      age: 1,
      size: 88,
      maintenancePercentage: 0.02,
      newBuildPricePerMetre: 2120,
      averageMarketPrice: 218091.58,
      itl3: "TLG24",
    });

    expect(property.depreciatedBuildPrice).toBe(property.newBuildPrice);
  });

  describe('depreciation calculations (existing build)', () => {
    test.each([
      ['foundations', 0, 0], // component, depreciationPercentageYearly, percentOfMaintenanceYearly
      ['internalLinings', 0.032, 0.074],
      ['electricalAppliances', 0.0833, 0.074],
      ['ventilationServices', 0.0667, 0.074]
    ])('correctly calculates all values for %s', (component, depreciationRate, maintenanceRate) => {
      const result = property.calculateComponentValue(
        component as keyof HouseBreakdown, 
        property.newBuildPrice,
        property.age,
        MAINTENANCE_LEVELS[0]
      );
   
      const breakdown = HOUSE_BREAKDOWN_PERCENTAGES[component as keyof HouseBreakdown];
   
      // New component value
      const expectedNewComponentValue = property.newBuildPrice * breakdown.percentageOfHouse;
      expect(result.newComponentValue).toBe(expectedNewComponentValue);
   
      // Depreciation factor
      const expectedDepreciationFactor = 1 - (depreciationRate * property.age);
      expect(result.depreciationFactor).toBe(expectedDepreciationFactor);
   
      // Maintenance addition
      const expectedMaintenanceAddition = 
        MAINTENANCE_LEVELS[0] * property.newBuildPrice * property.age * maintenanceRate;
      expect(result.maintenanceAddition).toBe(expectedMaintenanceAddition);
   
      // Final depreciated value
      const expectedValue = Math.max(
        (expectedNewComponentValue * expectedDepreciationFactor) + expectedMaintenanceAddition,
        0
      );
      expect(result.depreciatedComponentValue).toBe(expectedValue);
    });
   });

  test.each([
    [10, "age 10"],
    [50, "age 50"],
    [100, "age 100"],
    [200, "extreme age 200"]
  ])("ensures depreciatedComponentValue never goes below 0 at %s", (age) => {
  const result = property.calculateComponentValue(
    'ventilationServices', 
    property.newBuildPrice,
    age,
    MAINTENANCE_LEVELS[0]
  );

    expect(result.depreciatedComponentValue).toBeGreaterThanOrEqual(0);
    });

    it('should calculate correct depreciation for a 10-year-old house', () => {
      // Calculate the expected value manually
      const newBuildPrice = property.newBuildPrice;
      let expectedDepreciatedPrice = 0;

      // Calculate for each component (mimicking calculateComponentValue())
      for (const [key, value] of Object.entries(HOUSE_BREAKDOWN_PERCENTAGES)) {
        const newComponentValue = newBuildPrice * value.percentageOfHouse;
        const depreciationFactor = 1 - (value.depreciationPercentageYearly * property.age);
        
        const maintenanceAddition = (key === 'foundations' || key === 'structureEnvelope') 
          ? 0 
          : MAINTENANCE_LEVELS[0] * newBuildPrice * property.age * value.percentOfMaintenanceYearly;

        const depreciatedComponentValue = Math.max(
          (newComponentValue * depreciationFactor) + maintenanceAddition,
          0
        );

        expectedDepreciatedPrice += depreciatedComponentValue;
      }

      expect(property.depreciatedBuildPrice).toBeCloseTo(Number(expectedDepreciatedPrice.toFixed(2)));
    });
});