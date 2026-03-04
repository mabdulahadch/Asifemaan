import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Poet, PoetService } from "@/lib/api/poets";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2 } from "lucide-react";

const PoetSection = () => {
    const [poets, setPoets] = useState<Poet[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { t, isUrdu } = useLanguage();

    useEffect(() => {
        const fetchPoets = async () => {
            try {
                const data = await PoetService.getAllPoets();
                setPoets(data);
            } catch (err) {
                console.error("Failed to fetch poets:", err);
                setError(t("failedToLoadPoets"));
            } finally {
                setLoading(false);
            }
        };

        fetchPoets();
    }, []);

    const isSinglePoet = poets.length === 1;

    return (

        <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                    {t("allPoets")}
                </h2>
                <p className="mt-2 text-rekhta-muted">
                    {t("poetsSubtitle")}
                </p>
                <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-rekhta-gold" />
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-rekhta-gold" />
                </div>
            ) : error ? (
                <div className="rounded-lg border border-rekhta-red/20 bg-rekhta-red/10 p-4 text-center text-rekhta-red">
                    {error}
                </div>
            ) : poets.length === 0 ? (
                <div className="py-20 text-center text-rekhta-muted">
                    {t("noPoetsFound")}
                </div>
            ) : isSinglePoet ? (
                /* Single Poet — Featured Hero Card Style */
                <div className="mx-auto max-w-3xl">
                    <Link
                        to={`/poet/${poets[0].id}`}
                        className="group block overflow-hidden rounded-2xl border border-rekhta-border bg-white shadow-sm transition-all hover:border-rekhta-gold/40 hover:shadow-xl"
                    >
                        <div className="flex flex-col items-center sm:flex-row">
                            {/* Large Photo */}
                            <div className="w-full shrink-0 overflow-hidden bg-muted sm:w-72 md:w-80">
                                <div className="aspect-square w-full overflow-hidden">
                                    {poets[0].profilePicture ? (
                                        <img
                                            src={poets[0].profilePicture}
                                            alt={poets[0].realName}
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-rekhta-gold/5 text-7xl font-bold text-rekhta-gold/30">
                                            {poets[0].realName.charAt(0)}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Details */}
                            <div className="flex flex-1 flex-col justify-center p-6 sm:p-8">
                                <h3
                                    className={`mb-2 font-bold text-foreground transition-colors group-hover:text-rekhta-gold ${isUrdu ? "font-nastaliq text-3xl" : "text-2xl sm:text-3xl"
                                        }`}
                                >
                                    {poets[0].penName || poets[0].realName}
                                </h3>

                                {poets[0].penName && poets[0].realName !== poets[0].penName && (
                                    <p className="mb-2 text-sm text-rekhta-muted">{poets[0].realName}</p>
                                )}

                                {poets[0].placeOfBirth && (
                                    <p className="mb-4 text-xs font-medium uppercase tracking-wider text-rekhta-muted">
                                        {poets[0].placeOfBirth}
                                    </p>
                                )}

                                {poets[0].bio && (
                                    <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-rekhta-muted">
                                        {poets[0].bio}
                                    </p>
                                )}

                                <span className="inline-flex w-fit items-center rounded-full bg-rekhta-gold/10 px-4 py-2 text-sm font-semibold text-rekhta-gold transition-colors group-hover:bg-rekhta-gold group-hover:text-white">
                                    {t("readMore")} →
                                </span>
                            </div>
                        </div>
                    </Link>
                </div>
            ) : (
                /* Multiple Poets — Grid Layout */
                <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {poets.map((poet) => (
                        <Link
                            key={poet.id}
                            to={`/poet/${poet.id}`}
                            className="group overflow-hidden rounded-xl border border-rekhta-border bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-rekhta-gold/40 hover:shadow-lg"
                        >
                            <div className="aspect-square w-full overflow-hidden bg-muted">
                                {poet.profilePicture ? (
                                    <img
                                        src={poet.profilePicture}
                                        alt={poet.realName}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-rekhta-muted/30">
                                        {poet.realName.charAt(0)}
                                    </div>
                                )}
                            </div>

                            <div className="p-3">
                                <h3
                                    className={`mb-0.5 font-semibold text-foreground transition-colors group-hover:text-rekhta-gold ${isUrdu ? "font-nastaliq text-lg" : "text-base"
                                        }`}
                                >
                                    {poet.penName || poet.realName}
                                </h3>
                                {poet.penName && poet.realName !== poet.penName && (
                                    <p className="text-xs text-rekhta-muted">{poet.realName}</p>
                                )}
                                {poet.placeOfBirth && (
                                    <p className="mt-1 text-xs uppercase tracking-wider text-rekhta-muted/70">
                                        {poet.placeOfBirth}
                                    </p>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </main>

    );
};

export default PoetSection;
