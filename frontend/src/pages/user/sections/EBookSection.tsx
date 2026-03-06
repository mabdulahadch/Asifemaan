import { Heart, Share2, Loader2, BookOpen } from "lucide-react";
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
}

const EBookSection = ({ poetId: propPoetId, limit }: Props) => {
  const { t, isUrdu, transliterate } = useLanguage();
  const { id: urlPoetId } = useParams();
  const navigate = useNavigate();
  const poetId = propPoetId || urlPoetId;
  const { favIds, toggleFav } = useFavouriteContent();
  const [ebooks, setEbooks] = useState<Content[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEbooks = async () => {
      if (!poetId) return;
      setLoading(true);
      try {
        const allContent = await ContentService.getContentByPoet(poetId);
        const filteredEbooks = allContent.filter(c => c.type === "EBOOK");
        setEbooks(filteredEbooks);
      } catch (err) {
        console.error("Failed to fetch ebooks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEbooks();
  }, [poetId]);

  const displayed = limit ? ebooks.slice(0, limit) : ebooks;

  const handleToggleFav = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    toggleFav(id);
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
          {t("ebook")}{" "}
          <span className="text-sm text-rekhta-muted">({ebooks.length})</span>
        </h2>
        {limit && (
          <button
            onClick={() => navigate(`/poet/${poetId}/ebook`)}
            className="text-sm text-rekhta-gold hover:underline"
          >
            {t("seeAll")}
          </button>
        )}
      </div>

      {ebooks.length === 0 && !loading ? (
        <EmptyState translationKey="noEbooks" />
      ) : (

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {displayed.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/poet/${poetId}/ebook/${item.id}`)}
              className="group cursor-pointer rounded-lg border border-rekhta-border bg-rekhta-card/30 overflow-hidden transition-all hover:bg-rekhta-card/50 hover:shadow-lg hover:border-rekhta-gold/30"
            >
              <div className="aspect-[2/3] bg-rekhta-darker flex items-center justify-center relative overflow-hidden">
                {item.coverImage ? (
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <BookOpen className="h-12 w-12 text-rekhta-gold/20 group-hover:scale-110 transition-transform duration-500" />
                )}
              </div>


              <div className="p-3">
                <h3 className={`line-clamp-2 text-sm font-medium text-rekhta-light/90 group-hover:text-rekhta-gold ${isUrdu ? "font-nastaliq text-base leading-loose" : ""}`}>
                  {transliterate(item.title)}
                </h3>

                <div className="mt-2 flex items-center justify-between">
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => handleToggleFav(e, item.id)}
                      className="p-1.5 text-rekhta-muted hover:text-rekhta-red transition-colors"
                    >
                      <Heart className={`h-4 w-4 ${favIds.has(item.id) ? "fill-rekhta-red text-rekhta-red" : ""}`} />
                    </button>
                    <ShareDialog
                      url={`${window.location.origin}/poet/${poetId}/ebook/${item.id}`}
                      title={item.title}
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
          ))}
        </div>
      )}
    </div>
  );
};

export default EBookSection;
