import { SocialValue } from "./SocialValue";
import { createTestHousehold } from "./testHelpers";

const household = createTestHousehold();
const socialValue = household.socialValue
describe('Social Value', () => {
})
    it("can be instantiated", () => {
        expect(socialValue).toBeInstanceOf(SocialValue)
    })

    it("calculates money saved", () => {
        expect(socialValue.moneySaved).toBeCloseTo(481215.981)
    })
    it("calculates money to community", () => {
        expect(socialValue.communityWealthLifetime).toBeCloseTo(5425.91)
    })
    it("calculates energy bill savings", () => {
        expect(socialValue.savingsEnergyPoundsYearly).toBeCloseTo(554.4)
    })
    it("calculates amount generated for local jobs", () => {
        expect(socialValue.localJobs).toBeCloseTo(3.2)
    })
    it("calculates operational carbon savings", () => {
        expect(socialValue.operationalCarbonSavingsYearly).toBeCloseTo(1.465)
    })

