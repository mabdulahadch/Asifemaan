import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getFavContents, getFollowedPoets, removeFavContent, unfollowPoet } from "@/lib/api/favourites";
import { useLanguage } from "@/contexts/LanguageContext";
import TopNavBar from "@/pages/user/poetdetail/TopNavBar";
import { Button } from "@/components/ui/button";
import { Heart, UserMinus, Loader2, User, LogOut, ArrowLeft, Filter, X } from "lucide-react";

interface FavContent {
    id: number;
    poetId: number;
    title: string;
    type: string;
    textContent: string | null;
    poetName: string;
    poetPenName: string | null;
    poetImage: string | null;
}

interface FollowedPoet {
    id: number;
    realName: string;
    penName: string | null;
    profilePicture: string | null;
    bio: string | null;
}

type Tab = "favourites" | "poets";

const CONTENT_TYPE_KEYS = [
    { value: "ALL", key: "all" },
    { value: "GHAZAL", key: "ghazal" },
    { value: "NAZM", key: "nazm" },
    { value: "SHER", key: "sher" },
    { value: "AUDIO", key: "audio" },
    { value: "EBOOK", key: "ebook" },
    { value: "VIDEO", key: "video" },
];

const UserPanel = () => {
    const { t, transliterate } = useLanguage();
    const { user, isLoggedIn, loading: authLoading, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<Tab>("favourites");
    const [favContents, setFavContents] = useState<FavContent[]>([]);
    const [followedPoets, setFollowedPoets] = useState<FollowedPoet[]>([]);
    const [loading, setLoading] = useState(true);
    const [typeFilter, setTypeFilter] = useState("ALL");
    const [showFilter, setShowFilter] = useState(false);

    useEffect(() => {
        if (!authLoading && !isLoggedIn) {
            navigate("/login", { state: { from: "/my-profile" } });
        }
    }, [authLoading, isLoggedIn, navigate]);

    useEffect(() => {
        if (!isLoggedIn) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const [contents, poets] = await Promise.all([
                    getFavContents(),
                    getFollowedPoets(),
                ]);
                setFavContents(contents);
                setFollowedPoets(poets);
            } catch (err) {
                console.error("Failed to fetch user data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isLoggedIn]);

    const handleRemoveFav = async (contentId: number) => {
        try {
            await removeFavContent(contentId);
            setFavContents((prev) => prev.filter((c) => c.id !== contentId));
        } catch (err) {
            console.error("Failed to remove favourite:", err);
        }
    };

    const handleUnfollow = async (poetId: number) => {
        try {
            await unfollowPoet(poetId);
            setFollowedPoets((prev) => prev.filter((p) => p.id !== poetId));
        } catch (err) {
            console.error("Failed to unfollow poet:", err);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    if (authLoading || !isLoggedIn) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-rekhta-darker">
                <Loader2 className="h-8 w-8 animate-spin text-rekhta-gold" />
            </div>
        );
    }

    const typeLabel = (type: string) => {
        const found = CONTENT_TYPE_KEYS.find((ct) => ct.value === type);
        if (found) return t(found.key);
        return type;
    };

    const getContentRoute = (item: FavContent) => {
        const typePath = item.type.toLowerCase();
        return `/poet/${item.poetId}/${typePath}/${item.id}`;
    };

    // Apply content type filter
    const filteredFavContents =
        typeFilter === "ALL"
            ? favContents
            : favContents.filter((c) => c.type === typeFilter);

    // Counts per type for badges
    const typeCounts = favContents.reduce<Record<string, number>>((acc, c) => {
        acc[c.type] = (acc[c.type] || 0) + 1;
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-rekhta-darker">
            <TopNavBar />

            <div className="mx-auto max-w-4xl px-4 py-8">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(-1)}
                    className="mb-6 text-rekhta-muted hover:text-rekhta-light"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {t("back")}
                </Button>

                {/* User Header */}
                <div className="mb-8 rounded-xl border border-rekhta-border bg-gradient-to-r from-rekhta-card/40 to-rekhta-card/20 p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rekhta-gold/20 text-2xl font-bold text-rekhta-gold">
                                {user?.name?.charAt(0)?.toUpperCase()}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-rekhta-light">{user?.name}</h1>
                                <p className="text-sm text-rekhta-muted">{user?.email}</p>
                                <p className="mt-1 text-xs text-rekhta-muted/60">{user?.country}</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLogout}
                            className="text-rekhta-muted hover:text-rekhta-red"
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            {t("logout")}
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="mt-4 flex gap-6 border-t border-rekhta-border/50 pt-4">
                        <div className="text-center">
                            <span className="block text-xl font-bold text-rekhta-gold">{favContents.length}</span>
                            <span className="text-xs text-rekhta-muted">{t("favourites")}</span>
                        </div>
                        <div className="text-center">
                            <span className="block text-xl font-bold text-rekhta-gold">{followedPoets.length}</span>
                            <span className="text-xs text-rekhta-muted">{t("following")}</span>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-6 flex items-center justify-between border-b border-rekhta-border">
                    <div className="flex">
                        <button
                            onClick={() => setActiveTab("favourites")}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${activeTab === "favourites"
                                ? "border-b-2 border-rekhta-gold text-rekhta-gold"
                                : "text-rekhta-muted hover:text-rekhta-light"
                                }`}
                        >
                            <Heart className="h-4 w-4" />
                            {t("favouriteContent")}
                        </button>
                        <button
                            onClick={() => setActiveTab("poets")}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${activeTab === "poets"
                                ? "border-b-2 border-rekhta-gold text-rekhta-gold"
                                : "text-rekhta-muted hover:text-rekhta-light"
                                }`}
                        >
                            <User className="h-4 w-4" />
                            {t("followedPoets")}
                        </button>
                    </div>

                    {/* Filter toggle — only show on favourites tab */}
                    {activeTab === "favourites" && (
                        <button
                            onClick={() => setShowFilter(!showFilter)}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm transition-colors ${showFilter || typeFilter !== "ALL"
                                ? "text-rekhta-gold bg-rekhta-gold/10"
                                : "text-rekhta-muted hover:text-rekhta-light"
                                }`}
                        >
                            <Filter className="h-4 w-4" />
                            {typeFilter !== "ALL" && (
                                <span className="text-xs">{typeLabel(typeFilter)}</span>
                            )}
                        </button>
                    )}
                </div>

                {/* Filter chips */}
                {activeTab === "favourites" && showFilter && (
                    <div className="mb-4 flex flex-wrap gap-2">
                        {CONTENT_TYPE_KEYS.map((ct) => {
                            const count = ct.value === "ALL" ? favContents.length : typeCounts[ct.value] || 0;
                            return (
                                <button
                                    key={ct.value}
                                    onClick={() => setTypeFilter(ct.value)}
                                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${typeFilter === ct.value
                                        ? "bg-rekhta-gold text-rekhta-darker"
                                        : "border border-rekhta-border text-rekhta-muted hover:border-rekhta-gold/50 hover:text-rekhta-light"
                                        }`}
                                >
                                    {t(ct.key)}
                                    <span className={`text-[10px] ${typeFilter === ct.value ? "text-rekhta-darker/70" : "text-rekhta-muted/60"}`}>
                                        ({count})
                                    </span>
                                </button>
                            );
                        })}
                        {typeFilter !== "ALL" && (
                            <button
                                onClick={() => setTypeFilter("ALL")}
                                className="flex items-center gap-1 rounded-full px-2 py-1.5 text-xs text-rekhta-muted hover:text-rekhta-red transition-colors"
                            >
                                <X className="h-3 w-3" />
                                {t("clear")}
                            </button>
                        )}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-rekhta-gold" />
                    </div>
                ) : activeTab === "favourites" ? (
                    /* ─── Favourite Content ─── */
                    <div>
                        {filteredFavContents.length === 0 ? (
                            <div className="rounded-lg border border-rekhta-border bg-rekhta-card/10 p-12 text-center">
                                <Heart className="mx-auto mb-4 h-12 w-12 text-rekhta-muted/40" />
                                <p className="text-rekhta-muted">
                                    {typeFilter !== "ALL"
                                        ? `${t("noFavOfType")} ${typeLabel(typeFilter)}`
                                        : t("noFavContentYet")}
                                </p>
                                <p className="mt-2 text-sm text-rekhta-muted/60">
                                    {t("likeContentToSee")}
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-rekhta-border">
                                {filteredFavContents.map((item) => (
                                    <div
                                        key={item.id}
                                        className="group flex items-center justify-between py-4 transition-colors hover:bg-rekhta-card/30"
                                    >
                                        <Link
                                            to={getContentRoute(item)}
                                            className="flex-1 min-w-0"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="shrink-0 rounded bg-rekhta-gold/10 px-2 py-0.5 text-xs font-medium text-rekhta-gold">
                                                    {typeLabel(item.type)}
                                                </span>
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-rekhta-light/90 transition-colors group-hover:text-rekhta-gold">
                                                        {transliterate(item.title)}
                                                    </p>
                                                    <p className="text-xs text-rekhta-muted">
                                                        {transliterate(item.poetPenName || item.poetName)}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                        <button
                                            onClick={() => handleRemoveFav(item.id)}
                                            className="shrink-0 ml-2 p-2 text-rekhta-red/70 hover:text-rekhta-red transition-colors"
                                            title={t("remove")}
                                        >
                                            <Heart className="h-4 w-4 fill-current" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    /* ─── Followed Poets ─── */
                    <div>
                        {followedPoets.length === 0 ? (
                            <div className="rounded-lg border border-rekhta-border bg-rekhta-card/10 p-12 text-center">
                                <User className="mx-auto mb-4 h-12 w-12 text-rekhta-muted/40" />
                                <p className="text-rekhta-muted">
                                    {t("notFollowingAnyPoets")}
                                </p>
                                <p className="mt-2 text-sm text-rekhta-muted/60">
                                    {t("followPoetsToSee")}
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-4 sm:grid-cols-2">
                                {followedPoets.map((poet) => (
                                    <div
                                        key={poet.id}
                                        className="group flex items-center gap-4 rounded-lg border border-rekhta-border bg-rekhta-card/20 p-4 transition-colors hover:bg-rekhta-card/40"
                                    >
                                        <Link to={`/poet/${poet.id}`} className="shrink-0">
                                            <div className="h-14 w-14 overflow-hidden rounded-full border-2 border-rekhta-gold/20 bg-rekhta-card">
                                                {poet.profilePicture ? (
                                                    <img
                                                        src={poet.profilePicture}
                                                        alt={poet.realName}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-lg font-bold text-rekhta-gold/60">
                                                        {poet.realName.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                        <div className="flex-1 min-w-0">
                                            <Link to={`/poet/${poet.id}`}>
                                                <p className="font-medium text-rekhta-light transition-colors group-hover:text-rekhta-gold">
                                                    {transliterate(poet.penName || poet.realName)}
                                                </p>
                                            </Link>
                                            {poet.bio && (
                                                <p className="mt-1 truncate text-xs text-rekhta-muted">
                                                    {transliterate(poet.bio)}
                                                </p>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleUnfollow(poet.id)}
                                            className="shrink-0 rounded-full p-2 text-rekhta-muted hover:bg-rekhta-red/10 hover:text-rekhta-red transition-colors"
                                            title={t("unfollow")}
                                        >
                                            <UserMinus className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserPanel;
