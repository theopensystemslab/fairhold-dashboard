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
        expect(lifetime.lifetimeData[0].depreciatedHouseResaleValue.none).toBe(186560);
        expect(lifetime.lifetimeData[0].depreciatedHouseResaleValue.low).toBe(186560);
        expect(lifetime.lifetimeData[0].depreciatedHouseResaleValue.medium).toBe(186560);
        expect(lifetime.lifetimeData[0].depreciatedHouseResaleValue.high).toBe(186560);

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
        expect(lifetime.lifetimeData[0].depreciatedHouseResaleValue.low).toBe(depreciatedHouseY10);
    });
    it("depreciates the house over time", () => {
        // Test value changes over time
        expect(lifetime.lifetimeData[0].depreciatedHouseResaleValue.none).toBeGreaterThan(
            lifetime.lifetimeData[10].depreciatedHouseResaleValue.none);
        expect(lifetime.lifetimeData[0].depreciatedHouseResaleValue.low).toBeGreaterThan(
            lifetime.lifetimeData[10].depreciatedHouseResaleValue.low);
        expect(lifetime.lifetimeData[0].depreciatedHouseResaleValue.medium).toBeGreaterThan(
            lifetime.lifetimeData[10].depreciatedHouseResaleValue.medium);
        // depreciatedHouseResaleValueHighMaintenance isn't tested here because the addition of a major work causes price to rise
    })
});

it("correctly calculates depreciated house value for all maintenance levels", () => {
    expect(lifetime.lifetimeData[3].depreciatedHouseResaleValue.none).toBeCloseTo(173636.99)
    expect(lifetime.lifetimeData[20].depreciatedHouseResaleValue.low).toBeCloseTo(157202.92)
    expect(lifetime.lifetimeData[27].depreciatedHouseResaleValue.medium).toBeCloseTo(168197.27)
    expect(lifetime.lifetimeData[39].depreciatedHouseResaleValue.high).toBeCloseTo(203777.25) 

    expect(lifetime.lifetimeData[5].depreciatedHouseResaleValue.none).toBeLessThan(
        lifetime.lifetimeData[5].depreciatedHouseResaleValue.low);
    expect(lifetime.lifetimeData[5].depreciatedHouseResaleValue.low).toBeLessThan(
        lifetime.lifetimeData[5].depreciatedHouseResaleValue.medium);
    expect(lifetime.lifetimeData[5].depreciatedHouseResaleValue.medium).toBeLessThan(
        lifetime.lifetimeData[5].depreciatedHouseResaleValue.high);
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
