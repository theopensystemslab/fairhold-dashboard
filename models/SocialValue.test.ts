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
        expect(socialValue.moneySaved).toBeCloseTo(549796.967)
    })
    it("calculates money to community", () => {
        expect(socialValue.communityWealthLifetime).toBeCloseTo(46231.878)
    })
    it("calculates energy bill savings", () => {
        expect(socialValue.savingsEnergyPoundsYearly).toBeCloseTo(441)
    })
    it("calculates amount generated for local jobs", () => {
        expect(socialValue.localJobs).toBeCloseTo(2.5)
    })
    it("calculates operational carbon savings", () => {
        expect(socialValue.operationalCarbonSavingsYearly).toBeCloseTo(1.1655)
    })

