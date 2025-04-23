'use client';

import { useState, useEffect } from 'react';
import ErrorBoundary from '../components/ErrorBoundary';

type SurveyResponse = {
    id: string;
    uk: string;
    nonUk: string;
    postcode: string;
    ageGroup: string;
    houseType: string;
    currentTenure: string;
    ownershipModel?: string | null;
    rentalModel?: string | null;
    liveWith: string;
    secondHomes: string;
    idealHouseType: string;
    idealLiveWith: string;
    housingOutcomes: string[];
    fairholdCalculator: string;
    affordFairhold: string;
    currentMeansTenureChoice: string;
    whyFairhold?: string[];
    whyNotFairhold?: string[];
    anyMeansTenureChoice: string[];
    supportDevelopment: string;
    supportDevelopmentFactors: string[];
    supportNewFairhold: string;
};

// list records https://api.airtable.com/v0/{baseId}/{tableIdOrName}
// get record https://api.airtable.com/v0/{baseId}/{tableIdOrName}/{recordId}


export default function SurveyPage() {
  const [surveyData, setSurveyData] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSurveyData = async () => {
      try {
        const response = await fetch('/api/survey');
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        setSurveyData(data.results);
      } catch (err) {
        setError('Failed to fetch survey data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSurveyData();
  }, []);

  if (loading) return <div>Loading survey data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ErrorBoundary>
      <div className="container mx-auto py-8">
        <h1 className="h1-style">Survey Results</h1>
        <div className="grid gap-4 mt-6">
          {surveyData.length === 0 ? (
            <p>No survey responses found.</p>
          ) : (
            surveyData.map((response) => (
              <div key={response.id} className="border p-4 rounded-lg">
                {/* Adjust this to display relevant fields from your Airtable data */}
                <pre>{JSON.stringify(response, null, 2)}</pre>
              </div>
            ))
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}