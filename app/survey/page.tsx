'use client';

import { useState, useEffect } from 'react';
import { Inter } from "next/font/google";
import ErrorBoundary from '../components/ErrorBoundary';
import { SurveyResults } from './types';
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
  const [surveyData, setSurveyData] = useState<SurveyResults | null>(null);
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

        setSurveyData(data);
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
  if (!surveyData) return <div>No survey data available.</div>;
  
  const results = surveyData as SurveyResults;
  return (
    <ErrorBoundary>
        <main className={`${inter.className} p-4 min-h-screen bg-[rgb(var(--background-end-rgb))]`}>
          <div className="flex flex-col m-4">
            <h1 className="h1-style text-2xl md:text-4xl">Fairhold survey results</h1>
              <div className="flex flex-col gap-4 mt-6">
              {surveyData.numberResponses === 0 ? (
            <p>No survey responses found.</p>
          ) : (
            <div>
              <h2 className="text-xl md:text-2xl">So far, {surveyData.numberResponses} people have responded</h2>
              <div className="flex flex-col py-4">
                <h3 className="text-xl font-medium">Who has responded?</h3>
                <div className="flex flex-col md:flex-row">
                  <Country {...results.barOrPie} />
                  <Age {...results.barOrPie} />
                  {/* <Postcode {...results} /> */}
                </div>
              </div>

              <div className="flex flex-col">
                <h3 className="text-xl font-medium">Housing preferences</h3>
                <div className="flex flex-col md:flex-row">
                  <HouseType {...results.sankey} />
                  <LiveWith {...results.sankey} />
                </div>
                <div className="flex flex-col md:flex-row">
                  <HousingOutcomes {...results.barOrPie} />
                  <AffordFairhold {...results.barOrPie} />
                </div>
                <div className="flex flex-col md:flex-row">
                  <CurrentMeansTenureChoice {...results.sankey} />
                  <AnyMeansTenureChoice {...results.sankey} />
                </div>
              </div>

              <div className="flex flex-col">
                <h3 className="text-xl font-medium">Attitudes towards development</h3>
                <div className="flex flex-col md:flex-row">
                  <SupportDevelopment {...results.barOrPie} />
                  <SupportNewFairhold {...results.barOrPie} />
                </div>
                <SupportDevelopmentFactors {...results.barOrPie} />
              </div>
          </div>
          )}
            </div>
          </div>
        </main>
    </ErrorBoundary>
  );
}