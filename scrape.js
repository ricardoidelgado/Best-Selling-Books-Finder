const puppeteer = require("puppeteer");
const prompt = require("prompt-sync")();
const open = require("open");

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

  console.log("Welcome to the Best-Selling Books Finder!");

  let input = prompt(
    "Which best-selling book list would you like to see today? Please enter: 'All', 'Teens&YA', 'Kids', 'Fiction', or 'NonFiction': "
  );

  let selectedURL = "";
  let label = "";

  if (input.toLowerCase() === "all") {
    selectedURL = "https://www.barnesandnoble.com/b/books/_/N-1fZ29Z8q8";
    label = " ";
  } else if (input.toLowerCase() === "teens&ya") {
    selectedURL =
      "https://www.barnesandnoble.com/b/books/teens-ya/_/N-1fZ29Z8q8Z19r4";
    label = " Teens&YA ";
  } else if (input.toLowerCase() === "kids") {
    selectedURL =
      "https://www.barnesandnoble.com/b/books/kids/_/N-1fZ29Z8q8Ztu1";
    label = " Kids ";
  } else if (input.toLowerCase() === "fiction") {
    selectedURL =
      "https://www.barnesandnoble.com/b/fiction/books/_/N-1fZ2usxZ29Z8q8";
    label = " Fiction ";
  } else if (input.toLowerCase() === "nonfiction") {
    selectedURL =
      "https://www.barnesandnoble.com/b/nonfiction/books/_/N-1fZ2urcZ29Z8q8";
    label = " NonFiction ";
  }

  (async function scrape() {
    const browser = await puppeteer.launch({ headless: true });
    try {
      // scraping logic comes here...
      const page = await browser.newPage();
      await page.setUserAgent(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4298.0 Safari/537.36"
      );

      await page.goto(selectedURL);

      await page.waitForSelector("ol");

      // Title of Book
      const titles = await page.$$eval("h3.product-info-title a", (nodes) =>
        nodes.map((n) => n.innerText)
      );

      // URL of Book
      const urls = await page.$$eval("h3.product-info-title a", (nodes) =>
        nodes.map((n) => n.href)
      );

      // Author of Book
      const authors = await page.$$eval("div.product-shelf-author", (nodes) =>
        nodes.slice(0, 20).map((n) => n.querySelector("a").innerText)
      );

      // Price of Book
      const prices = await page.$$eval("span.current a", (nodes) =>
        nodes.map((n) => n.innerText)
      );

      // Rating of Book
      const ratings = await page.$$eval("div.bv-off-screen", (nodes) =>
        nodes.map((n) => n.innerText)
      );

      await browser.close();

      for (let i = 0; i < titles.length; i++) {
        let book = new Book(
          i + 1,
          titles[i],
          urls[i],
          authors[i],
          prices[i],
          ratings[i]
        );
        books.push(book);
      }

      // Using the rank as the table id instead of the default id
      const transformed = books.reduce((acc, { rank, ...x }) => {
        acc[rank] = x;
        return acc;
      }, {});

      console.log(`Here are the top 20 Best-Selling${label}Books: `);
      console.table(transformed, ["title", "author", "price", "rating"]);

      while (runApp) {
        input = prompt(
          "Please input a book number that you would like more information on or enter 'quit' to quit. "
        );

        while (input.toLowerCase() !== "quit") {
          let selectedBook = transformed[parseInt(input)];

          console.table([selectedBook], ["title", "author", "price", "rating"]);

          // Scraping Logic for individual page
          await (async function scrape() {
            const browser = await puppeteer.launch({ headless: true });
            try {
              // scraping logic comes here...
              const page = await browser.newPage();
              await page.setUserAgent(
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4298.0 Safari/537.36"
              );

              await page.goto(selectedBook["url"]);

              await page.waitForSelector("ol");

              // custReviewAuthor of Book
              const custReviewAuthor = await page.$$eval(
                "div.bv-author-avatar div.bv-content-author-name button.bv-author h3",
                (nodes) => nodes.map((n) => n.innerText)
              );

              // custReviewRating of Book
              const custReviewRating = await page.$$eval(
                "span.bv-rating-stars-container span.bv-off-screen",
                (nodes) => nodes.map((n) => n.innerText)
              );

              // custReviewTitle of Book
              const custReviewTitle = await page.$$eval(
                "div.bv-content-title-container h3.bv-content-title",
                (nodes) => nodes.map((n) => n.innerText)
              );

              // custReviewText of Book
              const custReviewText = await page.$$eval(
                "div.bv-content-summary-body-text p",
                (nodes) => nodes.map((n) => n.innerText)
              );

              await browser.close();

              if (custReviewAuthor.length === 0) {
                console.log(
                  "There appears to be no reviews for this book yet."
                );
              }

              for (let i = 0; i < custReviewAuthor.length; i++) {
                console.log(`Name: ${custReviewAuthor[i]}`);
                console.log(`Rating: ${custReviewRating[i]}`);
                console.log(`Review Title: ${custReviewTitle[i]}`);
                console.log(`Review: ${custReviewText[i]}`);
                console.log("--------------------------------");
              }
            } catch (e) {
              await browser.close();
              console.log("Error: ", e);
            }
          })();
          // End of Individual Scraping

          input = prompt(
            "Would you like to open the Barnes & Noble page for this book? Please enter: 'Yes' or 'No': "
          );

          if (input.toLowerCase() === "yes") {
            await open(selectedBook["url"]);
          }

          input = prompt(
            "If there is another book you would like more info, please enter that number or enter 'quit' to quit. "
          );
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
