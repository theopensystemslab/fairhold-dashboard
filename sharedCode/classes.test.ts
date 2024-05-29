import { Mortgage } from "./classes"

describe("Mortgage class", () => {
  it("can be instantiated", () => {
    const mortgage = new Mortgage(1, 0.1, 25, 200);
    expect(mortgage).toBeDefined();
  });

  it("correctly calculates the amount", () => {
    const mortgage = new Mortgage(1, 0.1, 25, 200);
    const result = mortgage.calculateamountOfTheMortgage();
    expect(result).toBe(-199);
  });
})