import { useState, useEffect } from "react";
import { useParams, useLocation, Outlet } from "react-router-dom";
import TopNavBar from "@/pages/user/poetdetail/TopNavBar";
import Footer from "@/components/Footer";
import PoetHeroBanner from "@/pages/user/poetdetail/PoetHeroBanner";
import { useLanguage } from "@/contexts/LanguageContext";
import { PoetService, Poet } from "@/lib/api/poets";
import { Loader2 } from "lucide-react";

const PoetProfile = () => {
  const { id } = useParams();
  const location = useLocation();
  const [poet, setPoet] = useState<Poet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { t, isUrdu } = useLanguage();

  useEffect(() => {
    const fetchPoet = async () => {
      if (!id) return;
      try {
        const data = await PoetService.getPoetById(id);
        setPoet(data);
      } catch (err) {
        console.error("Failed to fetch poet:", err);
        setError(t("failedToLoadProfile"));
      } finally {
        setLoading(false);
      }
    };

    fetchPoet();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );
  }

  if (error || !poet) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-red-500">
        {error || t("poetNotFound")}
      </div>
    );
  }

  const renderProfileTab = () => (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="mb-3 text-lg font-semibold text-amber-600">
        {t("about")}
      </h2>
      <p
        className={`leading-relaxed text-gray-700 ${isUrdu ? "font-nastaliq text-lg" : ""
          }`}
      >
        {poet.bio}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <TopNavBar />
      <PoetHeroBanner poet={poet} />

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <main className="min-w-0 flex-1">
            <Outlet context={{ poet, renderProfileTab }} />
          </main>

          {/* Sidebar - hidden on mobile */}
          <div className="hidden w-64 shrink-0 lg:block">
            {/* <RightSidebar /> */}
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default PoetProfile;
