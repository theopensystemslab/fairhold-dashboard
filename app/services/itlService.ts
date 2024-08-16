import { itlRepo } from "../data/itlRepo";

const getByPostcodeDistrict = async (postcodeDistrict: string) => {
  return await itlRepo.getItl3ByPostcodeDistrict(postcodeDistrict);
}

export const itlService = {
  getByPostcodeDistrict,
}
