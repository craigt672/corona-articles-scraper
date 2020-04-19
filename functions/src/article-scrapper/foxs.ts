import * as puppeteer from 'puppeteer';

import truncate from '../truncate';

import { IArticle } from '../types';

async function foxScrapper(url: string): Promise<IArticle> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Configure the navigation timeout
  await page.setDefaultNavigationTimeout(0);
  
  await page.goto(url);

  const paragraphs = await page.$$eval('.article-body > p', 
    p => p.map(p => p.innerHTML).filter(p => !p.startsWith('<strong>')&&!p.startsWith('<a'))
  );

  const sanitzedFirstBodyParagrah = paragraphs[0].replace(/<[^>]*>?/gm, '');
  const description = truncate(sanitzedFirstBodyParagrah, 40);

  await browser.close();

  return {
    author: null,
    title: null,
    url,
    description,
    bodyContent: paragraphs,
    publishedAt: null,
    urlToImage: null,
    source: null
  }
};

export default foxScrapper;
