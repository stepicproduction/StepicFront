import React, { useState, useEffect } from "react";
// Pas besoin de User ici si on utilise l'image du logo
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";
import { Eye, EyeOff, X } from "lucide-react"; // Retiré Loader2 car on utilise l'image du logo
import { createData } from "@/service/api";
import { useAuth } from '@/service/AuthContext'
import { useLocation } from "react-router-dom";
import { getToken } from "@/service/api";

// Mise à jour du message d'erreur pour l'email
const schema = z.object({
  nom: z.string().min(2, "le nom est trop court."),
  pwd: z.string().min(4, "Le mot de passe est incorrect."),
});

function LoginPage() {
  const { loginSuccess } = useAuth(); //utilisation du hook auth
  const navigate = useNavigate();
  const location = useLocation(); // Pour récupérer l'état de redirection

  // Détermine où rediriger l'utilisateur après le login
  // Soit la page d'où il vient (state.from), soit le dashboard par défaut
  const from = location.state?.from?.pathname || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const [text, setText] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Nouvel état pour le chargement
  
  const goBack = () => navigate(-1); 

  const submit = async (data) => {
    setIsLoading(true)

    try {
      const response = await createData("token/", {
        username : data.nom,
        password : data.pwd,
      })

      const { access, refresh } = response.data

      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      console.log("access : ", access)

      const userData = await getToken('utilisateurs/user_connected/', {
        headers: { Authorization: `Bearer ${access}` },
      });
      
      console.log("user data : ", userData.data)

      const role = userData.data.role;
      const username = userData.data.user;
      const userImage = userData.data.image;
      const userEmail = userData.data.email;
      const userId = userData.data.id

      loginSuccess(role, username, userImage, userEmail, userId)

      toast.success("Connexion réussie !");

      navigate(from, { replace: true }); 

    } catch (err) {
      let errorMessage = "Identifiants incorrects.";

      if(err.response && err.response.status == 401) {
        errorMessage = "Nom d'utilisateur ou mot de passe incorrect."
      } else if (err.response) {
        console.error("Erreur API:", err.response.data)
        errorMessage = "Erreur de connexion : Veuillez réessayer."
      } else {
        console.error("Erreur réseau/inconnue:", err)
        errorMessage = "Erreur de serveur. Vérifiez que l'API est démarrée."
      }

      toast.error(errorMessage, { duration: 4000 });

    } finally {
      setIsLoading(false)
    }
  };

  // Si l'état de chargement est actif, nous affichons l'écran de chargement
  if (isLoading) {
       return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
                {/* Un petit spinner animé en CSS ou une simple phrase */}
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6c63ff]"></div>
                <p className="text-[#6c63ff] font-medium animate-pulse">Connexion en cours...</p>
            </div>
      );
  }  

  // Affiche le formulaire de connexion si pas en cours de chargement
  return (
    <div className="flex justify-center flex-col gap-8 items-center w-full h-screen">
      <Toaster position="top-right" reverseOrder={false} />

      <Card
        className="w-[90%] max-w-md relative 
        bg-gradient-to-br from-blue-700 via-blue-900 to-indigo-800  backdrop-filter backdrop-blur-lg border border-white/20 
        text-white shadow-[0_20px_40px_rgba(0,0,0,0.6)] rounded-2xl p-6" 
      >
        {/* Croix de retour (x) */}
        <button
          onClick={goBack}
          className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors duration-200 focus:outline-none"
          aria-label="Retour"
        >
          <X size={25} />
        </button>

        <CardHeader className="p-0 mb-6 flex flex-col items-center">
          {/* Logo Permanent - Utilisation de votre image de logo */}
          <div className="mb-4"> {/* Supprimé le padding et border car le logo est déjà stylé */}
            <img 
                src="/logo_stepic1.png" 
                alt="Logo Stepic" 
                className="w-20 h-20 drop-shadow-lg" 
            />
          </div>
          
          <CardTitle className="text-center text-4xl font-light drop-shadow-lg mb-2">
            CONNEXION
          </CardTitle>
          <p className="text-center text-[16px] opacity-90">
            Connectez-vous à votre compte
          </p>
        </CardHeader>

        <CardContent className="p-0">
          <form className="flex flex-col gap-6" onSubmit={handleSubmit(submit)}>
            {/* Champ email */}
            <div className="flex flex-col gap-2">
              <Label className="text-[15px] opacity-90">Nom :</Label>
              <input
                className={`h-[50px] rounded-lg px-4 bg-white/20 text-white placeholder-white/70
                focus:outline-none focus:ring-2 focus:ring-purple-300/50 transition duration-300
                shadow-inner ${errors.nom ? "border border-red-300 ring-1 ring-red-300 focus:bg-red-300/50" : ""} `}
                {...register("nom")}
                placeholder="admin"
              />
              {errors.nom && (
                <p className="text-red-300 font-medium text-sm mt-1">{errors.nom.message}</p>
              )}
            </div>

            {/* Champ mot de passe */}
            <div className="flex flex-col gap-2">
              <Label className="text-[15px] opacity-90">Mot de passe :</Label>
              <div className="relative">
                <input
                  type={text ? "text" : "password"}
                  className={`h-[50px] rounded-lg px-4 w-full bg-white/20 text-white placeholder-white/70
                  focus:outline-none focus:ring-2 focus:ring-purple-300/50 transition duration-300
                  shadow-inner ${errors.pwd ? "border border-red-300 ring-1 ring-red-300 focus:bg-red-300/50" : ""}  `}
                  {...register("pwd")}
                  placeholder="Mot de passe"
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 right-4 cursor-pointer text-white/70 hover:text-white"
                  onClick={() => setText(!text)}
                >
                  {text ? <Eye /> : <EyeOff />}
                </div>
              </div>
              {errors.pwd && (
                <p className="text-red-300 font-medium text-sm mt-1">{errors.pwd.message}</p>
              )}
            
            </div>

            {/* Bouton */}
            <Button
              type="submit"
              className="w-11/12 mx-auto h-[50px] rounded-full font-semibold text-white text-lg
              bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 
              shadow-[0_10px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_25px_rgba(0,0,0,0.5)] 
              transition-all duration-300 hover:scale-[1.02] mt-4"
              disabled={isLoading} 
            >
              Se Connecter
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginPage;