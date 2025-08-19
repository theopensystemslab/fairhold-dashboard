"use client";
import React, { useEffect, useState, Suspense } from "react";
import Dashboard from "@components/custom/ui/Dashboard";
import { Header } from "@components/custom/ui/Header";
import { Footer } from "@components/custom/ui/Footer";
import { LoadingScreen } from "@/components/custom/LoadingScreen";
import { useSearchParams } from "next/navigation";
import { FormFrontend } from "@schemas/formSchema";
import { MaintenanceLevel } from "@models/constants";
import { HouseType } from "@models/Property";
import { useRouter } from "next/navigation";
import { Household } from "@models/Household";

type View = "loading" | "dashboard";

const ResultsPageContent = () => {
    const [view, setView] = useState<View>("loading");
    const [data, setData] = useState<Household | null>(null);

    const router = useRouter();
    const params = useSearchParams();

    const formObj: FormFrontend = {
        housePostcode: (params.get("housePostcode") || ""),
        houseAge: Number(params.get("houseAge") || 0),
        houseBedrooms: Number(params.get("houseBedrooms") || 2),
        houseType: (params.get("houseType") as HouseType || ""),
        maintenanceLevel: params.get("maintenanceLevel") as MaintenanceLevel,
        houseSize: params.get("houseSize") ? Number(params.get("houseSize")) : undefined,
        };

    useEffect(() => {
        if (!formObj.housePostcode) {
            router.push("/");
            return;
        }
        const fetchData = async () => {
            setView("loading");
            const response = await fetch("/api", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formObj),
            });
            if (!response.ok) {
                router.push("/");
                return;
            }
            const processedData = await response.json();
            setData(processedData);
            setView("dashboard");
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.toString()]); // re-run if params change

return (
    <main className="flex justify-center main-content">
      <section className="w-full max-w-[960px] flex flex-row py-8">
        <div className="w-full flex-1 flex justify-center">
                {view === "loading" && (
                    <LoadingScreen />
                )}
                {view === "dashboard" && data && (
                    <Dashboard processedData={data} />
                )}
            </div>
        </section>
    </main>
    );
};

const ResultsPage = () => (
    <div className="min-h-screen w-full bg-gray-50">
        <Header />
        <div className="hidden md:block top-spacer"/> 
        <Suspense fallback={<LoadingScreen />}>
            <ResultsPageContent />
        </Suspense>
        <Footer />
    </div>
);

export default ResultsPage;