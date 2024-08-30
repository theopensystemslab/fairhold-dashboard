import { pricesPaidRepo } from "../data/pricesPaidRepo";

const getPricesPaidByPostcodeAndHouseType = async (
  postcodeDistrict: string,
  postcodeArea: string,
  postcodeSector: string,
  houseType: string
) => {
  return await pricesPaidRepo.getPricesPaidByPostcodeAndHouseType(
    postcodeDistrict,
    postcodeArea,
    postcodeSector,
    houseType
  );
};

export const pricesPaidService = {
  getPricesPaidByPostcodeAndHouseType,
};
