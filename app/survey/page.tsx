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
import { SurveyContext, defaultSurveyResults } from '@context/surveyContext';
// list records https://api.airtable.com/v0/{baseId}/{tableIdOrName}
// get record https://api.airtable.com/v0/{baseId}/{tableIdOrName}/{recordId}
import { Header } from "@components/custom/ui/Header";
import { Footer } from "@components/custom/ui/Footer";
import Highlight from "@components/custom/ui/Highlight";
import { getMaxWhyFairholdValue } from '@/lib/survey/utils';

const SurveyLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen w-full bg-gray-50">
    <Header />
    <div className="hidden md:block top-spacer"/>
    {children}
    <Footer />
  </div>
);

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

  if (error) return <div>Error: {error}</div>;

  const whyFairholdMaxX = getMaxWhyFairholdValue(surveyResults ?? defaultSurveyResults)

  return (
    <ErrorBoundary>
      <SurveyLayout>
          <SurveyContext.Provider value={surveyResults ?? defaultSurveyResults}>
          <main className="flex justify-center main-content">
            <section className="w-full max-w-[960px] flex flex-row py-8">
              <div className="flex flex-row">
                <div className="w-full flex flex-col p-4">
                  <h1 className="h1-style text-2xl md:text-4xl">Fairhold survey results</h1>
                  <div className="flex flex-col gap-4 mt-6">
                    {surveyResults?.numberResponses === 0 ? (
                      <p>No survey responses found.</p>
                    ) : (
                      <p className="text-lg md:text-xl">
                        So far, <Highlight loading={loading}>{surveyResults?.numberResponses}</Highlight> people have responded.
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col py-4">
                    <h2 className="text-xl font-bold my-8">Who has responded?</h2>
                    <div className="flex flex-col gap-8 md:flex-row h-[50rem] md:h-[30rem]">
                      <Country loading={loading} />
                      <Age loading={loading} />
                      {/* <Postcode {...results} /> */}
                    </div>
                  </div>

                    <div className="flex flex-col gap-8 ">
                      <h2 className="text-xl font-bold my-8">Housing preferences</h2>
                      <div className="flex flex-col gap-8 md:flex-row h-[50rem] md:h-[30rem]">
                        <IdealHouseType loading={loading} />
                        <IdealLiveWith loading={loading} />
                      </div>
                      <div className="flex flex-col gap-8 md:flex-row h-[50rem] md:h-[30rem]">
                        <HousingOutcomes loading={loading} />
                        <AffordFairhold loading={loading} />
                      </div>
                      <div className="flex flex-col md:flex-row h-[50rem]">
                        <CurrentMeansTenureChoice loading={loading} />
                      </div>
                      <div className="flex flex-col gap-8 md:flex-row md:h-[20rem]">
                        <WhyFairhold maxX={whyFairholdMaxX} loading={loading} />
                        <WhyNotFairhold maxX={whyFairholdMaxX} loading={loading} />
                      </div>
                      <div className="flex flex-col md:flex-row md:h-[20rem] mb-4">
                        <div className="w-full">
                          <AnyMeansTenureChoice loading={loading} />
                        </div>
                      </div>
                    </div>

                  <div className="flex flex-col pb-8">
                    <h2 className="text-xl font-bold my-8">Attitudes towards development</h2>
                    <div className="flex flex-col md:flex-row w-full gap-8">
                      <div className="flex flex-col md:w-1/2 w-full gap-8 md:h-[60rem]">
                        <div className="flex-1 flex flex-col h-[50rem] md:h-[30rem]"> 
                          <SupportDevelopment loading={loading} />
                        </div>
                        <div className="flex-1 flex flex-col l h-[50rem] md:h-[30rem]">
                          <SupportNewFairhold loading={loading} />
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row md:w-1/2 w-full md:h-[60rem]">
                        <SupportDevelopmentFactors loading={loading} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </section>
        </main>
      </SurveyContext.Provider>
    </SurveyLayout>
  </ErrorBoundary>
)};