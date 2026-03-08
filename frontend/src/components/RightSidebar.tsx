import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

const sidebarLinks = [
  { key: "featuredPoetry", sectionId: "featured-poetry" },
  { key: "featuredEbooks", sectionId: "featured-ebooks" },
  { key: "featuredAudios", sectionId: "featured-audios" },
  { key: "featuredVideos", sectionId: "featured-videos" },
];

const RightSidebar = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleClick = (sectionId: string) => {
    // If already on the home page, scroll directly
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // Navigate to home first, then scroll after render
      navigate("/");
      setTimeout(() => {
        const target = document.getElementById(sectionId);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 500);
    }
  };

  return (
    <aside className="space-y-6">
      {/* Poet Navigation */}
      <div className="rounded-lg border border-rekhta-border bg-rekhta-card/20 p-4">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-rekhta-gold">
          {t("featuredContent")}
        </h3>
        <ul className="space-y-2">
          {sidebarLinks.map(({ key, sectionId }) => (
            <li key={key}>
              <button
                onClick={() => handleClick(sectionId)}
                className="text-sm text-rekhta-light/70 transition-colors hover:text-rekhta-gold"
              >
                {t(key)}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Explore More */}
      <div className="rounded-lg border border-rekhta-border bg-gradient-to-b from-rekhta-card/30 to-rekhta-darker p-4">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-rekhta-gold">
          {t("exploreMore")}
        </h3>
        <p className="text-xs leading-relaxed text-rekhta-muted">
          {t("exploreMoreDesc")}
        </p>
      </div>
    </aside>
  );
};

export default RightSidebar;
