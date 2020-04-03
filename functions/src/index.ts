import * as functions from 'firebase-functions';
import { fox } from './article-scrapper';


export const helloWorld = functions.https.onRequest(async (request, response) => {
  const url = 'https://www.foxnews.com/media/coronavirus-questions-answered-loss-taste-smell-symptoms';
  const articleData: any = await fox(url);
  response.send(articleData);
});
