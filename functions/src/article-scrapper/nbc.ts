import * as puppeteer from 'puppeteer';

import { IArticle } from '../types';

async function nbcScrapper(url: string): Promise<IArticle> {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();

  // Configure the navigation timeout
  await page.setDefaultNavigationTimeout(0);
  
  await page.goto(url);

  const author = await page.$eval('.founders-cond',  author => author.textContent);

  const title = await page.$eval('h1',  title => title.textContent);
  
  const description = await page.$eval('.articleDek',  description => description.textContent);

  const paragraphs = await page.$$eval('.article-body__content > p', 
    p => p.map(p => p.innerHTML)
  );

  await browser.close();

  return {
    author,
    title,
    url,
    description,
    bodyContent: paragraphs,
    publishedAt: null,
    urlToImage: null,
    source: null
  }
};

export default nbcScrapper;
