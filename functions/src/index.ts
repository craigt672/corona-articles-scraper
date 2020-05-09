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

import db from './utils/db';

const runtimeOpts: any = {
  timeoutSeconds: 540,
  memory: "1GB"
}

function responseFormatter(endpointUrl: string, results: any): any {
  const structure: any = {};
  structure.object = endpointUrl.split('/').pop();
  structure.url = endpointUrl;
  structure.data = results;

  return structure;
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

export const articles = functions.runWith(runtimeOpts).https.onRequest(async (req, res) => {
  const articlesRef = db.collection('Articles');

  const results: any[] = [];

  try {
    const snapshot = await articlesRef.get();

    if (!snapshot.empty) {
      snapshot.forEach((doc) => {
        results.push({
          id: doc.id,
          ...doc.data()
        });
      });
    }
    const response = responseFormatter(req.originalUrl, results);

    return res.json(response);
  } catch(e) {
    console.error(e);
    return res.send(e);
  }
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
