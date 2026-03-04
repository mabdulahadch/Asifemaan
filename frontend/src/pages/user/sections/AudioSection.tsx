import { Play, Pause, Volume2, Heart, Share2, Loader2 } from "lucide-react";
import { useScript } from "@/contexts/ScriptContext";
import { useState, useEffect, useRef, useMemo } from "react";
import { Content, ContentService } from "@/lib/api/content";
import { Slider } from "@/components/ui/slider";
import { useParams, useNavigate } from "react-router-dom";
import { useFavouriteContent } from "@/hooks/useFavourite";
import EmptyState from "@/components/EmptyState";
import ShareDialog from "@/components/ShareDialog";

// --- Types ---
interface Props {
  poetId?: number | string;
  limit?: number;
}

interface AudioPlayerProps {
  track: Content;
  onNext?: () => void;
  onPrev?: () => void;
  onEnded?: () => void;
}

// --- Audio Player Component ---
const AudioPlayer = ({ track, onEnded }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Reset state when track changes
  useEffect(() => {
    setIsPlaying(true);
    setCurrentTime(0);
    setDuration(0);
  }, [track.id]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error("Playback failed:", error);
            setIsPlaying(false);
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, track]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const getAudioUrl = (path: string | null) => {
    if (!path) return "";
    return path; // Already a full URL from SiteGround
  };

  return (
    <div className="rounded-xl border border-rekhta-gold/20 bg-rekhta-card p-4 shadow-lg backdrop-blur-sm transition-all duration-300 mb-6">
      <audio
        ref={audioRef}
        src={getAudioUrl(track.audioFile)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          setIsPlaying(false);
          onEnded?.();
        }}
        onError={(e) => console.error("Audio Load Error:", e)}
      />

      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rekhta-gold text-rekhta-darker shadow-md hover:bg-rekhta-gold/90 transition-all hover:scale-105 active:scale-95"
        >
          {isPlaying ? (
            <Pause className="h-5 w-5 fill-current" />
          ) : (
            <Play className="h-5 w-5 fill-current ml-1" />
          )}
        </button>

        <div className="flex-1 space-y-2">
          <div className="flex justify-between text-xs text-rekhta-muted font-medium">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration || 0)}</span>
          </div>
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={handleSeek}
            className="cursor-pointer"
          />
          <div className="flex justify-between items-center text-sm">
            <p className="truncate font-medium text-rekhta-light w-[80%]">
              {track.title}
            </p>
            <Volume2 className="h-4 w-4 text-rekhta-muted" />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Audio Section ---
const AudioSection = ({ poetId: propPoetId, limit }: Props) => {
  const { isUrdu } = useScript();
  const { id: urlPoetId } = useParams();
  const navigate = useNavigate();
  const poetId = propPoetId || urlPoetId;
  const [audioList, setAudioList] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTrack, setCurrentTrack] = useState<Content | null>(null);
  const { favIds, toggleFav } = useFavouriteContent();

  useEffect(() => {
    const fetchAudio = async () => {
      if (!poetId) return;
      try {
        const content = await ContentService.getContentByPoet(poetId);
        // Filter for AUDIO type and ensure audioFile exists
        const audios = content.filter((c) => c.type === "AUDIO" && c.audioFile);
        setAudioList(audios);
      } catch (err) {
        console.error("Failed to fetch audio content:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAudio();
  }, [poetId]);

  const displayed = limit ? audioList.slice(0, limit) : audioList;

  const handleToggleFav = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    toggleFav(id);
  };

  // Memoize the list items to prevent re-rendering them unnecessarily
  const renderedList = useMemo(() => {

    return (
      <div className="divide-y divide-rekhta-border/50 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {displayed.map((entry) => {
          const isActive = currentTrack?.id === entry.id;
          const shareUrl = `${window.location.origin}/poet/${poetId}/audio/${entry.id}`;
          return (
            <div
              key={entry.id}
              className={`group flex items-center gap-4 py-3 px-2 rounded-lg transition-all ${isActive ? "bg-rekhta-gold/10" : "hover:bg-rekhta-card/50"
                }`}
            >
              <button
                onClick={() => setCurrentTrack(entry)}
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all ${isActive
                  ? "border-rekhta-gold bg-rekhta-gold text-rekhta-darker"
                  : "border-rekhta-gold/40 text-rekhta-gold hover:bg-rekhta-gold/10"
                  }`}
              >
                {isActive ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4 fill-current ml-0.5" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <p
                  className={`truncate text-rekhta-light/90 cursor-pointer hover:text-rekhta-gold ${isActive ? "font-medium text-rekhta-gold" : ""
                    }`}
                  onClick={() => setCurrentTrack(entry)}
                >
                  {entry.title}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => handleToggleFav(e, entry.id)}
                  className="p-1.5 text-rekhta-muted hover:text-rekhta-red transition-colors"
                >
                  <Heart className={`h-4 w-4 ${favIds.has(entry.id) ? "fill-rekhta-red text-rekhta-red" : ""}`} />
                </button>
                <ShareDialog
                  url={shareUrl}
                  title={entry.title}
                  trigger={
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 text-rekhta-muted hover:text-rekhta-light transition-colors"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                  }
                />
              </div>

              {isActive && (
                <div className="px-2">
                  <div className="w-2 h-2 rounded-full bg-rekhta-gold animate-pulse" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }, [displayed, loading, currentTrack?.id, isUrdu, favIds, poetId]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-rekhta-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold uppercase tracking-wider text-rekhta-gold">
          {isUrdu ? "آڈیو" : "Audio"}{" "}
          <span className="text-sm text-rekhta-muted">({audioList.length})</span>
        </h2>
        {limit && (
          <button
            onClick={() => navigate(`/poet/${poetId}/audio`)}
            className="text-sm text-rekhta-gold hover:underline"
          >
            {isUrdu ? "سب دیکھیں" : "See All"}
          </button>
        )}
      </div>

      {currentTrack && (
        <AudioPlayer key={currentTrack.id} track={currentTrack} />
      )}

      {audioList.length === 0 && !loading ? (
        <EmptyState
          messageEn="No audio available."
          messageUr="کوئی آڈیو دستیاب نہیں ہے"
        />
      ) : (
        renderedList
      )}


      
    </div>
  );
};

export default AudioSection;
