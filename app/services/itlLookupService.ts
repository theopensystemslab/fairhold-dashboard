import * as repo from "../data/itlLookupRepo";

export const getByPostcodeDistrict = async (postcodeDistrict: string) => {
  return await repo.getItl3ByPostcodeDistrict(postcodeDistrict);
}
