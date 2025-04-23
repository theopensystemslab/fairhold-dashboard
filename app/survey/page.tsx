'use client';

import { useState, useEffect } from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import { inter } from '../page';

// list records https://api.airtable.com/v0/{baseId}/{tableIdOrName}
// get record https://api.airtable.com/v0/{baseId}/{tableIdOrName}/{recordId}


export default function SurveyPage() {
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
            <div className="container mx-auto py-8">
                <h1 className="h1-style">Survey Results</h1>
                <div className="grid gap-4 mt-6">
                </div>
            </div>
        </main>
    </ErrorBoundary>
  );
}