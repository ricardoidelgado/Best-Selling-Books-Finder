const puppeteer = require('puppeteer');
const fs = require("fs");
// const prompt = require('prompt-sync')();
// const open = require('open');

let retry = 0;
let maxRetries = 5;

let pokedex = {};

(async function scrape() {
  // retry++;

  const browser = await puppeteer.launch({headless: false});     
  try {
    // scraping logic comes here...
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4298.0 Safari/537.36');

    await page.goto('https://www.barnesandnoble.com/w/fourth-wing-rebecca-yarros/1142297916?ean=9781649374042');

    await page.waitForSelector('section');

    // Gather rating
    const name = await page.$$eval("div.bv_avgRating_component_container", (nodes) => nodes.map((n) => 
    n.innerText)
    );


    // const nameObject = name.map((value, index) => {
    //   if (name[index]) {
    //     return name[index]
    //   } else {
    //     return "IDK";
    //   }
    // })

    // let names = {};
    // let index = 1
    // for (const property in nameObject) {
    //   if (nameObject[property] !== "IDK") {
    //     names[index] = nameObject[property].substring(0,nameObject[property].length - 1);
    //     index++;
    //   }
    // }
    console.log(name);

    //READ THIS: I successfully get the id and name. Thoughts on how to continue...
    // If I want to keep using web scraping, one thought would be to have this information stored, prompt the user to enter the Id of a pokemon go to their respective page, and try to scrape out some more information...

    // let pokemonId = prompt("Please select a the id of a pokemon: ");
    // pokemonId = parseInt(pokemonId);
    // let chosenPokemon = names[pokemonId].toLowerCase();

    // const chosenPokemonURL = `https://www.serebii.net/pokedex-sv/${chosenPokemon}/`

    // open(chosenPokemonURL);

    // const page2 = await browser.newPage();

    // await page2.goto(chosenPokemonURL);

    // await page2.waitForSelector('.center');


    // The goal now is to attempt to make a terminal Pokedex
    // const data = await page2.$$eval("td.cen a", (nodes) => nodes.map((n) => n.innerText)
    // );

    // console.log(data);

    // The below code is to save the information into a JSON file.

    // const jsonData = JSON.stringify(names, null, 2);
    // fs.writeFileSync("pokemon.json", jsonData);

    await browser.close();

    } catch (e) {
    await browser.close();
    console.log("Error: ", e);
    // if (retry < maxRetries) {
    //   scrape();
    // }
  }
})();


