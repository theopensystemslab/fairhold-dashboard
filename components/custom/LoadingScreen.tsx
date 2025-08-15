import { ClipLoader } from "react-spinners";

export const LoadingScreen = () => (
    <div
        className="flex flex-col justify-center items-center h-[60rem]"
        style={{ bottom: "4rem" }}
    >
        <ClipLoader />
    </div>
)