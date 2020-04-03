import * as puppeteer from 'puppeteer';

async function foxScrapper(url: string) {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();

  await page.goto(url);

  const paragraphs = await page.$$eval('.article-body > p', 
    p => p.map(p => p.innerHTML).filter(p => !p.startsWith('<strong>')&&!p.startsWith('<a'))
  );

  await browser.close();

  return {
    bodyContent: paragraphs
  }
  ;
};

export default foxScrapper;
