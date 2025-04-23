'use client';

import { useState, useEffect } from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import { inter } from '../page';
import { SurveyResults } from './types';

// list records https://api.airtable.com/v0/{baseId}/{tableIdOrName}
// get record https://api.airtable.com/v0/{baseId}/{tableIdOrName}/{recordId}


export default function SurveyPage() {
  const [surveyData, setSurveyData] = useState<SurveyResults[]>([]);
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
        console.log(data)
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
        <main className={inter.className}>
          <div className="flex flex-col items-center justify-center h-screen bg-[rgb(var(--background-end-rgb))]">
            <h1 className="h1-style">Survey Results</h1>
              <div className="flex flex-col gap-4 mt-6">
              {surveyData.length === 0 ? (
            <p>No survey responses found.</p>
          ) : (
            <div>
            <div className="flex flex-col gap-2">
                <h2 className="h2-style">Survey Question 1</h2>
                <p>Survey Answer 1</p>
            </div>
            <div className="flex flex-col gap-2">
                <h2 className="h2-style">Survey Question 2</h2>
                <p>Survey Answer 2</p>
            </div>
          </div>
          )}
            </div>
          </div>
        </main>
    </ErrorBoundary>
  );
}