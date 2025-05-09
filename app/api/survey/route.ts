import { NextResponse } from 'next/server';
import Airtable from 'airtable';
import { formatSurveyResults } from '../../survey/utils';
import { SurveyResults } from '@/app/survey/types';

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

        const records = await base(tableId)
        .select({})
        .all();

        const results = records.map(record => ({
          ...record.fields as SurveyResults,
        }));

        const formattedResults = formatSurveyResults(results)
        return NextResponse.json({ formattedResults });
    } catch (error) {
        console.error('Error fetching Airtable data:', error);
        return NextResponse.json(
        { error: 'Failed to fetch survey data' },
        { status: 500 }
        );
    }
}