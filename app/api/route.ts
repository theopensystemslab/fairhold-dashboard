import { NextResponse } from "next/server";
import { calculationSchema } from "../schemas/calculationSchema";
import * as calculationService from "../../services/calculationService";
import calculateFairhold from "../../models/calculateFairhold";
import { APIError } from "../../lib/calculator/exceptions";

export async function POST(req: Request) {
  try {
    // Parse and validate user input
    const data = await req.json();
    const input = calculationSchema.parse(data);
    const householdData = await calculationService.getHouseholdData(input);
    const processedData = calculateFairhold(householdData);
    return NextResponse.json(processedData);
  } catch (error) {
    console.log("ERROR: API - ", (error as Error).message);

    if (error instanceof APIError) {
      return NextResponse.json({ error }, { status: error.status });
    }

    const response = {
      error: {
        message: (error as Error).message,
        code: "UNHANDLED_EXCEPTION",
      },
    };
    return NextResponse.json(response, { status: 500 });
  }
}
