# Best-Selling Books Finder

A terminal application for looking up the best-selling books on Barnes & Noble using Puppeteer with Node.js.

## Background

I wanted to find a way to scrape the best-selling books and see the relevant information on these books with the ability to go to their webpage to buy the book.

Initially, I created a Ruby script using the Nokogiri gem for this process. While it was able to scrape some information (URL, Title, Author, and Price), I encountered issues trying to scrape the rating of the book and the reviews from an individual books page.

This caused me to recreate this app using Puppeteer for JavaScript where I was able to successfully scrape more information on each book. 

## Installation

Ensure you have Node.js and Ruby installed. You can find official installation documents here:

Node.js - https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
<br>
Ruby - https://www.ruby-lang.org/en/documentation/installation/

The three libraries used are Puppeteer, Prompt-sync and Open.

```bash
npm install puppeteer
npm install prompt-sync
npm install open@8.4.2
```

If interested in the Ruby version, the gems used are Nokogiri, HTTParty, TTY-Table, Launchy, and TTY-Prompt.

```bash
gem install nokogiri
gem install httparty
gem install tty-table
gem install launchy
gem install tty-prompt
```
## Contact

For any suggestions or improvements for either the Ruby of JavaScript version of this app, please feel free to contact me.

Ricardo Delgado - rickydel19@gmail.com

[LinkedIn](https://www.linkedin.com/in/ricardodelgado1/)
