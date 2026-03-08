import { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { BookOpen, Users, LogOut, Home, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
    { to: "/admin/profile", label: "Profile", icon: Users },
    { to: "/admin/content", label: "Content", icon: BookOpen },
    { to: "/admin/settings", label: "Site Settings", icon: Settings },
];

const AdminLayout = () => {
    const { logout } = useAuth();
    const [logoUrl, setLogoUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/settings`);
                const json = await res.json();
                if (json.success && json.data?.logo) {
                    setLogoUrl(json.data.logo);
                }
            } catch (err) {
                console.error("Failed to fetch settings for admin logo", err);
            }
        };
        fetchSettings();
    }, []);

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border bg-card flex flex-col shrink-0">

                <div className="flex items-center justify-center max-w-[90px] border-b mx-auto">
                    {logoUrl ? (
                        <img
                            src={logoUrl}
                            alt="Site Logo"
                            className="h-30 w-auto object-contain"
                        />
                    ) : (
                        <img
                            src=""
                            alt="Site Logo Default"
                            className="h-30 w-auto object-contain"
                        />
                    )}
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`
                            }
                        >
                            <Icon className="h-4 w-4" />
                            {label}
                        </NavLink>
                    ))}
                </nav>
                <div className="pl-4 border-t border-border">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `text-sm font-medium transition-colors hover:text-primary ${isActive ? "text-primary border-b-2 border-primary h-14 flex items-center" : "text-muted-foreground h-14 flex items-center"}`
                        }
                    >
                        <Home className="h-4 w-4 mr-2" />
                        Back to site
                    </NavLink>
                </div>
            </aside>

            {/* Main content area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Top Navigation Header */}
                <header className="h-14 border-b border-border bg-card flex items-center justify-between px-8 shrink-0">
                    <div className="flex items-center gap-6">
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 text-sm font-medium text-destructive hover:text-destructive/80 transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </button>
                </header>

                {/* Main content */}
                <main className="flex-1 p-8 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;