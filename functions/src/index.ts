import * as functions from 'firebase-functions';

import articleScrapper, { foxScrapper } from './article-scrapper';

import { 
  loadABCArticles,
  loadCBSArticles,
  loadFOXArticles,
  loadNBCArticles,
  loadTCArticles,
  loadWiredArticles
} from './cron';

const runtimeOpts: any = {
  timeoutSeconds: 540,
  memory: "1GB"
}

const foxBaseUrl = 'https://www.foxnews.com';

export const foxArticles = functions.runWith(runtimeOpts).https.onRequest(async (request, response) => {
  const foxArticles = await articleScrapper(
    foxBaseUrl,
    'fox-news',
    foxScrapper
  );

  response.send(foxArticles);
});

// scheduled functions run every 5:30 EST
exports.getABCArticlesTask = functions.runWith({ 
  memory: '2GB' 
}).pubsub.schedule('30 5 * * *').timeZone('America/New_York').onRun(loadABCArticles);

exports.getNBCArticlesTask = functions.runWith({ 
  memory: '2GB' 
}).pubsub.schedule('30 5 * * *').timeZone('America/New_York').onRun(loadNBCArticles);

exports.getCBSArticlesTask = functions.runWith({ 
  memory: '2GB' 
}).pubsub.schedule('30 5 * * *').timeZone('America/New_York').onRun(loadCBSArticles);

exports.getFOXArticlesTask = functions.runWith({ 
  memory: '2GB' 
}).pubsub.schedule('30 5 * * *').timeZone('America/New_York').onRun(loadFOXArticles);

exports.getTCArticlesTask = functions.runWith({ 
  memory: '2GB' 
}).pubsub.schedule('30 5 * * *').timeZone('America/New_York').onRun(loadTCArticles);

exports.getWiredArticlesTask = functions.runWith({ 
  memory: '2GB' 
}).pubsub.schedule('30 5 * * *').timeZone('America/New_York').onRun(loadWiredArticles);
