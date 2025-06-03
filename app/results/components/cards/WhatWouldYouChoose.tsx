import { Button } from "@/components/ui/button"
import { ReloadIcon } from "@radix-ui/react-icons"

export const WhatWouldYouChoose: React.FC = () => {
  return (
    <div className="min-h-screen h-screen snap-start w-full md:w-3/4 items-center justify-center p-10 flex flex-col overflow-y-auto my-2 pb-6">
      <div className="h-2/3 flex flex-col w-full md:w-3/4 gap-6">
        <h1 className={`text-2xl md:text-3xl lg:text-4xl sm:text-xl font-bold text-black`}>What would you choose?</h1>
        <h2 className={`text-lg md:text-xl lg:text-2xl text-gray-600 mt-2 font-normal`}>Would Fairhold be affordable for you? Would you support the creation of Fairhold homes in your area? Would you live in a Fairhold home if you could?</h2>
        <h2 className={`text-lg md:text-xl lg:text-2xl text-gray-600 mt-2 font-normal`}>Take our quick survey, make your voice heard, and see how your housing preferences compare with other peoples&apos;.</h2>
        <div className="flex flex-col md:flex-row gap-4 mt-10 justify-between">
          <Button type="submit" className="calculate-button-style px-10 !bg-[rgb(var(--fairhold-equity-color-rgb))]">
            Take the survey
          </Button>
          <button className="flex items-center gap-2" onClick={() => window.location.reload()}>
            <ReloadIcon />
            Start again
          </button>
        </div>
        </div>
    </div>
  )
};
