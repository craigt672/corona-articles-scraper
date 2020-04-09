import * as puppeteer from 'puppeteer';

import truncate from '../truncate';

import { IArticle } from '../types';

async function cbsScrapper(url: string): Promise<IArticle> {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();

  // Configure the navigation timeout
  await page.setDefaultNavigationTimeout(0);
  
  await page.goto(url);

  const title = await page.$eval('h1',  title => title.textContent);

  const paragraphs = await page.$$eval('.content__body > p', 
    p => p.map(p => p.innerHTML)
  );

  const sanitzedFirstBodyParagrah = paragraphs[0].replace(/<[^>]*>?/gm, '');
  const description = truncate(sanitzedFirstBodyParagrah, 40);

  await browser.close();

  return {
    author: null,
    title,
    url,
    description,
    bodyContent: paragraphs,
    publishedAt: null,
    urlToImage: null,
    source: null
  }
};

export default cbsScrapper;
