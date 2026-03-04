import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
    const { isUrdu } = useLanguage();

    return (
        <footer className="bg-rekhta-gold/10 py-10 mt-auto border-t border-rekhta-border/30">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Logo & Copyright */}
                    <div className="flex flex-col items-center md:items-start gap-3">
                        <Link to="/" className="flex items-center gap-2">
                            <img
                                src="/dist/assets/siteLogo.png"
                                alt="Asifemaan"
                                className="h-12 w-auto opacity-90 grayscale-[0.2]"
                            />
                        </Link>
                        <p className="text-sm font-medium text-rekhta-muted">
                            © {new Date().getFullYear()} Asifemaan. {isUrdu ? "جملہ حقوق محفوظ ہیں۔" : "All rights reserved."}
                        </p>
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center gap-4">
                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-rekhta-muted shadow-sm transition-all hover:scale-110 hover:border-rekhta-gold hover:text-rekhta-gold border border-transparent"
                            aria-label="Facebook"
                        >
                            <Facebook className="h-5 w-5" />
                        </a>
                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-rekhta-muted shadow-sm transition-all hover:scale-110 hover:border-rekhta-gold hover:text-rekhta-gold border border-transparent"
                            aria-label="Twitter"
                        >
                            <Twitter className="h-5 w-5 fill-current" />
                        </a>
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-rekhta-muted shadow-sm transition-all hover:scale-110 hover:border-rekhta-gold hover:text-rekhta-gold border border-transparent"
                            aria-label="Instagram"
                        >
                            <Instagram className="h-5 w-5" />
                        </a>
                        <a
                            href="https://linkedin.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-rekhta-muted shadow-sm transition-all hover:scale-110 hover:border-rekhta-gold hover:text-rekhta-gold border border-transparent"
                            aria-label="LinkedIn"
                        >
                            <Linkedin className="h-5 w-5 fill-current" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
