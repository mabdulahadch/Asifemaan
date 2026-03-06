import { Heart, Share2, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Content, ContentService } from "@/lib/api/content";
import { useFavouriteContent } from "@/hooks/useFavourite";
import EmptyState from "@/components/EmptyState";
import ShareDialog from "@/components/ShareDialog";

interface Props {
  poetId?: number | string;
  limit?: number;
  onSelectSher?: (id: string | number) => void;
}

const SherSection = ({ poetId: propPoetId, limit, onSelectSher }: Props) => {
  const { t, isUrdu, transliterate } = useLanguage();
  const { id: urlPoetId } = useParams();
  const navigate = useNavigate();
  const poetId = propPoetId || urlPoetId;
  const { favIds, toggleFav } = useFavouriteContent();
  const [shers, setShers] = useState<Content[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchShers = async () => {
      if (!poetId) return;
      setLoading(true);
      try {
        const allContent = await ContentService.getContentByPoet(poetId);
        const filteredShers = allContent.filter(c => c.type === "SHER");
        setShers(filteredShers);
      } catch (err) {
        console.error("Failed to fetch shers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchShers();
  }, [poetId]);

  const displayed = limit ? shers.slice(0, limit) : shers;

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
          {t("sher")}{" "}
          <span className="text-sm text-rekhta-muted">({shers.length})</span>
        </h2>
        {limit && (
          <button
            onClick={() => navigate(`/poet/${poetId}/sher`)}
            className="text-sm text-rekhta-gold hover:underline"
          >
            {t("seeAll")}
          </button>
        )}
      </div>


      {shers.length === 0 && !loading ? (
        <EmptyState translationKey="noShers" />
      ) : (

        <div className="divide-y divide-rekhta-border">
          {displayed.map((s) => (
            <div
              key={s.id}
              className="group flex items-center justify-between py-3 transition-colors hover:bg-rekhta-card/50"
            >
              <button
                onClick={() => {
                  if (onSelectSher) {
                    onSelectSher(s.id);
                  } else {
                    navigate(`/poet/${poetId}/sher/${s.id}`);
                  }
                }}
                className="flex-1 text-start text-rekhta-light/90 transition-colors group-hover:text-rekhta-gold"
              >
                <span className={isUrdu ? "font-nastaliq text-lg" : "text-base"}>
                  {transliterate(s.title)}
                </span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleFav(s.id)}
                  className="shrink-0 p-2 text-rekhta-muted hover:text-rekhta-red"
                >
                  <Heart className={`h-4 w-4 ${favIds.has(s.id) ? "fill-rekhta-red text-rekhta-red" : ""}`} />
                </button>
                <ShareDialog
                  url={`${window.location.origin}/poet/${poetId}/sher/${s.id}`}
                  title={s.title}
                  trigger={
                    <button className="shrink-0 p-2 text-rekhta-muted hover:text-rekhta-light transition-colors">
                      <Share2 className="h-4 w-4" />
                    </button>
                  }
                />
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default SherSection;
