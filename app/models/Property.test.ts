import { Property } from "./Property";
import { MAINTENANCE_LEVELS, HouseBreakdown } from './constants';
describe('Property', () => {
  beforeEach(() => {
    property = new Property({
      postcode: "MK14 7AG",
      houseType: "T",
      numberOfBedrooms: 2,
      age: 10,
      size: 88,
      maintenancePercentage: 0.015,
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
      maintenancePercentage: 0.015,
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
      maintenancePercentage: 0.015,
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
      age: 0,
      size: 88,
      maintenancePercentage: 0.015,
      newBuildPricePerMetre: 2120,
      averageMarketPrice: 218091.58,
      itl3: "TLG24",
    });
    expect(property.depreciatedBuildPrice).toBe(property.newBuildPrice);
  });

  describe('depreciation calculations (existing build)', () => { 
    test.each([
      ['foundations', 39177.6, 1, 0, 39177.6],
      ['internalLinings', 7462.4, .68, 2070.816, 7145.248],
      ['electricalAppliances', 7462.4, 0.167, 2070.816, 3317.04],
      ['ventilationServices', 7462.4, 0.333, 2070.816, 4555.8]
    ])('correctly calculates all values for %s', (component, expectedNewComponentValue, expectedDepreciationFactor, expectedMaintenanceAddition, expectedDepreciatedValue) => {
      const result = property.calculateComponentValue(
        component as keyof HouseBreakdown, 
        property.newBuildPrice,
        property.age,
        MAINTENANCE_LEVELS[0]
      );
      
      console.log({result})
      // New component value
      expect(Number(result.newComponentValue.toFixed(4))).toBeCloseTo(expectedNewComponentValue,1);
   
      // Depreciation factor
      expect(Number(result.depreciationFactor.toFixed(4))).toBeCloseTo(expectedDepreciationFactor,1);
   
      // Maintenance addition
      expect(Number(result.maintenanceAddition.toFixed(4))).toBeCloseTo(expectedMaintenanceAddition,1);

      // Depreciated values
      expect(Number(result.depreciatedComponentValue.toFixed(4))).toBeCloseTo(expectedDepreciatedValue,1);

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
      expect(property.depreciatedBuildPrice).toBeCloseTo(171467.3);
    });
});