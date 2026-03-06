import { CalendarDays, MapPin, Share2, UserPlus, UserCheck } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Poet } from "@/lib/api/poets";
import { useFollowPoet } from "@/hooks/useFavourite";

interface PoetHeroBannerProps {
  poet: Poet;
}

const PoetHeroBanner = ({ poet }: PoetHeroBannerProps) => {
  const { t, transliterate } = useLanguage();
  const { followedIds, toggleFollow } = useFollowPoet();

  const isFollowing = followedIds.has(poet.id);

  function getFirstSentence(text) {
  return text?.match(/.*?[.۔।]/)?.[0] || text;
}



  return (
    <section className="relative border-b border-rekhta-border bg-gradient-to-b from-rekhta-gold/10 to-rekhta-gold/10 py-8 md:py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 md:flex-row md:items-start md:gap-8">
        {/* Poet Photo */}
        <div className="relative shrink-0">
          <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-rekhta-gold/30 bg-muted md:h-40 md:w-40">
            {poet.profilePicture ? (
              <img
                src={poet.profilePicture}
                alt={poet.realName}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-rekhta-gold/60">
                {poet.realName.charAt(0)}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 text-center md:text-start">
          <h1 className="font-outfit text-3xl font-bold text-foreground md:text-4xl lg:text-4xl">
            {transliterate((poet.penName || poet.realName) || "")
              ?.toLowerCase()
              .replace(/\b\w/g, (c) => c.toUpperCase())}
          </h1>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-sm text-rekhta-muted md:justify-start">
            {poet.dateOfBirth && (
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" />
                {new Date(poet.dateOfBirth).getFullYear()}
              </span>
            )}
            {poet.placeOfBirth && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {transliterate(poet.placeOfBirth)}
              </span>
            )}
          </div>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-rekhta-muted">
            {/* {transliterate(poet.bio?.split('.')[0] + '.')} */}
            {transliterate(getFirstSentence(poet.bio))}
          </p>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-3 md:justify-start">
            <Button
              onClick={() => toggleFollow(poet.id)}
              size="sm"
              className={
                isFollowing
                  ? "border border-rekhta-gold bg-rekhta-gold/10 text-rekhta-gold hover:bg-rekhta-gold/20"
                  : "bg-rekhta-gold text-white hover:bg-rekhta-gold/90"
              }
            >
              {isFollowing ? (
                <UserCheck className="h-4 w-4" />
              ) : (
                <UserPlus className="h-4 w-4" />
              )}
              {isFollowing ? t("following") : t("follow")}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-rekhta-muted hover:text-foreground"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PoetHeroBanner;
