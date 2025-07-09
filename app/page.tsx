"use client";
import React, { useState } from "react";
import CalculatorInput from "@components/custom/ui/CalculatorInput";
import { ClipLoader } from "react-spinners";
import { Suspense } from "react";
import { Inter } from "next/font/google";
import { Footer } from "@components/custom/ui/Footer";
import { Header } from "@components/custom/ui/Header";
import { FormFrontend } from "@/schemas/formSchema";
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
    <>
    <Header />
    <main className={inter.className}>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 mx-4">
          {error}
          </div>
      )}
      <Suspense fallback={<ClipLoader />}>
        <CalculatorInput onSubmit={handleSubmit} isLoading={isSubmitting} />
      </Suspense>
    </main>
    <Footer/>
    </>
  );
}
