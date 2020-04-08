import * as functions from 'firebase-functions';
import * as NewsAPI from 'newsapi';

// import { fox } from './article-scrapper';

const NEWS_TOPIC = 'coronavirus';
const NEWS_API_KEY = '52339108ea7c4ba785ab195d44952c8e';

const newsapi = new NewsAPI(NEWS_API_KEY);

async function getArticles(): Promise<any[]> {
  const { articles } =  await newsapi.v2.topHeadlines({
    sources: 'fox-news,nbc-news,cbs-news,abc-news',
    q: NEWS_TOPIC,
    language: 'en',
  });

  return articles;
}

export const helloWorld = functions.https.onRequest(async (request, response) => {
  const articleData = await getArticles();

  // const filteredFoxArticles = articleData.filter(article => {
  //   return !article.url.startsWith('https://video');
  // });

  // const promisedFoxArticles = filteredFoxArticles.map(article => fox(article.url));
  // const processedFoxArticles = await Promise.all(promisedFoxArticles);

  response.send(articleData);
});
