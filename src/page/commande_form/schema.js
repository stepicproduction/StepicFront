import { z } from 'zod';

// Schéma Étape 1 (inchangé)
export const Step1Schema = z.object({
  prenomClient: z.string().min(2, "Le prénom est requis et doit contenir au moins 2 caractères."),
  nomClient: z.string().min(2, "Le nom est requis et doit contenir au moins 2 caractères."),
});

// Schéma Étape 2 (inchangé)
export const Step2Schema = z.object({
  emailClient: z.string().email("L'adresse email n'est pas valide."),
  telephone: z.string().regex(/^[0-9]{10}$/, "Le téléphone doit contenir 10 chiffres (sans espaces ni tirets)."),
});

// NOUVEAU : Schéma pour l'étape 3 (Options de Commande)
export const Step3Schema = z.object({
    // L'ID de la catégorie est une chaîne non vide (l'ID reçu de l'API)
    categorie: z.string().min(1, "Veuillez choisir une catégorie."),

    // L'ID des services est un tableau de chaînes d'ID
    service: z.array(z.string()).min(1, "Veuillez sélectionner au moins un service pour continuer."),
});

export const dateSChema = z.object({
 dateCommande: z.preprocess((arg) => (arg === "" ? undefined : arg), z.string().optional()),
});
// Mise à jour du Schéma Global
export const GlobalSchema = Step1Schema.merge(Step2Schema).merge(Step3Schema).merge(dateSChema);