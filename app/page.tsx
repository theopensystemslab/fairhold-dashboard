import CalculatorInput from "./components/ui/CalculatorInput";
import { ClipLoader } from "react-spinners";
import { Suspense } from "react";
import { Inter } from "next/font/google";
import { Footer } from "./components/ui/Footer";

const inter = Inter({
  weight: ["500", "600", "700", "800"],
  subsets: ["greek", "greek-ext", "latin", "latin-ext"],
});

const Header = () => (
  <header className="static top-0 left-0 bg-transparent flex items-center px-4 py-4 z-50 height-10vh">
    <h1 className="font-bold text-xl text-black">Fairhold</h1>
  </header>
);

export default function Home() {
  return (
    <main className={inter.className}>
      <Header />
      <Suspense fallback={<ClipLoader />}>
        <CalculatorInput />
        <Footer/>
      </Suspense>
    </main>
  );
}
