export default function DashboardLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-6">
        {/* Cosmic Loading Spinner */}
        <div className="relative w-20 h-20 mx-auto">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-4 border-primary/10"></div>

          {/* Spinning ring */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-primary/50 animate-spin"></div>

          {/* Inner pulse */}
          <div className="absolute inset-3 rounded-full bg-primary/20 animate-pulse"></div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">
            Loading Dashboard
          </h2>
          <p className="text-sm text-muted-foreground animate-pulse">
            Setting up your workspace...
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="flex items-center justify-center gap-1.5 mt-8">
          <div
            className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
