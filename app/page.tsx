import CalculatorInput from "./components/ui/CalculatorInput";
import { ClipLoader } from "react-spinners";
import { Suspense } from "react";
export default function Home() {
  return (
    <main>
      <Suspense fallback={<ClipLoader />}>
        <CalculatorInput />
      </Suspense>
    </main>
  );
}
