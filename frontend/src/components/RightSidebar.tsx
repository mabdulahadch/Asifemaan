import { useScript } from "@/contexts/ScriptContext";

const RightSidebar = () => {
  const { isUrdu } = useScript();

  const poetLinks = [
    { roman: "Index of Poets", urdu: "شعراء کی فہرست" },
    { roman: "Top Read Poets", urdu: "سب سے زیادہ پڑھے جانے والے" },
    { roman: "Classical Poets", urdu: "کلاسیکی شعراء" },
    { roman: "Women Poets", urdu: "خواتین شعراء" },
    { roman: "Young Poets", urdu: "نوجوان شعراء" },
    { roman: "Poet Audios", urdu: "شعراء کے آڈیو" },
  ];

  return (
    <aside className="space-y-6">
      {/* Poet Navigation */}
      <div className="rounded-lg border border-rekhta-border bg-rekhta-card/20 p-4">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-rekhta-gold">
          {isUrdu ? "شعراء" : "Poets"}
        </h3>
        <ul className="space-y-2">
          {poetLinks.map((link) => (
            <li key={link.roman}>
              <button
                className={`text-sm text-rekhta-light/70 transition-colors hover:text-rekhta-gold ${
                  isUrdu ? "font-nastaliq text-base" : ""
                }`}
              >
                {isUrdu ? link.urdu : link.roman}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Explore More */}
      <div className="rounded-lg border border-rekhta-border bg-gradient-to-b from-rekhta-card/30 to-rekhta-darker p-4">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-rekhta-gold">
          {isUrdu ? "مزید دریافت کریں" : "Explore More"}
        </h3>
        <p className="text-xs leading-relaxed text-rekhta-muted">
          {isUrdu
            ? "اردو شاعری کی دنیا میں خوش آمدید۔ ہزاروں غزلیں، نظمیں اور اشعار پڑھیں۔"
            : "Welcome to the world of Urdu poetry. Read thousands of ghazals, nazms, and couplets from renowned poets."}
        </p>
      </div>
    </aside>
  );
};

export default RightSidebar;
