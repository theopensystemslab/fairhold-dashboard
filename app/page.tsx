import CalculatorInput from "../components/custom/ui/CalculatorInput";
import { ClipLoader } from "react-spinners";
import { Suspense } from "react";
import { Footer } from "../components/custom/ui/Footer";
import { Header } from "../components/custom/ui/Header";

export default function Home() {
  return (
    <>
    <Header />
    <main className="main-content">
      <Suspense fallback={<ClipLoader />}>
        <CalculatorInput />
      </Suspense>
    </main>
    <Footer/>
    </>
  );
}
