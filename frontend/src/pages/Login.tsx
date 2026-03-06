import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { login as loginApi } from "@/lib/api/auth";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, Eye, EyeOff } from "lucide-react";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const { login: authLogin } = useAuth();
    const { t } = useLanguage();

    // Where to redirect after successful login
    const from = (location.state as any)?.from || "/";

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await loginApi({ email, password });

            if (response.success) {
                const user = response.data.user;

                // Store in auth context
                authLogin(response.data.token, user);

                // Auto-detect admin: if user role is ADMIN, go to admin panel
                if (user.role === "ADMIN") {
                    navigate("/admin");
                } else {
                    navigate(from, { replace: true });
                }
            } else {
                setError(response.message || "Login failed");
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-background p-4">
            <Card className="w-full max-w-md border-border/40 shadow-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center text-primary">{t("welcomeBack")}</CardTitle>
                    <CardDescription className="text-center">
                        {t("enterCredentials")}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email">{t("email")}</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary focus:outline-none"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : t("signIn")}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center text-sm text-muted-foreground">
                    {t("dontHaveAccount")}{" "}
                    <Link to="/register" className="ml-1 font-medium text-primary hover:underline">
                        {t("signUp")}
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Login;
