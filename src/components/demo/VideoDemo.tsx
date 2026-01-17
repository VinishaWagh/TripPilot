import { useState } from 'react';
import { Play, Plane, MessageSquare, Map, Star } from 'lucide-react';

interface VideoDemoProps {
  embedUrl?: string;
}

const CLOUDINARY_EMBED =
  'https://player.cloudinary.com/embed/?cloud_name=da4j9rxvk&public_id=Team_Redbit_Demo_vkbefp&autoplay=true&muted=true&loop=true&controls=true';

const VideoDemo = ({ embedUrl = CLOUDINARY_EMBED }: VideoDemoProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!embedUrl) {
    /* Placeholder stays same as your existing one */
    return (
      <div className="relative w-full aspect-video bg-gradient-to-br from-card via-card/80 to-primary/10 rounded-2xl overflow-hidden border border-border/50">
        {/* Same placeholder UI */}
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-border/50 bg-black">
      {!isPlaying && (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 cursor-pointer"
          onClick={() => setIsPlaying(true)}
        >
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-xl">
            <Play className="w-8 h-8 text-primary-foreground ml-1" />
          </div>
        </div>
      )}

      {isPlaying && (
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          allowFullScreen
          loading="lazy"
          title="TripPilot Demo Video"
        />
      )}
    </div>
  );
};

export default VideoDemo;
