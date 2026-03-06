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
  onSelectGhazal?: (id: string | number) => void;
}

const GhazalSection = ({ poetId: propPoetId, limit, onSelectGhazal }: Props) => {
  const { t, isUrdu, transliterate } = useLanguage();
  const { id: urlPoetId } = useParams();
  const navigate = useNavigate();
  const poetId = propPoetId || urlPoetId;
  const { favIds, toggleFav } = useFavouriteContent();
  const [ghazals, setGhazals] = useState<Content[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGhazals = async () => {
      if (!poetId) return;
      setLoading(true);
      try {
        const allContent = await ContentService.getContentByPoet(poetId);
        const filteredGhazals = allContent.filter(c => c.type === "GHAZAL");
        setGhazals(filteredGhazals);
      } catch (err) {
        console.error("Failed to fetch ghazals:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGhazals();
  }, [poetId]);

  const displayed = limit ? ghazals.slice(0, limit) : ghazals;

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
          {t("ghazal")}{" "}
          <span className="text-sm text-rekhta-muted">({ghazals.length})</span>
        </h2>
        {limit && (
          <button
            onClick={() => navigate(`/poet/${poetId}/ghazal`)}
            className="text-sm text-rekhta-gold hover:underline"
          >
            {t("seeAll")}
          </button>
        )}
      </div>

      {ghazals.length === 0 && !loading ? (
        <EmptyState translationKey="noGhazals" />
      ) : (

        <div className="divide-y divide-rekhta-border">
          {displayed.map((g) => {
            const shareUrl = `${window.location.origin}/poet/${poetId}/ghazal/${g.id}`;
            return (
              <div
                key={g.id}
                className="group flex items-center justify-between py-3 transition-colors hover:bg-rekhta-card/50"
              >
                <button
                  onClick={() => {
                    if (onSelectGhazal) {
                      onSelectGhazal(g.id);
                    } else {
                      navigate(`/poet/${poetId}/ghazal/${g.id}`);
                    }
                  }}
                  className="flex-1 text-start text-rekhta-light/90 transition-colors group-hover:text-rekhta-gold"
                >
                  <span className={isUrdu ? "font-nastaliq text-lg" : "text-base"}>
                    {transliterate(g.title)}
                  </span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleFav(g.id)}
                    className="shrink-0 p-2 text-rekhta-muted hover:text-rekhta-red"
                  >
                    <Heart className={`h-4 w-4 ${favIds.has(g.id) ? "fill-rekhta-red text-rekhta-red" : ""}`} />
                  </button>
                  <ShareDialog
                    url={shareUrl}
                    title={g.title}
                    trigger={
                      <button className="shrink-0 p-2 text-rekhta-muted hover:text-rekhta-light transition-colors">
                        <Share2 className="h-4 w-4" />
                      </button>
                    }
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GhazalSection;
