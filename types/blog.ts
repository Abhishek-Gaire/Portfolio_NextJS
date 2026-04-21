export interface Tag {
  id: string;
  name: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  created_at: string;
  tags?: Array<Tag | string>;
  imageUrl?: string;
  publish: boolean;
  excerpt?: string;
  slug?: string;
  author?: string;
  updated_at?: string;
}
