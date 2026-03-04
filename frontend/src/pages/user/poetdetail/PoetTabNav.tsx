import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ContentService } from "@/lib/api/content";

interface Props {
  activeTab: string;
}

const PoetTabNav = ({ activeTab }: Props) => {
  const { t } = useLanguage();
  const { id } = useParams();
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchCounts = async () => {
      if (!id) return;
      try {
        const allContent = await ContentService.getContentByPoet(id);
        setCounts({
          ghazal: allContent.filter((c) => c.type === "GHAZAL").length,
          nazm: allContent.filter((c) => c.type === "NAZM").length,
          sher: allContent.filter((c) => c.type === "SHER").length,
          ebook: allContent.filter((c) => c.type === "EBOOK").length,
          audio: allContent.filter((c) => c.type === "AUDIO").length,
          video: allContent.filter((c) => c.type === "VIDEO").length,
        });
      } catch (err) {
        console.error("Failed to fetch content counts:", err);
      }
    };
    fetchCounts();
  }, [id]);

  const tabs = [
    { id: "all", path: "", key: "all" },
    { id: "profile", path: "profile", key: "profile" },
    { id: "ghazal", path: "ghazal", key: "ghazal", count: counts.ghazal },
    { id: "nazm", path: "nazm", key: "nazm", count: counts.nazm },
    { id: "sher", path: "sher", key: "sher", count: counts.sher },
    { id: "ebook", path: "ebook", key: "ebook", count: counts.ebook },
    { id: "audio", path: "audio", key: "audio", count: counts.audio },
    { id: "video", path: "video", key: "video", count: counts.video },
  ];

  return (
    <div className="border-b border-rekhta-border bg-white ">
      <div className="mx-auto max-w-7xl px-4">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                to={`/poet/${id}/${tab.path}`}
                className={`relative shrink-0 px-4 py-3 text-sm transition-colors ${activeTab === tab.id
                  ? "text-rekhta-gold font-semibold"
                  : "text-rekhta-muted hover:text-foreground"
                  }`}
              >
                {t(tab.key)}
                {tab.count !== undefined && (
                  <span className="ml-1 text-xs opacity-70">{tab.count}</span>
                )}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rekhta-gold" />
                )}
              </Link>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
};

export default PoetTabNav;
