export type EvenementCategorie = 'agenda' | 'rendez-vous';

export interface Evenement {
  id: string;
  nom: string;
  date: string;
  dateDebut: string | null;
  dateFin: string | null;
  lieu: string;
  ville: string;
  description: string;
  categorie: EvenementCategorie;
}
