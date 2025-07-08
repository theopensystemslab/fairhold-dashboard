import prisma from "./db";
import { APIError } from "../lib/calculator/exceptions";

const getItl3ByPostcodeDistrict = async (
  postcodeDistrict: string
): Promise<string> => {
  try {
    const { itl3 } = await prisma.itlLookup.findFirstOrThrow({
      where: {
        postcode: postcodeDistrict,
      },
      select: {
        itl3: true,
      },
    });

    return itl3;
  } catch (error) {
    throw new APIError({
      status: 500,
      message: `Data error: Unable get itl3 for postcode district ${postcodeDistrict}`,
      code: "ITL3_NOT_FOUND"
    });
  }
};

export const itlRepo = {
  getItl3ByPostcodeDistrict,
};

