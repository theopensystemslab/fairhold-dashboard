import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import { IconProps } from "@radix-ui/react-icons/dist/types";
import { ForwardRefExoticComponent, RefAttributes } from "react";

interface NavigationIconProps {
  Icon: ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>;
  onClick: () => void;
}

const NavigationIcon: React.FC<NavigationIconProps> = ({ Icon, onClick }) => (
  <button onClick={onClick}>
    <Icon className="w-10 h-10 hover:scale-125 transition-transform duration-200" />
  </button>
);

interface CarouselProps {
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
}

export const Carousel: React.FC<CarouselProps> = ({ scrollContainerRef, currentPage, setCurrentPage }) => {
  const totalPages = 5;

  const handleNext = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        top: window.innerHeight,
        behavior: "smooth",
      });
    }
    setCurrentPage(currentPage + 1);
  };

  const handlePrevious = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        top: - window.innerHeight,
        behavior: "smooth",
      });
    }
    setCurrentPage(currentPage - 1);
  };

  return (
    <>
      {
        currentPage > 0 && (
          <div className="fixed top-4 right-4">
            <NavigationIcon Icon={ArrowUpIcon} onClick={handlePrevious}/>
          </div>
        )
      }
      {
        currentPage < totalPages && (
          <div className="fixed bottom-4 right-4">
            <NavigationIcon Icon={ArrowDownIcon} onClick={handleNext} />
          </div>
        )
      }
    </>
  )
}