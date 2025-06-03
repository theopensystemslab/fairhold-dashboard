"use client"
import React from "react";
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

  const handleSubmit = (formData: FormFrontend) => {
    const params = new URLSearchParams();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) params.append(key, String(value));
    });
    router.push(`/results?${params.toString()}`);
  };

  return (
    <main className={inter.className}>
      <Header />
      <CalculatorInput onSubmit={handleSubmit} isLoading={false} />
      <Footer />
    </main>
  );
}
