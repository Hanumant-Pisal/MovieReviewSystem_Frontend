const LoadingSpinner = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
            <div className="relative mb-8">
                <div className="w-20 h-20 border-4 border-white/20 rounded-full animate-spin">
                    <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-pink-500 border-r-violet-500 rounded-full animate-spin"></div>
                </div>
              
            </div>
            
        </div>
    </div>
);

export default LoadingSpinner;
