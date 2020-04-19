import * as NewsAPI from 'newsapi';
import * as dayjs from 'dayjs';

import foxScrapper from './foxs';
import cbsScrapper from './cbs';
import nbcScrapper from './nbc';
import abcScrapper from './abc';
import wiredScrapper from './wired';
import techcrunchScrapper from './techcrunch';

import { IArticle, IArticleExtractor } from '../types';

const NEWS_TOPIC = 'coronavirus';
const NEWS_API_KEY = '52339108ea7c4ba785ab195d44952c8e';

const newsapi = new NewsAPI(NEWS_API_KEY);

const dateToday = dayjs().format('YYYY-MM-DD');

async function getArticlesFromSoure(source: string): Promise<any[]> {
  const { articles } = await newsapi.v2.everything({
    sources: source,
    q: NEWS_TOPIC,
    language: 'en',
    from: dateToday,
    sortBy: 'publishedAt',
  });

  const limitArtilces = articles.slice(0, 5);

  const allUrls = limitArtilces.map(a => a.url);
  console.log('All Article Urls: ', allUrls);
  return limitArtilces;
}

const articleExtractor: IArticleExtractor = (articleBaseUrl, articleData, scrapper) =>  {
  const filteredArticles = articleData.filter(article => {
    return article.url.startsWith(articleBaseUrl) && !article.url.includes('video');
  });

  if(filteredArticles.length === 0) {
    return [];
  }

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


async function articleScrapper(url= 'https://www.nbcnews.com', source, scrapper) {
  const startTime = new Date().getTime();

  const articleData = await getArticlesFromSoure(source);

  const pArticles = articleExtractor(
    url,
    articleData,
    scrapper
  );
  
  const allArticles = await Promise.all(pArticles);

  return {
    elapsed: `${(new Date().getTime() - startTime)/1000}s`,
    total: allArticles.length,
    articles: allArticles
  };
}

export {
  foxScrapper,
  cbsScrapper,
  nbcScrapper,
  abcScrapper,
  techcrunchScrapper,
  wiredScrapper
}

export default articleScrapper;
