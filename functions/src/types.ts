export interface IArticle {
  url: string;
  author: string | null;
  title: string | null;
  description: string;
  bodyContent: string[];
}
