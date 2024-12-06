const LoadingScreen = ({ loadingDots, message }: { loadingDots: string, message: string }) => {
    return (
        <div className="text-center">
            <h2 className="text-5xl font-bold" style={{ color: '#ffa600' }}>
                {message}{loadingDots}
            </h2>
        </div>
    )
};

export default LoadingScreen;