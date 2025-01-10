import { Button } from "@/components/ui/button"
import GraphCard from "../../ui/GraphCard"
import { ArrowRightIcon, ReloadIcon } from "@radix-ui/react-icons"

export const WhatWouldYouChoose: React.FC = () => {
  return (
    <GraphCard title="What would you choose?">
      <div className="flex flex-col h-full justify-between">
        <div className="w-2/3">
          <p>
            Would Fairhold be affordable for you? Would you support the creation of more Fairhold homes in your area? If you could pick any way to rent or own a home, which would you choose?
          </p>
          <p>
            Take our survey to see how your preferences compare with other people&apos;s.
          </p>
          <div className="flex mt-20">
            <Button type="submit" className="calculate-button-style px-10">
              Take the survey
            </Button>
            <a href="#" className="ml-10 text-sm flex items-center">Find out more about Fairhold
              <ArrowRightIcon className="ml-1" />
            </a>
          </div>
        </div>
        <button className="flex items-center gap-2" onClick={() => window.location.reload()}>
          <ReloadIcon />
          Start again
        </button>
      </div>
    </GraphCard>
  )
};
