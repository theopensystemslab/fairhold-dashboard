import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";

export const BackgroundAssumptions: React.FC = () =>  (
  <a href="https://github.com/theopensystemslab/fairhold-dashboard/wiki" className="flex text-sm items-center text-[rgb(var(--text-inaccessible-rgb))] decoration-[rgb(var(--text-inaccessible-rgb))]">
    <QuestionMarkCircledIcon className="mr-2"/>
    Explore other background assumptions we have made in this calculator
  </a>
)