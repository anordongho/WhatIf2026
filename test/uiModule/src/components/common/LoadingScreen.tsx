import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";

const LoadingScreen = ({ loadingDots, message }: { loadingDots: string, message: string }) => {
    // const loadingDots = useSelector((state: RootState) => state.loadingDotsReducer.loadingDots);
    return (
        <div className="text-center">
            <h2 className="text-5xl font-bold" style={{ color: '#ffa600' }}>
                {message}{loadingDots}
            </h2>
        </div>
    )
};

export default LoadingScreen;