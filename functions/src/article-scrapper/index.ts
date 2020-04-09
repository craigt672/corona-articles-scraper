import * as NewsAPI from 'newsapi';

import foxScrapper from './foxs';
import nbcScrapper from './nbc';

import { IArticle } from '../types';

const NEWS_TOPIC = 'coronavirus';
const NEWS_API_KEY = '52339108ea7c4ba785ab195d44952c8e';

const newsapi = new NewsAPI(NEWS_API_KEY);

async function getArticles(): Promise<any[]> {
  const { articles } = await newsapi.v2.topHeadlines({
    sources: 'fox-news,nbc-news',
    q: NEWS_TOPIC,
    language: 'en',
  });

  return articles;
}

// ,nbc-news,cbs-news,abc-news

interface IArticleExtractor {
  (
    articleBaseUrl: string,
    articleData: any[],
    scrapper: (url: string) => Promise<IArticle>
  ): Promise<IArticle>[]
}

const articleExtractor: IArticleExtractor = (articleBaseUrl, articleData, scrapper) =>  {
  const filteredArticles = articleData.filter(article => {
    return article.url.startsWith(articleBaseUrl);
  });

  const mappedArticles = filteredArticles.map(async (article: IArticle) => ({
    ...await scrapper(article.url),
    publishedAt: article.publishedAt,
    urlToImage: article.urlToImage
  }));

  return mappedArticles;
}

async function articleScrapper() {
  const articleData = await getArticles();

  const foxBaseUrl = 'https://www.foxnews.com';
  // const cbsBaseUrl = 'https://www.cbsnews.com';
  // const abcBaseUrl = 'https://abcnews.go.com';
  const nbcBaseUrl = 'https://www.nbcnews.com';

  const pFoxArticles = articleExtractor(
    foxBaseUrl,
    articleData,
    foxScrapper
  );

  const pNbcArticles = articleExtractor(
    nbcBaseUrl,
    articleData,
    nbcScrapper
  );

  const pArticles = [...pFoxArticles, ...pNbcArticles]
  const allArticles = await Promise.all(pArticles);

  const sortedArticles = allArticles.sort((a, b) => {
    if(a.publishedAt && b.publishedAt) {
     const tDiff = new Date(a.publishedAt).getDate() - new Date(b.publishedAt).getDate()  
     if (typeof tDiff === 'number') return tDiff;
    }
    return 0;
  })

  return {
    total: sortedArticles.length,
    articles: sortedArticles
  };
}

// export {
//   fox
// }

export default articleScrapper;
