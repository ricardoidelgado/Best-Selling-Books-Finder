const puppeteer = require('puppeteer');
const prompt = require('prompt-sync')();
const open = require('open');

class Book {
  constructor(rank, title, url, author, price, rating) {
    this.rank = rank;
    this.title = title;
    this.url = url;
    this.author = author;
    this.price = price;
    this.rating = rating;
  }
}

var books = [];

function scrapeList() {

  // START OF APP

  let runApp = true;

  console.log("Welcome to the Best Selling Books App!");

  let input = prompt("Would you like to begin? ");

  (async function scrape() {
  
    const browser = await puppeteer.launch({headless: true});     
    try {
      // scraping logic comes here...
      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4298.0 Safari/537.36');
  
      await page.goto('https://www.barnesandnoble.com/b/books/_/N-1fZ29Z8q8');
  
      await page.waitForSelector('ol');

      // Title of Book
      const titles = await page.$$eval("h3.product-info-title a", (nodes) => nodes.map((n) => 
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

      for (let i = 0; i < titles.length; i++) {
        let book = new Book(i+1, titles[i], urls[i], authors[i], prices[i], ratings[i]);
        books.push(book);
      }

      console.table(books,["rank", "title", "author", "price", "rating"]);

      while (runApp) {

        input = prompt("Please input a book number that you would like more information on or enter 'quit' to quit.");

        while (input.toLowerCase() !== "quit") {
          let selectedBook = books[parseInt(input) - 1];
          // console.table(selectedBook,["rank", "title", "author", "price", "rating"]);

          input = prompt("Would you like to open the Barnes & Noble page for this book?");

          if (input.toLowerCase() === "yes") {
            await open(selectedBook["url"]);
          }

          input = prompt("If there is another book you would like more info, please enter that number or enter 'quit' to quit.");
        }

        if (input === "quit") {
          runApp = false;
        }
      }
  
      } catch (e) {
      await browser.close();
      console.log("Error: ", e);
    }
  })();
}



scrapeList();