import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import SplitLayout from "@/components/SplitLayout";
import SocialButtons from "@/components/SocialButtons";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const onSwitch = () => navigate("/register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await login({ identifier: email, password });
      navigate("/");
    } catch (err: any) {
      setError(err?.response?.data?.error?.message ?? "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SplitLayout
      title="Signaleo"
      subtitle="Signalement citoyen pour une ville plus propre"
      description="Signalez les problèmes urbains (déchets, voirie, eau, éclairage) et suivez leur résolution en temps réel."
      buttonText="Créer un compte"
      onButtonClick={onSwitch}
      isLogin={true}
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Connexion
        </h1>
        <p className="text-base text-gray-600 dark:text-gray-400">
          Accédez à votre espace citoyen
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 pl-10 pr-3 rounded-lg bg-gray-100 dark:bg-gray-800 border-0 focus:ring-2 focus:ring-[#10B981] focus:bg-white dark:focus:bg-gray-700 transition-all placeholder:text-gray-400 text-gray-900 dark:text-white"
                placeholder="vous@exemple.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 pl-10 pr-10 rounded-lg bg-gray-100 dark:bg-gray-800 border-0 focus:ring-2 focus:ring-[#10B981] focus:bg-white dark:focus:bg-gray-700 transition-all placeholder:text-gray-400 text-gray-900 dark:text-white"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                aria-label={
                  showPassword
                    ? "Masquer le mot de passe"
                    : "Afficher le mot de passe"
                }
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex items-center justify-between flex-wrap gap-2">
            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-gray-300"
              />
              Se souvenir de moi
            </label>
            <button
              type="button"
              className="text-sm text-[#3B82F6] hover:text-[#2563EB] transition"
              onClick={() => console.log("Mot de passe oublié")}
            >
              Mot de passe oublié ?
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 bg-[#10B981] hover:bg-[#059669] text-white font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          {isLoading ? "Connexion en cours..." : "Se connecter"}
        </button>

        <SocialButtons />
      </form>
    </SplitLayout>
  );
}
