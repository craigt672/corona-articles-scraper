import * as puppeteer from 'puppeteer';

import truncate from '../truncate';

import { IArticle } from '../types';

async function foxScrapper(url: string): Promise<IArticle> {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();

  await page.goto(url);

  const title = await page.$eval('h1',  title => title.textContent);

  const paragraphs = await page.$$eval('.article-body > p', 
    p => p.map(p => p.innerHTML).filter(p => !p.startsWith('<strong>')&&!p.startsWith('<a'))
  );

  const sanitzedFirstBodyParagrah = paragraphs[0].replace(/<[^>]*>?/gm, '');
  const description = truncate(sanitzedFirstBodyParagrah, 40);

  await browser.close();

  return {
    title,
    description,
    bodyContent: paragraphs
  }
};

export default foxScrapper;
