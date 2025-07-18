import CalculatorInput from "../components/custom-test/ui-test/CalculatorInput";
import { ClipLoader } from "react-spinners";
import { Suspense } from "react";
import { Inter } from "next/font/google";
import { Footer } from "../components/custom-test/ui-test/Footer";
import { Header } from "../components/custom-test/ui-test/Header";

const inter = Inter({
  weight: ["500", "600", "700", "800"],
  subsets: ["greek", "greek-ext", "latin", "latin-ext"],
});

export default function Home() {
  return (
    <>
    <Header />
    <main className={inter.className}>
      <Suspense fallback={<ClipLoader />}>
        <CalculatorInput />
      </Suspense>
    </main>
    <Footer/>
    </>
  );
}
