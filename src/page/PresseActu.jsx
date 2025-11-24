import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; 
import { Calendar } from 'lucide-react'; 
import { getData } from '@/service/api';

// --- 2. COMPOSANT CARTE (Image à gauche, Texte à droite) ---
const ArticleCard = ({ item }) => (
  <div className="w-full items-center bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-sm hover:shadow-md transition-shadow duration-300 mb-6">
    {/* Image : Prend 100% sur mobile, et une taille fixe (ex: 300px) sur Desktop */}
    <div className="w-full md:w-80 h-64 md:h-64 flex-shrink-0 relative">
      <img
        src={item.image || item.imageActu}
        alt={item.titre || item.titreActu}
        className="w-full h-full object-cover rounded-2xl"
      />
    </div>


    {/* Contenu Texte */}
    <div className="p-6 flex flex-col justify-center items-start flex-1">
      {/* Date */}
      <div className="flex items-center text-indigo-600 text-sm font-semibold mb-3 bg-indigo-50 px-3 py-1 rounded-full">
        {/* Si tu n'as pas l'icône Calendar, retire cette ligne */}
        <Calendar className="w-4 h-4 mr-2" /> 
        {item.datePub || item.date_pub}
      </div>

      {/* Titre */}
      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        {item.titre || item.titreActu}
      </h3>

      {/* Description */}
      <p className="text-gray-600 text-base leading-relaxed mb-4">
        {item.contenu || item.contenuActu}
      </p>

      {/* Bouton lire plus (Optionnel)
      <button className="text-indigo-600 font-semibold hover:underline mt-auto">
        Lire la suite &rarr;
      </button> */}
    </div>
  </div>
);

// --- 3. TON COMPOSANT PRINCIPAL ---
const PresseActu = () => {

  const [actu, setActu] = useState([])
  const [presse, setPresse] = useState([])

  const fetchActu = async () => {
    try {
      const response = await getData("actualites/")
      console.log(response.data)
      setActu(response.data)
    } catch (err) {
      console.log("Erreur lors de la récupération de l'actualité concernant l'entreprise : ", err)
    }
  }

  const fetchPresse = async () => {
    try {
      const response = await getData("presses/")
      console.log(response.data)
      setPresse(response.data)
    } catch (err) {
      console.log("Erreur lors de la récupération de la presse de l'entreprise : ", err)
    }
  }

  useEffect(() => {
    Promise.all([
      fetchActu(),
      fetchPresse(),      
    ])
  }, [])

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start bg-white text-black py-10 px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 max-w-7xl mx-auto pt-15">
      <Tabs defaultValue="entreprise" className="w-full">
        
        {/* Liste des onglets */}
        <TabsList className="w-full sm:w-auto flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 bg-transparent mb-12 mt-10 mx-auto">
          <TabsTrigger
            value="entreprise"
            className="text-base sm:text-lg font-semibold text-black px-6 py-3 rounded-xl transition-all border border-gray-100
              data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-400 
              data-[state=active]:via-indigo-600 data-[state=active]:to-purple-600 
              data-[state=active]:text-white shadow-md"
          >
            Entreprise
          </TabsTrigger>

          <TabsTrigger
            value="info"
            className="text-base sm:text-lg font-semibold text-black px-6 py-3 rounded-xl transition-all border border-gray-100
              data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-400 
              data-[state=active]:via-indigo-600 data-[state=active]:to-purple-600 
              data-[state=active]:text-white shadow-md"
          >
            Infos & Presse
          </TabsTrigger>
        </TabsList>

        {/* --- Contenu Entreprise --- */}
        <TabsContent value="entreprise" className="w-full flex flex-col gap-6 animate-in fade-in zoom-in duration-300">
          {actu.map((item) => (
            <ArticleCard key={item.id} item={item} />
          ))}
          
          {/* Message si vide (au cas où) */}
          {actu.length === 0 && (
            <p className="text-center text-gray-500">Aucune actualité entreprise.</p>
          )}
        </TabsContent>

        {/* --- Contenu Infos --- */}
        <TabsContent value="info" className="w-full flex flex-col gap-6 animate-in fade-in zoom-in duration-300">
          {presse.map((item) => (
            <ArticleCard key={item.id} item={item} />
          ))}

          {presse.length === 0 && (
            <p className="text-center text-gray-500">Aucune info presse.</p>
          )}
        </TabsContent>

      </Tabs>
    </div>
  );
}

export default PresseActu;