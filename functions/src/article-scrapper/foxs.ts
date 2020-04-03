import * as puppeteer from 'puppeteer';

import truncate from '../truncate';

async function foxScrapper(url: string) {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();

  await page.goto(url);

  const paragraphs = await page.$$eval('.article-body > p', 
    p => p.map(p => p.innerHTML).filter(p => !p.startsWith('<strong>')&&!p.startsWith('<a'))
  );

  const sanitzedFirstBodyParagrah = paragraphs[0].replace(/<[^>]*>?/gm, '');

  const description = truncate(sanitzedFirstBodyParagrah, 40);

  await browser.close();

  return {
    description,
    bodyContent: paragraphs
  }
};

export default foxScrapper;
