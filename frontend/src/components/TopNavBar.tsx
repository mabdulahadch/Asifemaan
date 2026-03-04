import { User, LogOut, LayoutDashboard, Globe } from "lucide-react";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Language } from "@/lib/translations";
import { ContentService } from "@/lib/api/content";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languageOptions: { code: Language; label: string; nativeLabel: string }[] = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "ur", label: "Urdu", nativeLabel: "اردو" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी" },
];

const TopNavBar = () => {
  const { language, setLanguage, t } = useLanguage();
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { id = "1" } = useParams(); // Default to poet ID 1 for Home/global context
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchCounts = async () => {
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
    // Fetch counts only if we're on a public route where tabs will be shown
    if (!location.pathname.startsWith("/admin") && !location.pathname.startsWith("/login")) {
      fetchCounts();
    }
  }, [id, location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getActiveTab = () => {
    const path = location.pathname.split("/").pop();
    if (path === id || path === "") return "all";
    return path || "all";
  };

  const activeTab = getActiveTab();
  const currentLangOption = languageOptions.find((l) => l.code === language);
  const showTabs = !location.pathname.startsWith("/admin") && !location.pathname.startsWith("/login");

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
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm flex flex-col w-full">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/dist/assets/siteLogo.png"
              alt="Asifemaan"
              className="h-12 w-auto"
            />
          </Link>
        </div>

        {/* Center Tabs */}
        {showTabs && (
          <div className="hidden md:flex flex-1 justify-center px-4 overflow-hidden">
            <ScrollArea className="w-full whitespace-nowrap max-w-3xl">
              <div className="flex justify-center h-14">
                {tabs.map((tab) => (
                  <Link
                    key={tab.id}
                    to={`/poet/${id}/${tab.path}`}
                    className={`relative shrink-0 px-4 py-4 text-sm transition-colors flex items-center ${activeTab === tab.id
                      ? "text-rekhta-gold font-semibold"
                      : "text-rekhta-muted hover:text-foreground"
                      }`}
                  >
                    {t(tab.key as any)}
                    {tab.count !== undefined && (
                      <span className="ml-1 text-xs opacity-70">{tab.count}</span>
                    )}
                    {activeTab === tab.id && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rekhta-gold" />
                    )}
                  </Link>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="hidden" />
            </ScrollArea>
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-1.5">
          {/* Language Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 border-gray-300 bg-white text-xs text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              >
                <Globe className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">
                  {currentLangOption?.nativeLabel}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-40 border-gray-200 bg-white text-gray-800"
            >
              {languageOptions.map((opt) => (
                <DropdownMenuItem
                  key={opt.code}
                  onClick={() => setLanguage(opt.code)}
                  className={`cursor-pointer ${language === opt.code
                    ? "bg-rekhta-card font-semibold text-primary-700"
                    : "text-gray-700 focus:bg-primary-50 focus:text-primary-900"
                    }`}
                >
                  <span>{opt.nativeLabel}</span>
                  <span className="ml-auto text-xs text-gray-400">
                    {opt.label}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {isLoggedIn ? (
            <div className="flex items-center gap-1">
              {user?.role === "ADMIN" ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 border-gray-300 bg-white text-xs text-gray-700 hover:bg-gray-50"
                    >
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline">{user?.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-48 border-gray-200 bg-white text-gray-800"
                  >
                    <DropdownMenuItem
                      asChild
                      className="cursor-pointer focus:bg-gray-50"
                    >
                      <Link
                        to="/my-profile"
                        className="flex w-full items-center"
                      >
                        <User className="mr-2 h-4 w-4" />
                        {t("userPanel")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      asChild
                      className="cursor-pointer focus:bg-gray-50"
                    >
                      <Link to="/admin" className="flex w-full items-center">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        {t("adminPanel")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-200" />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      {t("logout")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 border-gray-300 bg-white text-xs text-gray-700 hover:bg-gray-50"
                    asChild
                  >
                    <Link to="/my-profile">
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline">{user?.name}</span>
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-gray-500 hover:bg-red-50 hover:text-red-600"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-primary bg-primary text-xs text-white hover:bg-primary/80"
              asChild
            >
              <Link to="/login">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{t("login")}</span>
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Tabs Row (Shows below header only on small screens) */}
      {showTabs && (
        <div className="md:hidden mx-auto w-full max-w-7xl px-4 border-t border-gray-100">
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
                  {t(tab.key as any)}
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
      )}
    </header>
  );
};

export default TopNavBar;
