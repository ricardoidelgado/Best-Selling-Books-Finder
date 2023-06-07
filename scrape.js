const puppeteer = require('puppeteer');
// const prompt = require('prompt-sync')();
// const open = require('open');



function scrapeList() {
  (async function scrape() {
  
    const browser = await puppeteer.launch({headless: true});     
    try {
      // scraping logic comes here...
      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4298.0 Safari/537.36');
  
      await page.goto('https://www.barnesandnoble.com/b/books/_/N-1fZ29Z8q8');
  
      await page.waitForSelector('ol');

      // Name of Book
      const names = await page.$$eval("h3.product-info-title a", (nodes) => nodes.map((n) => 
      n.innerText)
      );

      // URL of Book
      const urls = await page.$$eval("h3.product-info-title a", (nodes) => nodes.map((n) => 
      n.href)
      );

      // Author of Book
      const authors = await page.$$eval("div.product-shelf-author", (nodes) => nodes.slice(0, 20).map((n) => 
      n.querySelector("a").innerText)
      );

      // Price of Book
      const prices = await page.$$eval("span.current a", (nodes) => nodes.map((n) => 
      n.innerText)
      );

      // Rating of Book
      const ratings = await page.$$eval("div.bv-off-screen", (nodes) => nodes.map((n) => 
      n.innerText)
      );
  
      await browser.close();
  
      } catch (e) {
      await browser.close();
      console.log("Error: ", e);
    }
  })();
}

scrapeList()

// function scrapeBook() {
//   (async function scrape() {
  
//     const browser = await puppeteer.launch({headless: false});     
//     try {
//       // scraping logic comes here...
//       const page = await browser.newPage();
//       await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4298.0 Safari/537.36');
  
//       await page.goto('https://www.barnesandnoble.com/w/fourth-wing-rebecca-yarros/1142297916?ean=9781649374042');
  
//       await page.waitForSelector('section');
  
//       // Gather rating
//       const name = await page.$$eval("div.bv_avgRating_component_container", (nodes) => nodes.map((n) => 
//       n.innerText)
//       );
    
//       await browser.close();
  
//       } catch (e) {
//       await browser.close();
//       console.log("Error: ", e);
//     }
//   })();
// }
