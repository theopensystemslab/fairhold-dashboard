import { cn } from "@/lib/utils";
import { ArrowDownIcon, ArrowUpIcon, DotFilledIcon } from "@radix-ui/react-icons";
import { IconProps } from "@radix-ui/react-icons/dist/types";
import { ForwardRefExoticComponent, RefAttributes } from "react";

interface NavigationIconProps {
  Icon: ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>;
  onClick: () => void;
}

const NavigationIcon: React.FC<NavigationIconProps> = ({ Icon, onClick }) => (
  <button onClick={onClick}>
    <Icon className="w-6 h-6 hover:scale-125 transition-transform duration-200" />
  </button>
);

interface CarouselProps {
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  currentPage: number;
}

export const Carousel: React.FC<CarouselProps> = ({ scrollContainerRef, currentPage }) => {
  const totalPages = 5;

  const scrollTo = (index: number) => {
    if (!scrollContainerRef.current) return;
    
    const current = scrollContainerRef.current.scrollTop;
    const target = index * window.innerHeight;
    const distance = target - current;
    
    scrollContainerRef.current.scrollBy({
      top: distance,
      behavior: "smooth",
    });
  }

  const handleNext = () => scrollTo(currentPage + 1);
  const handlePrevious = () => scrollTo(currentPage - 1);

  return (
    <div className="flex flex-col justify-between fixed right-4 top-0 h-full items-center py-6">
      <div className={cn("invisible", { "visible": currentPage > 0 })}>
        <NavigationIcon Icon={ArrowUpIcon} onClick={handlePrevious} />
      </div>
      <div className="flex flex-col items-center">
        {Array.from({ length: totalPages + 1 }, (_, index) => (
          <button key={index} onClick={() => scrollTo(index)}>
            <DotFilledIcon 
              className={cn(
                "text-gray-300 w-8 h-8 -m-1", 
                { "text-gray-950": 
                  index === currentPage 
                }
              )}
            />
          </button>
        ))}
      </div>
      <div className={cn("invisible", { "visible": currentPage < totalPages })}>
        <NavigationIcon Icon={ArrowDownIcon} onClick={handleNext} />
      </div>
    </div>
  )
}