import { Facebook, Instagram, Twitter, Linkedin, Youtube } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";
import { HomeService } from "@/lib/api/home";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const Footer = () => {
    const { t } = useLanguage();
    const { toast } = useToast();
    const location = useLocation();
    const [settings, setSettings] = useState<any>(null);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [country, setCountry] = useState("");
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);

    useEffect(() => {
        HomeService.getSettings()
            .then(res => {
                if (res && res.data) {
                    setSettings(res.data);
                }
            })
            .catch(err => console.error("Failed to load footer links", err));
    }, []);

    const handleContactSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/contact`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, country, message }),
            });
            const data = await res.json();

            if (res.ok && data.success) {
                toast({
                    title: t("messageSentTitle") || "Message Sent",
                    description: data.message || t("messageSentDesc") || "Your message has been sent successfully.",
                    variant: "default",
                });
                setName("");
                setEmail("");
                setCountry("");
                setMessage("");
            } else {
                toast({
                    title: t("errorTitle") || "Error",
                    description: data.message || t("errorDesc") || "Failed to send message.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: t("errorTitle") || "Error",
                description: t("errorDesc") || "An unexpected error occurred. Please try again later.",
                variant: "destructive",
            });
        } finally {
            setSending(false);
        }
    };

    if (location.pathname.startsWith("/admin")) {
        return null;
    }

    const handleScrollTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className="bg-rekhta-gold/10 py-10 mt-auto border-t border-rekhta-border/30">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-start justify-between gap-12">

                    {/* Left Side: Logo, Nav Links, Copyright & Socials */}
                    <div className="flex flex-col gap-8 lg:w-1/2">
                        {/* Logo */}
                        <div className="flex flex-col items-start gap-3">
                            <Link to="/" onClick={handleScrollTop} className="flex items-center gap-2">
                                {settings?.logo ? (
                                    <img
                                        src={settings.logo}
                                        alt="Site Logo"
                                        className="h-16 w-auto opacity-90 grayscale-[0.2] object-contain"
                                    />
                                ) : (
                                    <span className="text-xl font-bold text-rekhta-darker">Asifemaan</span>
                                )}
                            </Link>
                            <p className="text-sm text-rekhta-muted max-w-sm mt-2 leading-relaxed">
                                {t("PoetryAndLiterary")}
                            </p>
                        </div>

                        {/* Navigation Links */}
                        <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm font-medium mt-2">
                            <NavLink to="/" onClick={handleScrollTop} className={({ isActive }) => `transition-colors ${isActive ? "text-rekhta-gold" : "text-rekhta-darker/80 hover:text-rekhta-gold"}`}>{t("home") || "Home"}</NavLink>
                            <NavLink to="/poet/1/ghazal" onClick={handleScrollTop} className={({ isActive }) => `transition-colors ${isActive ? "text-rekhta-gold" : "text-rekhta-darker/80 hover:text-rekhta-gold"}`}>{t("ghazal") || "Ghazals"}</NavLink>
                            <NavLink to="/poet/1/nazm" onClick={handleScrollTop} className={({ isActive }) => `transition-colors ${isActive ? "text-rekhta-gold" : "text-rekhta-darker/80 hover:text-rekhta-gold"}`}>{t("nazm") || "Nazms"}</NavLink>
                            <NavLink to="/poet/1/sher" onClick={handleScrollTop} className={({ isActive }) => `transition-colors ${isActive ? "text-rekhta-gold" : "text-rekhta-darker/80 hover:text-rekhta-gold"}`}>{t("sher") || "Shers"}</NavLink>
                            <NavLink to="/poet/1/ebook" onClick={handleScrollTop} className={({ isActive }) => `transition-colors ${isActive ? "text-rekhta-gold" : "text-rekhta-darker/80 hover:text-rekhta-gold"}`}>{t("ebook") || "E-books"}</NavLink>
                            <NavLink to="/poet/1/video" onClick={handleScrollTop} className={({ isActive }) => `transition-colors ${isActive ? "text-rekhta-gold" : "text-rekhta-darker/80 hover:text-rekhta-gold"}`}>{t("video") || "Videos"}</NavLink>
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center gap-3 pt-4">
                            {settings?.youtubeUrl && (
                                <a
                                    href={settings.youtubeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-rekhta-muted shadow-sm transition-all hover:-translate-y-1 hover:border-rekhta-gold hover:text-rekhta-gold border border-transparent"
                                    aria-label="YouTube"
                                >
                                    <Youtube className="h-5 w-5" />
                                </a>
                            )}
                            {settings?.facebookUrl && (
                                <a
                                    href={settings.facebookUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-rekhta-muted shadow-sm transition-all hover:-translate-y-1 hover:border-rekhta-gold hover:text-rekhta-gold border border-transparent"
                                    aria-label="Facebook"
                                >
                                    <Facebook className="h-5 w-5" />
                                </a>
                            )}
                            {settings?.twitterUrl && (
                                <a
                                    href={settings.twitterUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-rekhta-muted shadow-sm transition-all hover:-translate-y-1 hover:border-rekhta-gold hover:text-rekhta-gold border border-transparent"
                                    aria-label="Twitter"
                                >
                                    <Twitter className="h-5 w-5 fill-current" />
                                </a>
                            )}
                            {settings?.instagramUrl && (
                                <a
                                    href={settings.instagramUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-rekhta-muted shadow-sm transition-all hover:-translate-y-1 hover:border-rekhta-gold hover:text-rekhta-gold border border-transparent"
                                    aria-label="Instagram"
                                >
                                    <Instagram className="h-5 w-5" />
                                </a>
                            )}
                            {settings?.linkedinUrl && (
                                <a
                                    href={settings.linkedinUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-rekhta-muted shadow-sm transition-all hover:-translate-y-1 hover:border-rekhta-gold hover:text-rekhta-gold border border-transparent"
                                    aria-label="LinkedIn"
                                >
                                    <Linkedin className="h-5 w-5 fill-current" />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Right Side: Write to us form */}
                    <div className="w-full lg:w-1/2 max-w-md lg:ml-auto">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-rekhta-border/50">
                            <h3 className="text-lg font-semibold text-rekhta-darker mb-1">{t("writeToUs") || "Write to Us"}</h3>
                            <p className="text-sm text-rekhta-muted mb-5">{t("writeToUsSub") || "We would love to hear from you."}</p>

                            <form onSubmit={handleContactSubmit} className="space-y-4">
                                <div>
                                    <Input
                                        placeholder={t("nameField") || "Name"}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        className="bg-white border-rekhta-border focus-visible:ring-rekhta-gold focus-visible:border-transparent"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        type="email"
                                        placeholder={t("emailField") || "Email"}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="bg-white border-rekhta-border focus-visible:ring-rekhta-gold focus-visible:border-transparent"
                                    />
                                    <Input
                                        placeholder={t("countryField") || "Country"}
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                        className="bg-white border-rekhta-border focus-visible:ring-rekhta-gold focus-visible:border-transparent"
                                    />
                                </div>
                                <div>
                                    <Textarea
                                        placeholder={t("messageField") || "Your Message..."}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        required
                                        className="min-h-[100px] resize-none bg-white border-rekhta-border focus-visible:ring-rekhta-gold focus-visible:border-transparent"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full bg-rekhta-gold hover:bg-rekhta-gold/90 text-white font-medium shadow-sm transition-all"
                                    disabled={sending}
                                >
                                    {sending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (t("sendMessage") || "Send Message")}
                                </Button>
                            </form>
                        </div>
                    </div>

                </div>

                {/* Copyright Mobile */}
                <div className="mt-12 pt-6 border-t border-rekhta-border/30 text-center lg:text-left">
                    <p className="text-xs font-medium text-rekhta-muted">
                        © {new Date().getFullYear()} Asifemaan. {t("allRightsReserved")}
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
