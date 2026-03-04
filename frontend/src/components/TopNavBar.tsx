import { User, LogOut, LayoutDashboard, Globe } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Language } from "@/lib/translations";
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

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const currentLangOption = languageOptions.find((l) => l.code === language);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/dist/assets/siteLogo.png"
            alt="Asifemaan"
            className="h-12 w-auto"
          />
        </Link>

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
    </header>
  );
};

export default TopNavBar;
