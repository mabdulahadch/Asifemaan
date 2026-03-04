import { ArrowLeft, Heart, Share2, Loader2, Download, ExternalLink, BookOpen } from "lucide-react";
import { useScript } from "@/contexts/ScriptContext";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Content, ContentService } from "@/lib/api/content";
import { Button } from "@/components/ui/button";
import { useFavouriteContent } from "@/hooks/useFavourite";
import ShareDialog from "@/components/ShareDialog";

const EBookDetailView = () => {
    const { isUrdu } = useScript();
    const { contentId } = useParams();
    const navigate = useNavigate();
    const [ebook, setEbook] = useState<Content | null>(null);
    const [loading, setLoading] = useState(true);
    const { favIds, toggleFav } = useFavouriteContent();

    useEffect(() => {
        const fetchEbook = async () => {
            if (!contentId) return;
            try {
                const data = await ContentService.getContentById(contentId);
                setEbook(data);
            } catch (err) {
                console.error("Failed to fetch ebook:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchEbook();
    }, [contentId]);

    const getPdfUrl = (path: string | null) => {
        if (!path) return "";
        return path;
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-rekhta-gold" />
            </div>
        );
    }

    if (!ebook) return <div className="text-rekhta-light text-center py-12">E-Book not found</div>;

    return (
        <div className="flex flex-col h-full space-y-4">
            <div className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(-1)}
                    className="text-rekhta-muted hover:text-rekhta-light"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {isUrdu ? "واپس" : "Back"}
                </Button>

                <div className="flex gap-2 items-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleFav(ebook.id)}
                        className="text-rekhta-muted hover:text-rekhta-red"
                    >
                        <Heart className={`h-5 w-5 ${favIds.has(ebook.id) ? "fill-rekhta-red text-rekhta-red" : ""}`} />
                    </Button>
                    <ShareDialog
                        url={window.location.href}
                        title={ebook.title}
                        trigger={
                            <Button variant="ghost" size="icon" className="text-rekhta-muted hover:text-rekhta-light">
                                <Share2 className="h-5 w-5" />
                            </Button>
                        }
                    />
                    {ebook.pdfFile && (
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-rekhta-gold/50 text-rekhta-gold hover:bg-rekhta-gold hover:text-rekhta-darker"
                                asChild
                            >
                                <a href={getPdfUrl(ebook.pdfFile)} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    {isUrdu ? "بڑے اسکرین پر دیکھیں" : "View Full Screen"}
                                </a>
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-rekhta-gold/50 text-rekhta-gold hover:bg-rekhta-gold hover:text-rekhta-darker"
                                asChild
                            >
                                <a href={getPdfUrl(ebook.pdfFile)} download={`${ebook.title}.pdf`}>
                                    <Download className="mr-2 h-4 w-4" />
                                    {isUrdu ? "ڈاؤن لوڈ" : "Download"}
                                </a>
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <div className="mb-4">
                <h2 className={`text-2xl font-bold text-rekhta-light ${isUrdu ? "font-nastaliq text-3xl" : ""}`}>
                    {ebook.title}
                </h2>
            </div>

            <div className="flex-1 min-h-[600px] w-full rounded-lg border border-rekhta-border bg-rekhta-card/30 overflow-hidden">
                {ebook.pdfFile ? (
                    <iframe
                        src={`${getPdfUrl(ebook.pdfFile)}#toolbar=0`}
                        className="h-full w-full"
                        title={ebook.title}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-rekhta-muted">
                        <BookOpen className="h-16 w-16 mb-4 opacity-20" />
                        <p>{isUrdu ? "پی ڈی ایف دستیاب نہیں ہے" : "PDF not available."}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EBookDetailView;
