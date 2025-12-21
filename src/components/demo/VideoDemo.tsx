import { useState } from 'react';
import { Play, Plane, MessageSquare, Map, Star } from 'lucide-react';

interface VideoDemoProps {
  videoUrl?: string;
  thumbnailUrl?: string;
}

const VideoDemo = ({ videoUrl, thumbnailUrl }: VideoDemoProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    if (videoUrl) {
      setIsPlaying(true);
    }
  };

  // Placeholder content when no video is available
  if (!videoUrl) {
    return (
      <div className="relative w-full aspect-video bg-gradient-to-br from-card via-card/80 to-primary/10 rounded-2xl overflow-hidden border border-border/50">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center">
          {/* Demo preview icons */}
          <div className="flex items-center gap-6 mb-8">
            <div className="flex flex-col items-center gap-2 opacity-60">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Plane className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground">Flight Details</span>
            </div>
            <div className="w-8 h-px bg-border" />
            <div className="flex flex-col items-center gap-2 opacity-60">
              <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                <Map className="w-6 h-6 text-secondary" />
              </div>
              <span className="text-xs text-muted-foreground">Live Tracking</span>
            </div>
            <div className="w-8 h-px bg-border" />
            <div className="flex flex-col items-center gap-2 opacity-60">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-accent-foreground" />
              </div>
              <span className="text-xs text-muted-foreground">AI Assistant</span>
            </div>
            <div className="w-8 h-px bg-border" />
            <div className="flex flex-col items-center gap-2 opacity-60">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground">Recommendations</span>
            </div>
          </div>

          {/* Play button placeholder */}
          <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center mb-6 cursor-not-allowed">
            <Play className="w-8 h-8 text-primary ml-1" />
          </div>

          <h3 className="text-xl font-display font-semibold text-foreground mb-2">
            Demo Video Coming Soon
          </h3>
          <p className="text-muted-foreground max-w-md">
            Watch how TripPilot transforms your travel experience with real-time tracking, AI assistance, and smart recommendations.
          </p>
        </div>
      </div>
    );
  }

  // Video player when URL is provided
  return (
    <div className="relative w-full aspect-video bg-card rounded-2xl overflow-hidden border border-border/50">
      {!isPlaying ? (
        <>
          {/* Thumbnail */}
          {thumbnailUrl && (
            <img 
              src={thumbnailUrl} 
              alt="Video thumbnail" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          
          {/* Play button overlay */}
          <div 
            className="absolute inset-0 flex items-center justify-center bg-background/30 backdrop-blur-sm cursor-pointer group"
            onClick={handlePlay}
          >
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center transition-transform group-hover:scale-110">
              <Play className="w-8 h-8 text-primary-foreground ml-1" />
            </div>
          </div>
        </>
      ) : (
        <iframe
          src={videoUrl}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
    </div>
  );
};

export default VideoDemo;
export { VideoDemo };