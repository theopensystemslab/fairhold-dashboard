import { NextResponse } from 'next/server';
import Airtable from 'airtable';
import { RawResults } from '@/lib/survey/types';
import { aggregateResults } from '@/lib/survey/utils';

export async function GET() {
    const apiKey = process.env.AIRTABLE_PAT;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableId = process.env.AIRTABLE_TABLE_ID;

    if (!apiKey || !baseId || !tableId) {
        console.error('Missing required Airtable environment variables');
        return NextResponse.json(
          { error: 'Server configuration error' },
          { status: 500 }
        );
      }
    try {
        const base = new Airtable({ apiKey }).base(baseId);

        const rawResults = await base<RawResults>(tableId)
        .select({})
        .all();
        
        const resultsArray = rawResults.map(record => record.fields);

        const aggregatedResults = aggregateResults(resultsArray);
        return NextResponse.json(aggregatedResults);
    } catch (error) {
        console.error('Error fetching Airtable data:', error);
        return NextResponse.json(
        { error: 'Failed to fetch survey data' },
        { status: 500 }
        );
    }
}