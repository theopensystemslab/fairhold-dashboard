import CalculatorInput from "./components/ui/CalculatorInput";
import { ClipLoader } from "react-spinners";
import { Suspense } from "react";
import { Footer } from "./components/ui/Footer";
import { Header } from "./components/ui/Header";

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
