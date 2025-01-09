import { NextResponse } from "next/server";
import { calculationSchema } from "../schemas/calculationSchema";
import * as calculationService from "../services/calculationService";
import calculateFairhold from "../models/testClasses";

export async function POST(req: Request) {
  try {
    // Parse and validate user input
    const data = await req.json();
    const input = calculationSchema.parse(data);
    const householdData = await calculationService.getHouseholdData(input);
    const processedData = calculateFairhold(householdData);
    return NextResponse.json(processedData);
  } catch (err) {
    console.log("ERROR: API - ", (err as Error).message);
    const response = { error: (err as Error).message };
    return NextResponse.json(response, { status: 500 });
  }
}
