"use client";
import React, { useEffect, useState } from "react";
import Dashboard from "./components/ui/Dashboard";
import { Header } from "../components/ui/Header";
import { Footer } from "../components/ui/Footer";
import ClipLoader from "react-spinners/ClipLoader"; 
import { useSearchParams } from "next/navigation";
import { FormFrontend } from "../schemas/formSchema";
import { MaintenanceLevel } from "../models/constants";
import { HouseType } from "../models/Property";
import { useRouter } from "next/navigation";
import { Household } from "../models/Household";

type View = "loading" | "dashboard";

const ResultsPage = () => {
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
    if (formObj.housePostcode === "") { router.push("/") }

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
        <main>
            <Header />
            <div className="min-h-[70vh] flex items-center justify-center">
                {view === "loading" && (
                    <ClipLoader color="black" size={50} />
                )}
                {view === "dashboard" && data && (
                    <Dashboard processedData={data} />
                )}
            </div>
            <Footer />
        </main>
    );
}

export default ResultsPage;