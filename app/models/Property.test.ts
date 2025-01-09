import { Property } from "./Property";
import { HOUSE_BREAKDOWN_PERCENTAGES, MAINTENANCE_LEVELS } from './constants';

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
    property = new Property({
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
    expect(property).toBeInstanceOf(Property);
  });

  it("correctly returns newBuildPrice if newbuild", () => {
    property = new Property({
      postcode: "WV8 1HG",
      houseType: "T",
      numberOfBedrooms: 20,
      age: 0,
      size: 88,
      maintenancePercentage: 0.02,
      newBuildPricePerMetre: 2120,
      averageMarketPrice: 218091.58,
      itl3: "TLG24",
    });

    expect(property.depreciatedBuildPrice).toBe(property.newBuildPrice);
  });

  describe('depreciation calculations (existing build)', () => {

    it("correctly calculates newComponentValue for foundations", () => {
      const result = property.calculateComponentValue(
        'foundations',
        property.newBuildPrice,
        property.age,
        MAINTENANCE_LEVELS[0]
      );

      const expectedNewComponentValue = 
        property.newBuildPrice * 
        HOUSE_BREAKDOWN_PERCENTAGES.foundations.percentageOfHouse;

      expect(result.newComponentValue).toBe(expectedNewComponentValue);
      expect(result.maintenanceAddition).toBe(0); // Foundations should have no maintenance
    });

    it("correctly calculates depreciationFactor for internal linings", () => {
      const result = property.calculateComponentValue(
        'internalLinings',
        property.newBuildPrice,
        property.age,
        MAINTENANCE_LEVELS[0]
      );

      const expectedDepreciationFactor = 
        1 - (HOUSE_BREAKDOWN_PERCENTAGES.internalLinings.depreciationPercentageYearly * property.age);

      expect(result.depreciationFactor).toBe(expectedDepreciationFactor);
    });

    it("correctly calculates maintenanceAddition for electrical appliances", () => {
      const result = property.calculateComponentValue(
        'electricalAppliances',
        property.newBuildPrice,
        property.age,
        MAINTENANCE_LEVELS[0]
      );

      const expectedMaintenanceAddition = 
        MAINTENANCE_LEVELS[0] * 
        property.newBuildPrice * 
        property.age * 
        HOUSE_BREAKDOWN_PERCENTAGES.electricalAppliances.percentOfMaintenanceYearly;

      expect(result.maintenanceAddition).toBe(expectedMaintenanceAddition);
    });

    it("correctly calculates depreciatedComponentValue for ventilation services", () => {
      const result = property.calculateComponentValue(
        'ventilationServices',
        property.newBuildPrice,
        property.age,
        MAINTENANCE_LEVELS[0]
      );

      const component = HOUSE_BREAKDOWN_PERCENTAGES.ventilationServices;
      const newComponentValue = property.newBuildPrice * component.percentageOfHouse;
      const depreciationFactor = 1 - (component.depreciationPercentageYearly * property.age);
      const maintenanceAddition = 
        MAINTENANCE_LEVELS[0] * 
        property.newBuildPrice * 
        property.age * 
        component.percentOfMaintenanceYearly;

      const expectedValue = Math.max(
        (newComponentValue * depreciationFactor) + maintenanceAddition,
        0
      );

      expect(result.depreciatedComponentValue).toBe(expectedValue);
    });

    it("ensures depreciatedComponentValue never goes below 0", () => {
      const result = property.calculateComponentValue(
        'ventilationServices',
        property.newBuildPrice,
        100, // High age to test possible negative values
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
});