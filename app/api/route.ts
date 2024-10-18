import { NextResponse } from "next/server";
import { api, apiSchema } from "../schemas/apiSchema";
import { calculationSchema } from "../schemas/calculationSchema";
import * as calculationService from "../services/calculationService";
import calculateFairhold from "../models/testClasses";

export async function POST(req: Request) {
  try {
    // Parse and validate user input
    const data = await req.json();
    let input: api;
    if (!apiSchema.safeParse(data).success) {
      input = calculationSchema.parse(data);
    } else {
      input = data;
    }
    const householdData = await calculationService.getHouseholdData(input);
    const processedData = calculateFairhold(householdData);
    return NextResponse.json(processedData);
  } catch (err) {
    console.log("ERROR: API - ", (err as Error).message);
    const response = { error: (err as Error).message };
    return NextResponse.json(response, { status: 500 });
  }
}
