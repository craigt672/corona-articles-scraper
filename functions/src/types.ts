export interface IArticle {
  url: string;
  author: string | null;
  title: string | null;
  description: string | null;
  bodyContent: string[];
  publishedAt: string | null;
  urlToImage: string | null;
  source: any;
}

export interface IArticleExtractor {
  (
    articleBaseUrl: string,
    articleData: any[],
    scrapper: (url: string) => Promise<IArticle>
  ): Promise<IArticle>[]
}