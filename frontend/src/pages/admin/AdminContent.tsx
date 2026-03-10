import { useState, useEffect } from "react";
import { AdminService } from "@/lib/api/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Loader2, Plus, Pencil, Trash2, FileText, Upload, Star } from "lucide-react";



const CONTENT_TYPES = ["GHAZAL", "NAZM", "SHER", "EBOOK", "AUDIO", "VIDEO"] as const;

interface Poet {
    id: number;
    realName: string;
    penName: string | null;
}

interface ContentItem {
    id: number;
    poetId: number;
    title: string;
    type: string;
    textContent: string | null;
    pdfFile: string | null;
    youtubeLink: string | null;
    audioFile: string | null;
    coverImage: string | null;
    mediaFiles?: string | null;
    isFeatured: number;
}

const emptyForm = {
    title: "",
    type: "GHAZAL" as string,
    textContent: "",
    pdfFile: "",
    youtubeLink: "",
    audioFile: "",
    coverImage: "",
    mediaFiles: [] as string[],
    isFeatured: false,
};

const AdminContent = () => {
    const [poets, setPoets] = useState<Poet[]>([]);
    const [selectedPoetId, setSelectedPoetId] = useState<string>("");
    const [content, setContent] = useState<ContentItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [poetsLoading, setPoetsLoading] = useState(true);
    const [error, setError] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    const [pdfFileObj, setPdfFileObj] = useState<File | null>(null);
    const [audioFileObj, setAudioFileObj] = useState<File | null>(null);
    const [coverImageFileObj, setCoverImageFileObj] = useState<File | null>(null);
    const [mediaFilesObj, setMediaFilesObj] = useState<File[]>([]);

    const token = localStorage.getItem("token");

    // Fetch poets on mount
    useEffect(() => {
        const fetchPoets = async () => {
            try {
                const res = await AdminService.getPoets();
                setPoets(res.data);
                if (res.data && res.data.length > 0) {
                    const firstPoetId = String(res.data[0].id);
                    setSelectedPoetId(firstPoetId);
                    fetchContent(firstPoetId);
                }
            } catch {
                setError("Failed to load poets.");
            } finally {
                setPoetsLoading(false);
            }
        };
        fetchPoets();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetch content when poet changes
    const fetchContent = async (poetId: string) => {
        setLoading(true);
        setError("");
        try {
            const res = await AdminService.getContentByPoet(poetId);
            setContent(res.data);
        } catch {
            setError("Failed to load content.");
        } finally {
            setLoading(false);
        }
    };

    const handlePoetSelect = (value: string) => {
        setSelectedPoetId(value);
        fetchContent(value);
    };

    const openCreate = () => {
        setEditingId(null);
        setForm(emptyForm);
        setPdfFileObj(null);
        setAudioFileObj(null);
        setCoverImageFileObj(null);
        setMediaFilesObj([]);
        setDialogOpen(true);
    };

    const openEdit = (item: ContentItem) => {
        setEditingId(item.id);
        setForm({
            title: item.title,
            type: item.type,
            textContent: item.textContent || "",
            pdfFile: item.pdfFile || "",
            youtubeLink: item.youtubeLink || "",
            audioFile: item.audioFile || "",
            coverImage: item.coverImage || "",
            mediaFiles: item.mediaFiles ? JSON.parse(item.mediaFiles) : [],
            isFeatured: item.isFeatured === 1,
        });
        setPdfFileObj(null);
        setAudioFileObj(null);
        setCoverImageFileObj(null);
        setMediaFilesObj([]);
        setDialogOpen(true);
    };

    const handleSave = async () => {
        setSaving(true);
        setError("");
        setUploadProgress(0);

        try {
            const formData = new FormData();
            formData.append("poetId", selectedPoetId);
            formData.append("title", form.title);
            formData.append("type", form.type);
            formData.append("textContent", form.textContent);
            formData.append("youtubeLink", form.youtubeLink);
            formData.append("existingMediaFiles", JSON.stringify(form.mediaFiles || []));
            formData.append("isFeatured", form.isFeatured ? "1" : "0");

            mediaFilesObj.forEach(file => {
                formData.append("mediaFiles", file);
            });

            // Attach the actual PDF file if selected
            if (pdfFileObj) {
                formData.append("pdfFile", pdfFileObj);
            }

            // Attach the actual audio file if selected
            if (audioFileObj) {
                formData.append("audioFile", audioFileObj);
            }

            // Attach the actual cover image if selected
            if (coverImageFileObj) {
                formData.append("coverImage", coverImageFileObj);
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

            if (editingId) {
                await AdminService.updateContent(editingId, formData, config);
            } else {
                await AdminService.createContent(formData, config);
            }

            setDialogOpen(false);
            setPdfFileObj(null);
            setAudioFileObj(null);
            setCoverImageFileObj(null);
            setMediaFilesObj([]);
            setUploadProgress(0);
            fetchContent(selectedPoetId);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to save content.");
        } finally {
            setSaving(false);
        }
    };

    const handlePdfSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            setError("Please select a PDF file.");
            return;
        }

        setError("");
        setPdfFileObj(file);
    };

    const handleSherImagesSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newFiles = Array.from(files);
        setMediaFilesObj(prev => [...prev, ...newFiles]);
    };

    const handleDelete = async (id: number) => {
        try {
            await AdminService.deleteContent(id, token);
            setDeleteConfirm(null);
            fetchContent(selectedPoetId);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to delete content.");
        }
    };

    // Group content by type
    const grouped = CONTENT_TYPES.reduce((acc, type) => {
        acc[type] = content.filter((c) => c.type === type);
        return acc;
    }, {} as Record<string, ContentItem[]>);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
               
                {selectedPoetId && (
                    <>
                    <div>
                    <h2 className="text-2xl font-bold text-foreground">Edit Content</h2>
                    </div>
                    
                    <Button onClick={openCreate}>
                        <Plus className="h-4 w-4 mr-2" /> Add Content
                    </Button></>
                )}
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}



            {/* Content per type */}
            {loading ? (
                <div className="flex items-center justify-center h-32">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : selectedPoetId ? (
                content.length === 0 ? (
                    <Card>
                        <CardContent className="py-8 text-center text-muted-foreground">
                            No content found for this poet. Click "Add Content" to create some.
                        </CardContent>
                    </Card>
                ) : (
                    CONTENT_TYPES.map((type) =>
                        grouped[type].length > 0 ? (
                            <Card key={type}>
                                <CardContent className="p-0">
                                    <div className="px-4 py-3 border-b border-border bg-muted/50">
                                        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">{type}</h3>
                                    </div>
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-border">
                                                {/* <th className="px-4 py-2 text-left font-medium text-muted-foreground">ID</th> */}
                                                <th className="px-4 py-2 text-left font-medium text-muted-foreground">Title</th>
                                                {type === "EBOOK" && (
                                                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">PDF</th>
                                                )}
                                                <th className="px-4 py-2 text-right font-medium text-muted-foreground">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {grouped[type].map((item) => (
                                                <tr key={item.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                                                    {/* <td className="px-4 py-2 text-muted-foreground">{item.id}</td> */}
                                                    <td className="px-4 py-2 font-medium">
                                                        {item.title}
                                                        {item.isFeatured === 1 && (
                                                            <span className="ml-2 inline-flex items-center gap-0.5 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                                                                <Star className="h-4 w-4 text-amber-500" />Featured
                                                            </span>
                                                        )}
                                                    </td>
                                                    {type === "EBOOK" && (
                                                        <td className="px-4 py-2">
                                                            {item.pdfFile ? (
                                                                <a
                                                                    href={item.pdfFile}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center gap-1 text-xs text-green-600 hover:underline"
                                                                >
                                                                    <FileText className="h-3 w-3" /> Uploaded
                                                                </a>
                                                            ) : (
                                                                <span className="text-xs text-muted-foreground">No PDF</span>
                                                            )}
                                                        </td>
                                                    )}
                                                    <td className="px-4 py-2 text-right space-x-1">
                                                        <Button variant="ghost" size="sm" onClick={() => openEdit(item)}>
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => setDeleteConfirm(item.id)}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </CardContent>
                            </Card>
                        ) : null
                    )
                )
            ) : null}

            {/* Create/Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{editingId ? "Edit Content" : "Add New Content"}</DialogTitle>
                        <DialogDescription>
                            {editingId ? "Update the content details." : "Fill in the details for the new content."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title *</Label>
                            <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Type *</Label>
                            <Select value={form.type} onValueChange={(v) => {
                                setForm({ ...form, type: v, pdfFile: "", textContent: "", youtubeLink: "" });
                                setPdfFileObj(null);
                            }}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {CONTENT_TYPES.map((t) => (
                                        <SelectItem key={t} value={t}>{t}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                            <input
                                type="checkbox"
                                id="isFeatured"
                                checked={form.isFeatured as boolean}
                                onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <Label htmlFor="isFeatured" className="flex items-center gap-1.5 cursor-pointer font-bold">
                                Mark as Featured (Shows on Home Page)
                            </Label>
                        </div>

                        {/* Dynamic Fields based on Type */}
                        {(form.type === "GHAZAL" || form.type === "NAZM" || form.type === "SHER") && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="textContent">Text Content</Label>
                                    <textarea
                                        id="textContent"
                                        className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        value={form.textContent}
                                        onChange={(e) => setForm({ ...form, textContent: e.target.value })}
                                        placeholder="Enter poetry text..."
                                    />
                                </div>
                                {form.type === "SHER" && (
                                    <div className="space-y-2 border p-4 rounded-md bg-muted/20">
                                        <Label htmlFor="mediaFiles">Sher Images (Multiple)</Label>
                                        <Input
                                            id="mediaFiles"
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleSherImagesSelect}
                                            className="bg-white"
                                        />
                                        <p className="text-xs text-muted-foreground">Select multiple images to attach to this Sher. These will be uploaded as files and shown in a gallery.</p>

                                        {((form.mediaFiles && (form.mediaFiles as string[]).length > 0) || mediaFilesObj.length > 0) && (
                                            <div className="flex gap-2 flex-wrap mt-2">
                                                {/* Existing Images */}
                                                {(form.mediaFiles as string[]).map((src: string, i: number) => (
                                                    <div key={`existing-${i}`} className="relative group">
                                                        <img src={src} alt="Preview" className="h-16 w-16 object-cover rounded border" />
                                                        <button
                                                            type="button"
                                                            onClick={() => setForm((prev: any) => ({ ...prev, mediaFiles: prev.mediaFiles.filter((_: any, idx: number) => idx !== i) }))}
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                                {/* New Images */}
                                                {mediaFilesObj.map((file: File, i: number) => (
                                                    <div key={`new-${i}`} className="relative group">
                                                        <img src={URL.createObjectURL(file)} alt="Preview" className="h-16 w-16 object-cover rounded border" />
                                                        <button
                                                            type="button"
                                                            onClick={() => setMediaFilesObj(prev => prev.filter((_, idx) => idx !== i))}
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {form.type === "EBOOK" && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="pdfFileInput">Upload PDF *</Label>
                                    <Input
                                        id="pdfFileInput"
                                        type="file"
                                        accept=".pdf"
                                        onChange={handlePdfSelect}
                                    />
                                    {pdfFileObj && (
                                        <p className="text-xs text-green-600 flex items-center gap-1">
                                            <Upload className="h-3 w-3" />
                                            Selected: {pdfFileObj.name} ({(pdfFileObj.size / (1024 * 1024)).toFixed(2)} MB)
                                        </p>
                                    )}
                                    {!pdfFileObj && form.pdfFile && (
                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                            <FileText className="h-3 w-3" />
                                            Current PDF:
                                            <a href={form.pdfFile} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline truncate max-w-[200px] inline-block">
                                                {form.pdfFile.split("/").pop()}
                                            </a>
                                        </p>
                                    )}
                                    {saving && uploadProgress > 0 && (
                                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                                            <div
                                                className="bg-primary h-full transition-all duration-300 rounded-full"
                                                style={{ width: `${uploadProgress}%` }}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="coverImageInput">Upload Cover Image</Label>
                                    <Input
                                        id="coverImageInput"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            if (!file.type.startsWith("image/")) {
                                                setError("Please select an image file.");
                                                return;
                                            }
                                            setError("");
                                            setCoverImageFileObj(file);
                                        }}
                                    />
                                    {coverImageFileObj && (
                                        <p className="text-xs text-green-600 flex items-center gap-1">
                                            <Upload className="h-3 w-3" />
                                            Selected: {coverImageFileObj.name} ({(coverImageFileObj.size / (1024 * 1024)).toFixed(2)} MB)
                                        </p>
                                    )}
                                    {!coverImageFileObj && form.coverImage && (
                                        <div className="mt-2">
                                            <p className="text-xs text-muted-foreground mb-1">Current Cover:</p>
                                            <img
                                                src={form.coverImage}
                                                alt="Current cover"
                                                className="h-20 w-auto rounded border border-border"
                                            />
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {form.type === "AUDIO" && (
                            <div className="space-y-2">
                                <Label htmlFor="audioFileInput">Upload Audio *</Label>
                                <Input
                                    id="audioFileInput"
                                    type="file"
                                    accept="audio/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        if (!file.type.startsWith("audio/")) {
                                            setError("Please select an audio file.");
                                            return;
                                        }
                                        setError("");
                                        setAudioFileObj(file);
                                    }}
                                />
                                {audioFileObj && (
                                    <p className="text-xs text-green-600 flex items-center gap-1">
                                        <Upload className="h-3 w-3" />
                                        Selected: {audioFileObj.name} ({(audioFileObj.size / (1024 * 1024)).toFixed(2)} MB)
                                    </p>
                                )}
                                {!audioFileObj && form.audioFile && (
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <FileText className="h-3 w-3" />
                                        Current audio:
                                        <a href={form.audioFile} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline truncate max-w-[200px] inline-block">
                                            {form.audioFile.split("/").pop()}
                                        </a>
                                    </p>
                                )}
                                {saving && uploadProgress > 0 && (
                                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                                        <div
                                            className="bg-primary h-full transition-all duration-300 rounded-full"
                                            style={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {form.type === "VIDEO" && (
                            <div className="space-y-2">
                                <Label htmlFor="youtubeLink">YouTube / Video Link *</Label>
                                <Input
                                    id="youtubeLink"
                                    value={form.youtubeLink}
                                    onChange={(e) => setForm({ ...form, youtubeLink: e.target.value })}
                                    placeholder="https://youtube.com/..."
                                />
                            </div>
                        )}

                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave} disabled={saving || !form.title}>
                            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            {saving && uploadProgress > 0 ? `Uploading ${uploadProgress}%...` : editingId ? "Save Changes" : "Add Content"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <Dialog open={deleteConfirm !== null} onOpenChange={() => setDeleteConfirm(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Content?</DialogTitle>
                        <DialogDescription>
                            This will permanently delete this content item. This cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
                        <Button variant="destructive" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminContent;
