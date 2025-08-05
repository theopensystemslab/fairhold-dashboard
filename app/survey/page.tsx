'use client';

import { useState, useEffect } from 'react';
import ErrorBoundary from '@components/custom/ErrorBoundary';
import { SurveyResults } from '@lib/survey/types';
import { Age } from '@components/custom/survey/graphs/Age';
import { AffordFairhold } from '@components/custom/survey/graphs/AffordFairhold';
import { AnyMeansTenureChoice } from '@components/custom/survey/graphs/AnyMeansTenureChoice';
import { Country } from '@components/custom/survey/graphs/Country';
import { CurrentMeansTenureChoice } from '@components/custom/survey/graphs/CurrentMeansTenureChoice';
import { IdealHouseType } from '@components/custom/survey/graphs/IdealHouseType';
import { HousingOutcomes } from '@components/custom/survey/graphs/HousingOutcomes';
import { IdealLiveWith } from '@components/custom/survey/graphs/IdealLiveWith';
// import { Postcode } from './components/graphs/Postcode';
import { SupportDevelopment } from '@components/custom/survey/graphs/SupportDevelopment';
import { SupportDevelopmentFactors } from '@components/custom/survey/graphs/SupportDevelopmentFactors';
import { SupportNewFairhold } from '@components/custom/survey/graphs/SupportNewFairhold';
import { WhyFairhold } from '@components/custom/survey/graphs/WhyFairhold';
import { WhyNotFairhold } from '@components/custom/survey/graphs/WhyNotFairhold';
import { SurveyContext } from '@context/surveyContext';
// list records https://api.airtable.com/v0/{baseId}/{tableIdOrName}
// get record https://api.airtable.com/v0/{baseId}/{tableIdOrName}/{recordId}
import { Header } from "@components/custom/ui/Header";
import { Footer } from "@components/custom/ui/Footer";
import Highlight from "@components/custom/ui/Highlight";

export default function SurveyPage() {
  const [surveyResults, setSurveyResults] = useState<SurveyResults | null>(null);
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

        setSurveyResults(data);
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
  if (!surveyResults) return <div>No survey data available.</div>;

  return (
    <ErrorBoundary>
      <div className="min-h-screen w-full bg-gray-50">
      <Header />
      <div className="hidden md:block top-spacer"/>
        <SurveyContext.Provider value={surveyResults}>
        <main className="flex justify-center main-content">
          <section className="w-full max-w-[960px] flex flex-row py-8">
            <div className="flex flex-row">
                <div className="w-full flex flex-col p-4">
                  <h1 className="h1-style text-2xl md:text-4xl">Fairhold survey results</h1>
                    <div className="flex flex-col gap-4 mt-6">
                    {surveyResults.numberResponses === 0 ? (
                  <p>No survey responses found.</p>
                ) : (
                  <div>
                    <p className="text-lg md:text-xl">So far, <Highlight>{surveyResults.numberResponses}</Highlight> people have responded.</p>
                    
                    <div className="flex flex-col py-4">
                      <h2 className="text-xl font-bold">Who has responded?</h2>
                      <div className="flex flex-col md:flex-row md:h-[30rem] p-4">
                        <Country />
                        <Age />
                        {/* <Postcode {...results} /> */}
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <h2 className="text-xl font-bold">Housing preferences</h2>
                      <div className="flex flex-col md:flex-row md:h-[30rem] p-4">
                        <IdealHouseType />
                        <IdealLiveWith />
                      </div>
                      <div className="flex flex-col md:flex-row md:h-[30rem] p-4">
                        <HousingOutcomes />
                        <AffordFairhold />
                      </div>
                      <div className="flex flex-col md:flex-row md:h-[50rem] p-4">
                        <CurrentMeansTenureChoice />
                      </div>
                      <div className="flex flex-col md:flex-row md:h-[30rem] p-4">
                        <WhyFairhold />
                        <WhyNotFairhold />
                      </div>
                      <div className="flex flex-col md:flex-row  md:h-[30rem] p-4">
                        <div className="md:w-1/2 w-full mr-4">
                          <AnyMeansTenureChoice />
                        </div>
                        <div className="md:w-1/2 md:mr-4 hidden"></div>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <h2 className="text-xl font-bold">Attitudes towards development</h2>
                      <div className="flex flex-col md:flex-row w-full md:gap-8 p-4">
                        <div className="flex flex-col md:w-1/2 w-full md:h-[60rem]">
                          <div className="flex-1 flex flex-col"> 
                            <SupportDevelopment />
                          </div>
                          <div className="flex-1 flex flex-col">
                            <SupportNewFairhold />
                          </div>
                        </div>
                        <div className="flex flex-col md:flex-row md:w-1/2 w-full md:h-[60rem]">
                          <SupportDevelopmentFactors />
                        </div>
                      </div>
                    </div>
                </div>
                )}
                  </div>
                </div>
            </div>
            </section>
          </main>
        </SurveyContext.Provider>
      <Footer />
      </div>
    </ErrorBoundary>
  );
}