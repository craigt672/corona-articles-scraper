import db from '../utils/db';

import articleScrapper, {
  foxScrapper,
  nbcScrapper,
  abcScrapper,
  cbsScrapper,
  techcrunchScrapper,
  wiredScrapper
} from '../article-scrapper';

const articlesRef = db.collection('Articles');

const foxBaseUrl = 'https://www.foxnews.com';
const abcBaseUrl = 'https://abcnews.go.com';
const cbsBaseUrl = 'https://www.cbsnews.com';
const nbcBaseUrl = 'https://www.nbcnews.com';
const wiredBaseUrl = 'https://www.wired.com';
const techCrunchBaseUrl = 'http://techcrunch.com';

export const loadFOXArticles = async (context: any) => {
  const batch = db.batch();

  const { articles } = await articleScrapper(
    foxBaseUrl,
    'fox-news',
    foxScrapper
  );

  articles.forEach(article => {
    const {
      author,
      urlToImage,
      source,
      publishedAt 
    } = article;

    
    if(author && urlToImage) {
      const id = `${source.id}-${publishedAt}`;
      const articleDocRef = articlesRef.doc(id);

      batch.set(articleDocRef, article);
    }
  })

  const results = await batch.commit();
  console.log(`Fox Articles batch complete with ${results.length} total results.`);

  return results;
};


export const loadCBSArticles = async (context: any) => {
  const batch = db.batch();

  const { articles } = await articleScrapper(
    cbsBaseUrl,
    'cbs-news',
    cbsScrapper
  );

  articles.forEach(article => {
    const {
      author,
      urlToImage,
      source,
      publishedAt 
    } = article;

    
    if(author && urlToImage) {
      const id = `${source.id}-${publishedAt}`;
      const articleDocRef = articlesRef.doc(id);

      batch.set(articleDocRef, article);
    }
  })

  const results = await batch.commit();
  console.log(`CBS Articles batch complete with ${results.length} total results.`);

  return results;
};

export const loadNBCArticles = async (context: any) => {
  const batch = db.batch();

  const { articles } = await articleScrapper(
    nbcBaseUrl,
    'nbc-news',
    nbcScrapper
  );

  articles.forEach(article => {
    const {
      author,
      urlToImage,
      source,
      publishedAt 
    } = article;

    
    if(author && urlToImage) {
      const id = `${source.id}-${publishedAt}`;
      const articleDocRef = articlesRef.doc(id);

      batch.set(articleDocRef, article);
    }
  })

  const results = await batch.commit();
  console.log(`NBC Articles batch complete with ${results.length} total results.`);

  return results;
};

export const loadABCArticles = async (context: any) => {
  const batch = db.batch();

  const { articles } = await articleScrapper(
    abcBaseUrl,
    'abc-news',
    abcScrapper
  );

  articles.forEach(article => {
    const {
      author,
      urlToImage,
      source,
      publishedAt 
    } = article;

    
    if(author && urlToImage) {
      const id = `${source.id}-${publishedAt}`;
      const articleDocRef = articlesRef.doc(id);

      batch.set(articleDocRef, article);
    }
  })

  const results = await batch.commit();
  console.log(`ABC Articles batch complete with ${results.length} total results.`);

  return results;
};

export const loadTCArticles = async (context: any) => {
  const batch = db.batch();

  const { articles } = await articleScrapper(
    techCrunchBaseUrl,
    'techcrunch',
    techcrunchScrapper
  );

  articles.forEach(article => {
    const {
      author,
      urlToImage,
      source,
      publishedAt 
    } = article;

    
    if(author && urlToImage) {
      const id = `${source.id}-${publishedAt}`;
      const articleDocRef = articlesRef.doc(id);

      batch.set(articleDocRef, article);
    }
  })

  const results = await batch.commit();
  console.log(`TechCrunch Articles batch complete with ${results.length} total results.`);

  return results;
};

export const loadWiredArticles = async (context: any) => {
  const batch = db.batch();

  const { articles } = await articleScrapper(
    wiredBaseUrl,
    'wired',
    wiredScrapper
  );

  articles.forEach(article => {
    const {
      author,
      urlToImage,
      source,
      publishedAt 
    } = article;

    
    if(author && urlToImage) {
      const id = `${source.id}-${publishedAt}`;
      const articleDocRef = articlesRef.doc(id);

      batch.set(articleDocRef, article);
    }
  })

  const results = await batch.commit();
  console.log(`Wired Articles batch complete with ${results.length} total results.`);

  return results;
};
