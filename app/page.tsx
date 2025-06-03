"use client"
import React, { useState } from "react";
import CalculatorInput from "./components/ui/CalculatorInput";
import { Inter } from "next/font/google";
import { Header } from "./components/ui/Header";
import { Footer } from "./components/ui/Footer";
import { FormFrontend } from "@/app/schemas/formSchema";
import { useRouter } from "next/navigation";

const inter = Inter({
  weight: ["500", "600", "700", "800"],
  subsets: ["greek", "greek-ext", "latin", "latin-ext"],
});

export default function Home() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (formData: FormFrontend) => {
      try {
        setError(null);
        setIsSubmitting(true);

        const stringParams: Record<string, string> = {
          housePostcode: formData.housePostcode,
          houseAge: formData.houseAge.toString(),
          houseBedrooms: formData.houseBedrooms.toString(),
          houseType: formData.houseType,
          maintenanceLevel: formData.maintenanceLevel,
          ...(formData.houseSize && { houseSize: formData.houseSize.toString() })
      };

      const params = new URLSearchParams(stringParams).toString();
        router.push(`/results?${params}`);
    } catch (err) {
        console.error('Navigation error:', err);
        setError('Unable to navigate to results. Please try again.');
      } finally {
        setIsSubmitting(false);
    };
  };

    return (
      <main className={inter.className}>
        <Header />
        {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 mx-4">
          {error}
          </div>
      )}
        <CalculatorInput onSubmit={handleSubmit} isLoading={isSubmitting} />
        <Footer />
      </main>
    );
};
