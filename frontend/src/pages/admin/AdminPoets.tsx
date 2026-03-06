import { useState, useEffect } from "react";
import { AdminService } from "@/lib/api/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";



interface Poet {
    id: number;
    realName: string;
    penName: string | null;
    dateOfBirth: string | null;
    placeOfBirth: string | null;
    profilePicture: string | null;
    bio: string | null;
}

const emptyForm = {
    realName: "",
    penName: "",
    dateOfBirth: "",
    placeOfBirth: "",
    bio: "",
    profilePicture: "",
};

const AdminPoets = () => {
    const [poets, setPoets] = useState<Poet[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

    const token = localStorage.getItem("token");

    const fetchPoets = async () => {
        try {
            const res = await AdminService.getPoets();
            setPoets(res.data);
        } catch {
            setError("Failed to load poets.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPoets();
    }, []);

    const openCreate = () => {
        setEditingId(null);
        setForm(emptyForm);
        setDialogOpen(true);
    };

    const openEdit = (poet: Poet) => {
        setEditingId(poet.id);
        setForm({
            realName: poet.realName,
            penName: poet.penName || "",
            dateOfBirth: poet.dateOfBirth ? poet.dateOfBirth.split("T")[0] : "",
            placeOfBirth: poet.placeOfBirth || "",
            bio: poet.bio || "",
            profilePicture: poet.profilePicture || "",
        });
        setDialogOpen(true);
    };

    const handleSave = async () => {
        setSaving(true);
        setError("");
        try {
            if (editingId) {
                await AdminService.updatePoet(editingId, form, token);
            } else {
                await AdminService.createPoet(form, token);
            }
            setDialogOpen(false);
            fetchPoets();
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to save poet.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await AdminService.deletePoet(id, token);
            setDeleteConfirm(null);
            fetchPoets();
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to delete poet.");
        }
    };

    const compressImage = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 800;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext("2d");
                    ctx?.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL("image/jpeg", 0.7)); // Compress to 70% quality
                };
                img.onerror = (error) => reject(error);
            };
            reader.onerror = (error) => reject(error);
        });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                // Determine if it looks like an image to compress
                if (file.type.startsWith("image/")) {
                    const compressedBase64 = await compressImage(file);
                    setForm({ ...form, profilePicture: compressedBase64 });
                } else {
                    // Fallback for non-images if any (though input accepts image/*)
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setForm({ ...form, profilePicture: reader.result as string });
                    };
                    reader.readAsDataURL(file);
                }
            } catch (err) {
                console.error("Error compressing image:", err);
                setError("Failed to process image.");
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 relative">
            {saving && (
                <div className="absolute inset-0 bg-background/50 z-50 flex items-center justify-center backdrop-blur-sm rounded-lg">
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        <span className="text-sm font-medium text-muted-foreground">Saving...</span>
                    </div>
                </div>
            )}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Poets</h2>
                    <p className="text-sm text-muted-foreground">Manage your poets collection</p>
                </div>
                <Button onClick={openCreate} disabled={saving}>
                    <Plus className="h-4 w-4 mr-2" /> Add Poet
                </Button>
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Poets table */}
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border bg-muted/50">
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">ID</th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Image</th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Real Name</th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Pen Name</th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date of Birth</th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Place of Birth</th>
                                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {poets.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                                            No poets found. Click "Add Poet" to create one.
                                        </td>
                                    </tr>
                                ) : (
                                    poets.map((poet) => (
                                        <tr key={poet.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                                            <td className="px-4 py-3 text-muted-foreground">{poet.id}</td>
                                            <td className="px-4 py-3">
                                                {poet.profilePicture ? (
                                                    <img
                                                        src={poet.profilePicture}
                                                        alt={poet.realName}
                                                        className="h-10 w-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-xs">
                                                        No Img
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 font-medium">{poet.realName}</td>
                                            <td className="px-4 py-3">{poet.penName || "—"}</td>
                                            <td className="px-4 py-3">{poet.dateOfBirth ? new Date(poet.dateOfBirth).toLocaleDateString() : "—"}</td>
                                            <td className="px-4 py-3">{poet.placeOfBirth || "—"}</td>
                                            <td className="px-4 py-3 text-right space-x-1">
                                                <Button variant="ghost" size="sm" onClick={() => openEdit(poet)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => setDeleteConfirm(poet.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Create/Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingId ? "Edit Poet" : "Create New Poet"}</DialogTitle>
                        <DialogDescription>
                            {editingId ? "Update the poet's details." : "Fill in the details for the new poet."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="flex justify-center">
                            {form.profilePicture ? (
                                <div className="relative">
                                    <img
                                        src={form.profilePicture}
                                        alt="Preview"
                                        className="h-24 w-24 rounded-full object-cover border border-border"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setForm({ ...form, profilePicture: "" })}
                                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </button>
                                </div>
                            ) : (
                                <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center text-muted-foreground border border-border border-dashed">
                                    No Image
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="profilePicture">Profile Picture</Label>
                            <Input
                                id="profilePicture"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="realName">Real Name *</Label>
                            <Input id="realName" value={form.realName} onChange={(e) => setForm({ ...form, realName: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="penName">Pen Name</Label>
                            <Input id="penName" value={form.penName} onChange={(e) => setForm({ ...form, penName: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                                <Input id="dateOfBirth" type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="placeOfBirth">Place of Birth</Label>
                                <Input id="placeOfBirth" value={form.placeOfBirth} onChange={(e) => setForm({ ...form, placeOfBirth: e.target.value })} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <textarea
                                id="bio"
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                value={form.bio}
                                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>Cancel</Button>
                        <Button onClick={handleSave} disabled={saving || !form.realName}>
                            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            {editingId ? "Save Changes" : "Create Poet"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteConfirm !== null} onOpenChange={() => setDeleteConfirm(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Poet?</DialogTitle>
                        <DialogDescription>
                            This will permanently delete this poet and all their content. This cannot be undone.
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

export default AdminPoets;
