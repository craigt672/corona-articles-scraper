import * as functions from 'firebase-functions';

import articleScrapper from './article-scrapper';

export const helloWorld = functions.https.onRequest(async (request, response) => {
  const processedFoxArticles = await articleScrapper()
  
  response.send(processedFoxArticles);
});
