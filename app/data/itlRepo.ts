import prisma from "./db";

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
    throw new Error(
      `Data error: Unable get get itl3 for postcode district ${postcodeDistrict}`
    );

  }
};

export const itlRepo = {
  getItl3ByPostcodeDistrict,
};

