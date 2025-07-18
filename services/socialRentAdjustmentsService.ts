import { socialRentAdjustmentsRepo } from "../data/socialRentAdjustmentsRepo";

const getAdjustments = async () => {
  return await socialRentAdjustmentsRepo.getSocialRentAdjustments()
};

export const socialRentAdjustmentsService = {
  getAdjustments,
}
