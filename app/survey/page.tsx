'use client';

import { useState, useEffect } from 'react';
import { Inter } from "next/font/google";
import ErrorBoundary from '../components/ErrorBoundary';
import { FormattedSurveyResults } from './types';
import { Age } from './components/graphs/Age';
import { AffordFairhold } from './components/graphs/AffordFairhold';
import { AnyMeansTenureChoice } from './components/graphs/AnyMeansTenureChoice';
import { Country } from './components/graphs/Country';
import { CurrentMeansTenureChoice } from './components/graphs/CurrentMeansTenureChoice';
import { HouseType } from './components/graphs/HouseType';
import { HousingOutcomes } from './components/graphs/HousingOutcomes';
import { LiveWith } from './components/graphs/LiveWith';
// import { Postcode } from './components/graphs/Postcode';
import { SupportDevelopment } from './components/graphs/SupportDevelopment';
import { SupportDevelopmentFactors } from './components/graphs/SupportDevelopmentFactors';
import { SupportNewFairhold } from './components/graphs/SupportNewFairhold';
// list records https://api.airtable.com/v0/{baseId}/{tableIdOrName}
// get record https://api.airtable.com/v0/{baseId}/{tableIdOrName}/{recordId}

const inter = Inter({
  weight: ["500", "600", "700", "800"],
  subsets: ["greek", "greek-ext", "latin", "latin-ext"],
});

export default function SurveyPage() {
  const [surveyData, setSurveyData] = useState<FormattedSurveyResults | null>(null); // using null as initial state since it seemed less verbose than an empty FormattedSurveyResults object
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
        if (!data.formattedResults) {
          throw new Error('Invalid API response structure');
        }
        setSurveyData(data.formattedResults);
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

  if (!surveyData) return <div>No survey data available</div>;

  return (
    <ErrorBoundary>
        <main className={`${inter.className} p-4 min-h-screen bg-[rgb(var(--background-end-rgb))]`}>
          <div className="flex flex-col m-4">
            <h1 className="h1-style text-2xl md:text-4xl">Fairhold survey results</h1>
              <div className="flex flex-col gap-4 mt-6">
            <div>
              <h2 className="text-xl md:text-2xl">So far, {surveyData.resultsCount} people have responded</h2>
              <div className="flex flex-col py-4">
                <h3 className="text-xl font-medium">Who has responded?</h3>
                <div className="flex flex-col md:flex-row">
                  <Country results={surveyData} />
                  <Age results={surveyData} />
                  {/* <Postcode results={surveyData} /> */}
                </div>
              </div>

              <div className="flex flex-col">
                <h3 className="text-xl font-medium">Housing preferences</h3>
                <div className="flex flex-col md:flex-row">
                  <HouseType results={surveyData} />
                  <LiveWith results={surveyData} />
                </div>
                <div className="flex flex-col md:flex-row">
                  <HousingOutcomes results={surveyData} />
                  <AffordFairhold results={surveyData} />
                </div>
                <div className="flex flex-col md:flex-row">
                  <CurrentMeansTenureChoice results={surveyData} />
                  <AnyMeansTenureChoice results={surveyData} />
                </div>
              </div>

              <div className="flex flex-col">
                <h3 className="text-xl font-medium">Attitudes towards development</h3>
                <div className="flex flex-col md:flex-row">
                  <SupportDevelopment results={surveyData} />
                  <SupportNewFairhold results={surveyData} />
                </div>
                <SupportDevelopmentFactors results={surveyData} />
              </div>
          </div>
        </div>
      </div>
    </main>
    </ErrorBoundary>
  );
}