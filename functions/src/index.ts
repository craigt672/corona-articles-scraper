import * as functions from 'firebase-functions';

import articleScrapper from './article-scrapper';

const runtimeOpts: any = {
  timeoutSeconds: 540,
  memory: "1GB"
}

export const helloWorld = functions.runWith(runtimeOpts).https.onRequest(async (request, response) => {
  const processedArticles = await articleScrapper();
  
  response.send(processedArticles);
});
