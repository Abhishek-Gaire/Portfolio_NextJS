export type ProjectCategory = "All" | "Full Stack" | "Backend" | "Collaboration";

export interface Project {
  id: string;
  title: string;
  description: string;
  completionDate: string;
  image_url: string;
  technologies: string[];
  role: string;
  challenges: string;
  solutions: string;
  live_url?: string;
  github_url?: string;
  category: ProjectCategory | string;
}
