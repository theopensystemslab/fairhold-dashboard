import { Lifetime } from "./Lifetime";
import { createTestProperty, createTestLifetime } from "./testHelpers";

let lifetime = createTestLifetime();

beforeEach(() => {
    lifetime = createTestLifetime();
})

it("can be instantiated", () => {
    expect(lifetime).toBeInstanceOf(Lifetime);
})

it("creates an array with the correct number of years", () => {
    expect(lifetime.lifetimeData).toHaveLength(40)
})

it("reduces mortgage payments to 0 after the mortgage term is reached", () => {
    expect(lifetime.lifetimeData[35].newbuildHouseMortgageYearly).toBe(0);
    expect(lifetime.lifetimeData[34].marketLandMortgageYearly).toBe(0);
    expect(lifetime.lifetimeData[33].fairholdLandMortgageYearly).toBe(0);
    expect(lifetime.lifetimeData[32].marketLandMortgageYearly).toBe(0);
})

describe("resale values", () => {
    it("correctly calculates for a newbuild house", () => {
        // Test newbuild (age 0)
        lifetime = createTestLifetime({
            property: createTestProperty({ age: 0 })
        });
        expect(lifetime.lifetimeData[0].depreciatedHouseResaleValueNoMaintenance).toBe(186560);
        expect(lifetime.lifetimeData[0].depreciatedHouseResaleValueLowMaintenance).toBe(186560);
        expect(lifetime.lifetimeData[0].depreciatedHouseResaleValueMediumMaintenance).toBe(186560);
        expect(lifetime.lifetimeData[0].depreciatedHouseResaleValueHighMaintenance).toBe(186560);

    });
    it("correctly calculates for a 10-year old house", () => {    // Test 10-year-old house
        lifetime = createTestLifetime({
            property: createTestProperty({ 
                age: 10,
                newBuildPricePerMetre: 2120,
                size: 88 
            })
        }); 
        // Calculate expected depreciation running `calculateDepreciatedBuildPrice()` method on its own
        const houseY10 = createTestProperty({ 
            age: 10,
            newBuildPricePerMetre: 2120,
            size: 88 
        })           
        const depreciatedHouseY10 = houseY10.calculateDepreciatedBuildPrice()
        expect(lifetime.lifetimeData[0].depreciatedHouseResaleValueLowMaintenance).toBe(depreciatedHouseY10);
    });
    it("depreciates the house over time", () => {
        // Test value changes over time
        expect(lifetime.lifetimeData[0].depreciatedHouseResaleValueNoMaintenance).toBeGreaterThan(
            lifetime.lifetimeData[10].depreciatedHouseResaleValueNoMaintenance);
        expect(lifetime.lifetimeData[0].depreciatedHouseResaleValueLowMaintenance).toBeGreaterThan(
            lifetime.lifetimeData[10].depreciatedHouseResaleValueLowMaintenance);
        expect(lifetime.lifetimeData[0].depreciatedHouseResaleValueMediumMaintenance).toBeGreaterThan(
            lifetime.lifetimeData[10].depreciatedHouseResaleValueMediumMaintenance);
        // depreciatedHouseResaleValueHighMaintenance isn't tested here because the addition of a major work causes price to rise
    })
});

it("correctly calculates depreciated house value for all maintenance levels", () => {
    expect(lifetime.lifetimeData[3].depreciatedHouseResaleValueNoMaintenance).toBeCloseTo(173636.99)
    expect(lifetime.lifetimeData[20].depreciatedHouseResaleValueLowMaintenance).toBeCloseTo(157202.92)
    expect(lifetime.lifetimeData[27].depreciatedHouseResaleValueMediumMaintenance).toBeCloseTo(168197.27)
    expect(lifetime.lifetimeData[39].depreciatedHouseResaleValueHighMaintenance).toBeCloseTo(203777.25) 

    expect(lifetime.lifetimeData[5].depreciatedHouseResaleValueNoMaintenance).toBeLessThan(
        lifetime.lifetimeData[5].depreciatedHouseResaleValueLowMaintenance);
    expect(lifetime.lifetimeData[5].depreciatedHouseResaleValueLowMaintenance).toBeLessThan(
        lifetime.lifetimeData[5].depreciatedHouseResaleValueMediumMaintenance);
    expect(lifetime.lifetimeData[5].depreciatedHouseResaleValueMediumMaintenance).toBeLessThan(
        lifetime.lifetimeData[5].depreciatedHouseResaleValueHighMaintenance);
})

it("correctly ages the house", () => {
    lifetime = createTestLifetime({
        property: createTestProperty({ age: 10 }) 
    })

    expect(lifetime.lifetimeData[0].houseAge).toBe(10);
    expect(lifetime.lifetimeData[5].houseAge).toBe(15);
    expect(lifetime.lifetimeData[20].houseAge).toBe(30);
    expect(lifetime.lifetimeData[39].houseAge).toBe(49);
})
