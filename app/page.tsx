import CalculatorInput from "./components/ui/CalculatorInput";
import { ClipLoader } from "react-spinners";
import { Suspense } from "react";
import { Inter } from "next/font/google";
import { Footer } from "./components/ui/Footer";

const inter = Inter({
  weight: ["500", "600", "700", "800"],
  subsets: ["greek", "greek-ext", "latin", "latin-ext"],
});

export default function Home() {
  return (
    <main className={inter.className}>
      <Suspense fallback={<ClipLoader />}>
        <CalculatorInput />
        <Footer/>
      </Suspense>
    </main>
  );
}
