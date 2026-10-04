export type SiteCategory = 'chateau' | 'grotte' | 'troglodyte' | 'nature';

export interface Site {
  id: string;
  name: string;
  category: SiteCategory;
  title: string;
  description: string[];
  url: string;
  images: string[];
}

export const CATEGORY_LABELS: Record<SiteCategory, string> = {
  chateau: 'Châteaux',
  grotte: 'Grottes & gouffres',
  troglodyte: 'Sites troglodytiques',
  nature: 'Nature & loisirs',
};
