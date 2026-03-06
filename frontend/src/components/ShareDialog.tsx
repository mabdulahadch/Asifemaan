import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Facebook, Linkedin, Twitter, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface ShareDialogProps {
    url?: string;
    title?: string;
    trigger: React.ReactNode;
}

const ShareDialog = ({ url = window.location.href, title = "Check this out!", trigger }: ShareDialogProps) => {
    const { t } = useLanguage();

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(url);
            toast.success(t("linkCopied"));
        } catch (err) {
            toast.error(t("failedToCopyLink"));
        }
    };

    const shareOptions = [
        {
            name: "WhatsApp",
            icon: <MessageCircle className="h-5 w-5 text-[#25D366]" />,
            href: `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`,
        },
        {
            name: "Twitter",
            icon: <Twitter className="h-5 w-5 text-[#1DA1F2]" />,
            href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
        },
        {
            name: "Facebook",
            icon: <Facebook className="h-5 w-5 text-[#1877F2]" />,
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        },
        {
            name: "LinkedIn",
            icon: <Linkedin className="h-5 w-5 text-[#0A66C2]" />,
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        },
    ];

    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="bg-rekhta-card border-rekhta-border text-rekhta-light sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-rekhta-gold">
                        {t("share")}
                    </DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                    {shareOptions.map((option) => (
                        <Button
                            key={option.name}
                            variant="outline"
                            className="flex items-center justify-start gap-3 border-rekhta-border bg-rekhta-card hover:bg-rekhta-gold/10 hover:text-rekhta-gold transition-colors"
                            asChild
                        >
                            <a href={option.href} target="_blank" rel="noopener noreferrer">
                                {option.icon}
                                <span>{option.name}</span>
                            </a>
                        </Button>
                    ))}
                    <Button
                        variant="outline"
                        className="col-span-2 flex items-center justify-start gap-3 border-rekhta-border bg-rekhta-card hover:bg-rekhta-gold/10 hover:text-rekhta-gold transition-colors"
                        onClick={handleCopyLink}
                    >
                        <Copy className="h-5 w-5 text-rekhta-muted" />
                        <span>{t("copyLink")}</span>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ShareDialog;
