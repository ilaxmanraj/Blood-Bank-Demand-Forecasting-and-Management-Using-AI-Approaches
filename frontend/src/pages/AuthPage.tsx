import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { loginUser, registerUser } from "@/services/api";

const AuthPage = () => {

  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  /* ---------------- AUTO REDIRECT IF LOGGED IN ---------------- */

  useEffect(() => {

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      redirectByRole(role);
    }

  }, []);

  /* ---------------- ROLE REDIRECT ---------------- */

  const redirectByRole = (role: string) => {

    if (!role) {
      navigate("/", { replace: true });
      return;
    }

    switch (role) {

      case "ADMIN":
        navigate("/", { replace: true });
        break;

      case "DONOR":
        navigate("/donors/register", { replace: true });
        break;

      case "HOSPITAL":
        navigate("/requests/create", { replace: true });
        break;

      default:
        navigate("/", { replace: true });

    }

  };

  /* ---------------- LOGIN / REGISTER ---------------- */

  const handleEmailAuth = async (e: React.FormEvent) => {

    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {

      if (isLogin) {

        const res = await loginUser({ email, password });

        if (!res?.access_token) {
          throw new Error("Invalid login response");
        }

        /* SAVE AUTH DATA */

        localStorage.setItem("token", res.access_token);
        localStorage.setItem("role", res.role);
        localStorage.setItem("name", res.name);

        toast.success("Logged in successfully");

        redirectByRole(res.role);

      } else {

        await registerUser({
          name: fullName,
          email,
          phone,
          password
        });

        toast.success("Account created successfully");

        setIsLogin(true);

        setFullName("");
        setPhone("");
        setEmail("");
        setPassword("");

      }

    } catch (err: any) {

      toast.error(err?.message || "Authentication failed");

    } finally {

      setLoading(false);

    }

  };

  /* ---------------- UI ---------------- */

  return (

    <div className="min-h-screen flex items-center justify-center">

      <div className="w-full max-w-md space-y-6">

        <div className="text-center">

          <Heart className="mx-auto h-8 w-8 text-primary" />

          <h1 className="text-2xl font-bold">
            BloodBank AI
          </h1>

          <p className="text-sm text-muted-foreground">
            {isLogin ? "Sign in to your account" : "Create account"}
          </p>

        </div>

        <form onSubmit={handleEmailAuth} className="space-y-4">

          {!isLogin && (
            <>
              <div>
                <Label>Full Name</Label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label>Phone</Label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <Label>Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "Loading..." : isLogin ? "Sign In" : "Create Account"}
          </Button>

        </form>

        <p className="text-center text-sm">

          {isLogin ? "Don't have an account?" : "Already have an account?"}

          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary ml-2"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>

        </p>

      </div>

    </div>

  );

};

export default AuthPage;