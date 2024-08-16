import prisma from "./db";

const getItl3ByPostcodeDistrict = async (
  postcodeDistrict: string
): Promise<string> => {
  try {
    const { itl3 } = await prisma.itlLookup.findFirstOrThrow({
      where: {
        postcode: postcodeDistrict,
        itl3: {
          not: null,
        },
      },
      select: {
        itl3: true,
      },
    });

    // Cast to string as 'not: null' clause in Prisma query does not type narrow
    return itl3 as string;
  } catch (error) {
    throw new Error(`Data error: Unable get get itl3 for postcode district ${postcodeDistrict}`);
  }
};

export const itlRepo = {
  getItl3ByPostcodeDistrict,
}
