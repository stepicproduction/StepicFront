export function getRelativeTime(publishedDate) {
  const date = new Date(publishedDate);
  const now = new Date();

  // 1. Calculer la différence : du temps actuel (now) au temps passé (date)
  // La différence en millisecondes sera positive.
  const diffMs = now - date; 

  // 2. Calculer les unités de temps écoulé
  const seconds = diffMs / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;
  const weeks = days / 7;
  const months = days / 30.437; // Utiliser une moyenne plus précise pour les mois
  const years = days / 365.25;  // Utiliser une moyenne plus précise pour les années

  const rtf = new Intl.RelativeTimeFormat('fr', { numeric: 'auto' });

  // 3. Utiliser des valeurs NÉGATIVES pour indiquer le PASSÉ ("il y a")
  // On commence par la plus grande unité pour une meilleure précision
  if (years >= 1) {
    return rtf.format(Math.round(-years), 'year');
  } else if (months >= 1) {
    return rtf.format(Math.round(-months), 'month');
  } else if (weeks >= 1) {
    return rtf.format(Math.round(-weeks), 'week');
  } else if (days >= 1) {
    return rtf.format(Math.round(-days), 'day');
  } else if (hours >= 1) {
    return rtf.format(Math.round(-hours), 'hour');
  } else if (minutes >= 1) {
    // Pour "à l'instant", nous laissons le formatage par défaut pour 'minute' ou 'second'
    if (minutes < 1) { 
        return rtf.format(Math.round(-seconds), 'second');
    }
    return rtf.format(Math.round(-minutes), 'minute');
  } else {
    // Si moins d'une minute, on affiche en secondes
    return rtf.format(Math.round(-seconds), 'second'); 
  }
}