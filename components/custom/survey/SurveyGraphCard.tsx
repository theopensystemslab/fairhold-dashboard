import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

type Props = React.PropsWithChildren<{
  title: string;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  loading?: boolean;
}>;

const SurveyGraphCard: React.FC<Props> = ({ title, subtitle, action, children, loading }) => {
  return (
    <div className="flex flex-1 flex-col justify-center h-full w-full bg-white p-4">
        <h3 className={`text-xl md:text-lg sm:text-md font-bold text-black mt-0`}>{title}</h3>
                {(subtitle || action) && (
          <div className="flex items-center gap-4 mt-2">
            {subtitle && (
              <p className="text-md font-normal" style={{ color: "rgba(var(--survey-grey-mid))" }}>
                {subtitle}
              </p>
            )}
            {action}
          </div>
        )}
        <div className="mt-4 flex-1">
          {loading ? (
            <div className="w-full h-full flex flex-col items-center gap-4">
              <Skeleton className="h-2/3 w-2/3 rounded-xl bg-gray-200 m-4" /> 
              <div className="w-full m-4">
                <Skeleton className="h-6 w-1/2 rounded-xl bg-gray-200" /> 
              </div>
            </div>
          ) : children
        }
        </div>
      </div>
  );
};

export default SurveyGraphCard;
