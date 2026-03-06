import { useState, useEffect } from "react";
import { AdminService } from "@/lib/api/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Trash2, Upload, Link as LinkIcon, Save } from "lucide-react";



interface SiteSettings {
    youtubeUrl: string | null;
    facebookUrl: string | null;
    instagramUrl: string | null;
    linkedinUrl: string | null;
    twitterUrl: string | null;
    banners: string | null;
}

const emptySettings: SiteSettings = {
    youtubeUrl: "",
    facebookUrl: "",
    instagramUrl: "",
    linkedinUrl: "",
    twitterUrl: "",
    banners: null,
};

const AdminSiteSettings = () => {
    const [settings, setSettings] = useState<SiteSettings>(emptySettings);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [uploadProgress, setUploadProgress] = useState(0);

    // Existing banners from DB
    const [existingBanners, setExistingBanners] = useState<string[]>([]);
    // New banners pending upload
    const [newBanners, setNewBanners] = useState<File[]>([]);

    // Logo state
    const [existingLogo, setExistingLogo] = useState<string | null>(null);
    const [newLogo, setNewLogo] = useState<File | null>(null);

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await AdminService.getSettings();
                const data = res.data;
                if (data) {
                    setSettings({
                        youtubeUrl: data.youtubeUrl || "",
                        facebookUrl: data.facebookUrl || "",
                        instagramUrl: data.instagramUrl || "",
                        linkedinUrl: data.linkedinUrl || "",
                        twitterUrl: data.twitterUrl || "",
                        banners: data.banners || null,
                    });
                    setExistingLogo(data.logo || null);

                    if (data.banners) {
                        try {
                            const parsed = JSON.parse(data.banners);
                            if (Array.isArray(parsed)) {
                                setExistingBanners(parsed);
                            }
                        } catch (e) {
                            console.error("Failed to parse banners", e);
                        }
                    }
                }
            } catch (err) {
                setError("Failed to load settings.");
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleBannerSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        const newFilesArray = Array.from(files).filter(file => file.type.startsWith("image/"));
        setNewBanners(prev => [...prev, ...newFilesArray]);
    };

    const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        const file = files[0];
        if (file.type.startsWith("image/")) {
            setNewLogo(file);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setError("");
        setSuccessMsg("");
        setUploadProgress(0);

        try {
            const formData = new FormData();
            formData.append("youtubeUrl", settings.youtubeUrl || "");
            formData.append("facebookUrl", settings.facebookUrl || "");
            formData.append("instagramUrl", settings.instagramUrl || "");
            formData.append("linkedinUrl", settings.linkedinUrl || "");
            formData.append("twitterUrl", settings.twitterUrl || "");
            formData.append("existingBanners", JSON.stringify(existingBanners));

            newBanners.forEach(file => {
                formData.append("banners", file);
            });

            if (newLogo) {
                formData.append("logo", newLogo);
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent: any) => {
                    if (progressEvent.total) {
                        const percent = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setUploadProgress(percent);
                    }
                },
            };

            const res = await AdminService.updateSettings(formData, config);
            const updatedData = res.data;

            setSuccessMsg("Settings saved successfully.");
            setNewBanners([]);
            setNewLogo(null);

            if (updatedData) {
                setExistingLogo(updatedData.logo || null);
                if (updatedData.banners) {
                    try {
                        const parsed = JSON.parse(updatedData.banners);
                        if (Array.isArray(parsed)) {
                            setExistingBanners(parsed);
                        }
                    } catch (e) { }
                }
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to save settings.");
        } finally {
            setSaving(false);
            setUploadProgress(0);
        }
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-12">
            <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Site Settings</h2>
                <p className="text-sm text-muted-foreground">Manage global banners and footer social links.</p>
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {successMsg && (
                <Alert className="bg-green-50 text-green-800 border-green-200">
                    <AlertDescription>{successMsg}</AlertDescription>
                </Alert>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <LinkIcon className="h-5 w-5 text-primary" /> Social Links (Footer)
                    </CardTitle>
                    <CardDescription>Enter complete URLs including https://</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="youtubeUrl">YouTube</Label>
                            <Input
                                id="youtubeUrl"
                                placeholder="https://youtube.com/..."
                                value={settings.youtubeUrl || ""}
                                onChange={e => setSettings({ ...settings, youtubeUrl: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="facebookUrl">Facebook</Label>
                            <Input
                                id="facebookUrl"
                                placeholder="https://facebook.com/..."
                                value={settings.facebookUrl || ""}
                                onChange={e => setSettings({ ...settings, facebookUrl: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="instagramUrl">Instagram</Label>
                            <Input
                                id="instagramUrl"
                                placeholder="https://instagram.com/..."
                                value={settings.instagramUrl || ""}
                                onChange={e => setSettings({ ...settings, instagramUrl: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="linkedinUrl">LinkedIn</Label>
                            <Input
                                id="linkedinUrl"
                                placeholder="https://linkedin.com/..."
                                value={settings.linkedinUrl || ""}
                                onChange={e => setSettings({ ...settings, linkedinUrl: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="twitterUrl">Twitter / X</Label>
                            <Input
                                id="twitterUrl"
                                placeholder="https://twitter.com/..."
                                value={settings.twitterUrl || ""}
                                onChange={e => setSettings({ ...settings, twitterUrl: e.target.value })}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Upload className="h-5 w-5 text-primary" /> Site Logo
                    </CardTitle>
                    <CardDescription>Upload the primary site logo (used in navbar and admin panel).</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="logoUpload">Upload New Logo</Label>
                        <Input
                            id="logoUpload"
                            type="file"
                            accept="image/*"
                            onChange={handleLogoSelect}
                            className="bg-white"
                        />
                    </div>

                    {(existingLogo || newLogo) && (
                        <div className="space-y-3">
                            <Label>Current Logo Preview</Label>
                            <div className="w-48 h-24 relative rounded-md border border-border bg-muted/20 flex items-center justify-center p-2">
                                <img
                                    src={newLogo ? URL.createObjectURL(newLogo) : (existingLogo || "")}
                                    alt="Site Logo"
                                    className="max-w-full max-h-full object-contain"
                                />
                                {newLogo && (
                                    <div className="absolute inset-x-0 bottom-0 bg-primary/80 p-1 text-xs text-primary-foreground text-center truncate">
                                        Pending Save
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Upload className="h-5 w-5 text-primary" /> Global Banners
                    </CardTitle>
                    <CardDescription>These banners will appear globally (e.g., home page sliders).</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="bannersUpload">Upload New Banners</Label>
                        <Input
                            id="bannersUpload"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleBannerSelect}
                            className="bg-white"
                        />
                    </div>

                    {((existingBanners && existingBanners.length > 0) || newBanners.length > 0) && (
                        <div className="space-y-3">
                            <Label>Current & Pending Banners</Label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* Existing */}
                                {existingBanners.map((src, i) => (
                                    <div key={`existing-${i}`} className="relative group rounded-md overflow-hidden border border-border bg-muted/20">
                                        <img src={src} alt="Banner" className="w-full h-32 object-cover" />
                                        <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1 text-xs text-white text-center truncate">
                                            Saved
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setExistingBanners(prev => prev.filter((_, idx) => idx !== i))}
                                            className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}

                                {/* New */}
                                {newBanners.map((file, i) => (
                                    <div key={`new-${i}`} className="relative group rounded-md overflow-hidden border-2 border-primary/50 bg-primary/5">
                                        <img src={URL.createObjectURL(file)} alt="Banner" className="w-full h-32 object-cover opacity-80" />
                                        <div className="absolute inset-x-0 bottom-0 bg-primary/80 p-1 text-xs text-primary-foreground text-center truncate">
                                            New File
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setNewBanners(prev => prev.filter((_, idx) => idx !== i))}
                                            className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {saving && uploadProgress > 0 && (
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden mt-4">
                            <div
                                className="bg-primary h-full transition-all duration-300 rounded-full"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="flex justify-end pt-4">
                <Button onClick={handleSave} disabled={saving} size="lg" className="px-8">
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    {saving && uploadProgress > 0 ? `Saving... ${uploadProgress}%` : saving ? "Saving..." : "Save All Settings"}
                </Button>
            </div>
        </div>
    );
};

export default AdminSiteSettings;
