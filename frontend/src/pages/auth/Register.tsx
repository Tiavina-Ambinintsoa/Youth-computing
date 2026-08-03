import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import SplitLayout from "@/components/SplitLayout";
import SocialButtons from "@/components/SocialButtons";
import { useAuth } from "@/contexts/AuthContext";

export default function SignUp() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const onSwitch = () => navigate("/login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await register({ username: name, email, password });
      navigate("/");
    } catch (err: any) {
      setError(err?.response?.data?.error?.message ?? "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SplitLayout
      title="Rejoignez Signaleo"
      subtitle="Ensemble, améliorons notre ville"
      description="Créez votre compte citoyen pour signaler des incidents, suivre leur traitement et contribuer à une ville plus durable."
      buttonText="Se connecter"
      onButtonClick={onSwitch}
      isLogin={false}
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Inscription
        </h1>
        <p className="text-base text-gray-600 dark:text-gray-400">
          Rejoignez les citoyens actifs de Fianarantsoa
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nom
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 pl-10 pr-3 rounded-lg bg-gray-100 dark:bg-gray-800 border-0 focus:ring-2 focus:ring-[#10B981] focus:bg-white dark:focus:bg-gray-700 transition-all placeholder:text-gray-400 text-gray-900 dark:text-white"
                placeholder="Votre nom"
                required
              />
            </div>
          </div>

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
                placeholder="vous@exemple.mg"
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
                placeholder="Créer un mot de passe sécurisé"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 bg-[#10B981] hover:bg-[#059669] text-white font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          {isLoading ? "Création du compte..." : "S'inscrire"}
        </button>

        <SocialButtons />
      </form>
    </SplitLayout>
  );
}
