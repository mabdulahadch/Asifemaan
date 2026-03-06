import { Play, ExternalLink, Heart, Share2, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";
import { Content, ContentService } from "@/lib/api/content";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useParams, useNavigate } from "react-router-dom";
import { useFavouriteContent } from "@/hooks/useFavourite";
import EmptyState from "@/components/EmptyState";
import ShareDialog from "@/components/ShareDialog";

interface Props {
  poetId?: number | string;
  limit?: number;
}

const VideoSection = ({ poetId: propPoetId, limit }: Props) => {
  const { t, isUrdu, transliterate } = useLanguage();
  const { id: urlPoetId } = useParams();
  const navigate = useNavigate();
  const poetId = propPoetId || urlPoetId;
  const [videoList, setVideoList] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<Content | null>(null);
  const { favIds, toggleFav } = useFavouriteContent();

  useEffect(() => {
    const fetchVideos = async () => {
      if (!poetId) return;
      try {
        const content = await ContentService.getContentByPoet(poetId);
        const videos = content.filter((c) => c.type === "VIDEO" && c.youtubeLink);
        setVideoList(videos);
      } catch (err) {
        console.error("Failed to fetch video content:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [poetId]);

  const displayed = limit ? videoList.slice(0, limit) : videoList;

  const handleToggleFav = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    toggleFav(id);
  };

  const getYoutubeId = (url: string | null) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };


  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-rekhta-gold" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold uppercase tracking-wider text-rekhta-gold">
          {t("video")}{" "}
          <span className="text-sm text-rekhta-muted">({videoList.length})</span>
        </h2>
        {limit && (
          <button
            onClick={() => navigate(`/poet/${poetId}/video`)}
            className="text-sm text-rekhta-gold hover:underline"
          >
            {t("seeAll")}
          </button>
        )}
      </div>

      {videoList.length === 0 && !loading ? (
        <EmptyState translationKey="noVideo" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayed.map((entry) => {
            const videoId = getYoutubeId(entry.youtubeLink);
            const thumbnailUrl = videoId
              ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
              : "";

            return (
              <div
                key={entry.id}
                className="group relative cursor-pointer overflow-hidden rounded-lg border border-rekhta-border bg-rekhta-card/30 transition-all hover:bg-rekhta-card/50"
                onClick={() => setSelectedVideo(entry)}
              >
                {/* Thumbnail Container */}
                <div className="relative aspect-video w-full overflow-hidden bg-rekhta-darker">
                  {thumbnailUrl ? (
                    <img
                      src={thumbnailUrl}
                      alt={entry.title}
                      className="h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-rekhta-darker text-rekhta-muted">
                      {t("noPreview")}
                    </div>
                  )}

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/10">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rekhta-gold/90 text-rekhta-darker shadow-lg transition-transform duration-300 group-hover:scale-110">
                      <Play className="h-5 w-5 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Content Info */}
                <div className="p-3">
                  <h3 className={`line-clamp-2 text-sm font-medium text-rekhta-light/90 group-hover:text-rekhta-gold ${isUrdu ? "font-nastaliq text-base leading-loose" : ""}`}>
                    {transliterate(entry.title)}
                  </h3>

                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => handleToggleFav(e, entry.id)}
                        className="p-1.5 text-rekhta-muted hover:text-rekhta-red transition-colors"
                      >
                        <Heart className={`h-4 w-4 ${favIds.has(entry.id) ? "fill-rekhta-red text-rekhta-red" : ""}`} />
                      </button>
                      <ShareDialog
                        url={`${window.location.origin}/poet/${poetId}/video/${entry.id}`}
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
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Video Modal */}
      <Dialog open={!!selectedVideo} onOpenChange={(open) => !open && setSelectedVideo(null)}>
        <DialogContent
          className="sm:max-w-3xl bg-rekhta-card border-rekhta-border px-0 pt-0 pb-0 overflow-hidden"
          hideCloseButton
        >
          <DialogHeader className="sr-only">
            <DialogTitle>{selectedVideo?.title}</DialogTitle>
          </DialogHeader>

          <div className="relative aspect-video w-full bg-black">
            {selectedVideo && getYoutubeId(selectedVideo.youtubeLink) && (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${getYoutubeId(selectedVideo.youtubeLink)}?autoplay=1`}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}
          </div>

          <div className="p-4 flex items-center justify-between bg-rekhta-darker border-t border-rekhta-border">
            <h3 className="font-medium text-rekhta-light truncate mr-4">
              {selectedVideo ? transliterate(selectedVideo.title) : ""}
            </h3>
            {selectedVideo?.youtubeLink && (
              <a
                href={selectedVideo.youtubeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-rekhta-gold hover:underline shrink-0"
              >
                {t("watchOnYoutube")} <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VideoSection;
