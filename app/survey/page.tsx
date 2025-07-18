'use client';

import { useState, useEffect } from 'react';
import { Inter } from "next/font/google";
import ErrorBoundary from '../../components/custom-test/ErrorBoundary';
import { SurveyResults } from '../../lib/survey/types';
import { Age } from '../../components/custom-test/survey-test/graphs/Age';
import { AffordFairhold } from '../../components/custom-test/survey-test/graphs/AffordFairhold';
import { AnyMeansTenureChoice } from '../../components/custom-test/survey-test/graphs/AnyMeansTenureChoice';
import { Country } from '../../components/custom-test/survey-test/graphs/Country';
import { CurrentMeansTenureChoice } from '../../components/custom-test/survey-test/graphs/CurrentMeansTenureChoice';
import { IdealHouseType } from '../../components/custom-test/survey-test/graphs/IdealHouseType';
import { HousingOutcomes } from '../../components/custom-test/survey-test/graphs/HousingOutcomes';
import { IdealLiveWith } from '../../components/custom-test/survey-test/graphs/IdealLiveWith';
// import { Postcode } from './components/graphs/Postcode';
import { SupportDevelopment } from '../../components/custom-test/survey-test/graphs/SupportDevelopment';
import { SupportDevelopmentFactors } from '../../components/custom-test/survey-test/graphs/SupportDevelopmentFactors';
import { SupportNewFairhold } from '../../components/custom-test/survey-test/graphs/SupportNewFairhold';
import { WhyFairhold } from '../../components/custom-test/survey-test/graphs/WhyFairhold';
import { WhyNotFairhold } from '../../components/custom-test/survey-test/graphs/WhyNotFairhold';
import { SurveyContext } from './context';
// list records https://api.airtable.com/v0/{baseId}/{tableIdOrName}
// get record https://api.airtable.com/v0/{baseId}/{tableIdOrName}/{recordId}
import { Header } from "../../components/custom-test/ui-test/Header";
import { Footer } from "../../components/custom-test/ui-test/Footer";

const inter = Inter({
  weight: ["500", "600", "700", "800"],
  subsets: ["greek", "greek-ext", "latin", "latin-ext"],
});

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
      <Header />
        <SurveyContext.Provider value={surveyResults}>
          <main className={`${inter.className} min-h-screen w-full bg-[rgb(var(--background-end-rgb))]`}>
            <div className="flex flex-row">
              <div className="hidden md:block w-1/4"></div>

              <div className="w-full md:w-3/4 flex-1 flex justify-center">
                <div className="w-full max-w-1280 flex flex-col p-4">
                  <h1 className="h1-style text-2xl md:text-4xl">Fairhold survey results</h1>
                    <div className="flex flex-col gap-4 mt-6">
                    {surveyResults.numberResponses === 0 ? (
                  <p>No survey responses found.</p>
                ) : (
                  <div>
                    <h2 className="text-xl md:text-2xl">So far, {surveyResults.numberResponses} people have responded</h2>
                    
                    <div className="flex flex-col py-4">
                      <h3 className="text-xl font-medium">Who has responded?</h3>
                      <div className="flex flex-col md:flex-row md:h-[30rem] p-4">
                        <Country />
                        <Age />
                        {/* <Postcode {...results} /> */}
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <h3 className="text-xl font-medium">Housing preferences</h3>
                      <div className="flex flex-col md:flex-row w-full md:h-[30rem] p-4">
                        <IdealHouseType />
                        <IdealLiveWith />
                      </div>
                      <div className="flex flex-col md:flex-row md:h-[30rem] p-4">
                        <HousingOutcomes />
                        <AffordFairhold />
                      </div>
                      <div className="flex flex-col md:flex-row md:h-[30rem] p-4">
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
                      <h3 className="text-xl font-medium">Attitudes towards development</h3>
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
            </div>
          </main>
        </SurveyContext.Provider>
      <Footer />
    </ErrorBoundary>
  );
}