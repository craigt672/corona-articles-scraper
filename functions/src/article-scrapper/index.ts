import * as NewsAPI from 'newsapi';

import foxScrapper from './foxs';
import nbcScrapper from './nbc';
import cbsScrapper from './cbs';
import abcScrapper from './abc';

import { IArticle } from '../types';

const NEWS_TOPIC = 'coronavirus';
const NEWS_API_KEY = '52339108ea7c4ba785ab195d44952c8e';

const newsapi = new NewsAPI(NEWS_API_KEY);

async function getArticles(): Promise<any[]> {
  const { articles } = await newsapi.v2.topHeadlines({
    sources: 'cbs-news,nbc-news,fox-news,abc-news',
    q: NEWS_TOPIC,
    language: 'en',
  });

  return articles;
}

// ,nbc-news,cbs-news,abc-news,fox-news

interface IArticleExtractor {
  (
    articleBaseUrl: string,
    articleData: any[],
    scrapper: (url: string) => Promise<IArticle>
  ): Promise<IArticle>[]
}

const articleExtractor: IArticleExtractor = (articleBaseUrl, articleData, scrapper) =>  {
  const filteredArticles = articleData.filter(article => {
    return article.url.startsWith(articleBaseUrl) && !article.url.includes('video');
  });

  const mappedArticles = filteredArticles.map(async (article: IArticle) => ({
    ...await scrapper(article.url),
    title: article.title,
    author: article.author,
    source: article.source,
    publishedAt: article.publishedAt,
    urlToImage: article.urlToImage
  }));

  return mappedArticles;
}

async function articleScrapper() {
  const startTime = new Date().getTime();

  const articleData = await getArticles();

  const foxBaseUrl = 'https://www.foxnews.com';
  const cbsBaseUrl = 'https://www.cbsnews.com';
  const abcBaseUrl = 'https://abcnews.go.com';
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

  const pCbsArticles = articleExtractor(
    cbsBaseUrl,
    articleData,
    cbsScrapper
  );

  const pAbsArticles = articleExtractor(
    abcBaseUrl,
    articleData,
    abcScrapper
  );

  const pArticles = [...pFoxArticles, ...pNbcArticles, ...pCbsArticles, ...pAbsArticles];
  const allArticles = await Promise.all(pArticles);

  const sortedArticles = allArticles.sort((a, b) => {
    if(a.publishedAt && b.publishedAt) {
     const tDiff = new Date(a.publishedAt).getDate() - new Date(b.publishedAt).getDate()  
     if (typeof tDiff === 'number') return tDiff;
    }
    return 0;
  })

  return {
    elapsed: `${(new Date().getTime() - startTime)/1000}s`,
    total: sortedArticles.length,
    articles: sortedArticles
  };
}

export default articleScrapper;
