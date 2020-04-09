export interface IArticle {
  url: string;
  author: string | null;
  title: string | null;
  description: string | null;
  bodyContent: string[];
  publishedAt: string | null;
  urlToImage: string | null;
}
