const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const { convertArrayToCSV } = require("convert-array-to-csv");
let firstTierLinks = require("./links/firstTierLinks.json");

const pageArray = [];

// hacky function to fire CSV build function after for loops complete
var operationsCompleted = 0;
function operation() {
  ++operationsCompleted;
  if (operationsCompleted >= firstTierLinks.length - 1) createCSV();
}

// for each link you want to scrape
firstTierLinks.forEach((link, idx) => {
  axios(link)
    .then(response => {
      let html = response.data;
      // load into cheerio
      let $ = cheerio.load(html);
      // select page title and construct page object, add page title to title property on page object
      let pageTitle = $('meta[property="og:title"]').attr("content");
      let page = { id: `${idx}`, title: pageTitle, link: link };
      // construct object that selects all script tags
      let obj = $("script:not([src])");

      // create array of scripts values
      Object.values(obj).forEach(el => {
        // try to match all scripts that have bodies with a dataLayer variable
        try {
          let test = JSON.stringify(el.children[0].data).match(
            /dataLayer.push/
          );

          // if data layer exists on page, add it to the dataLayer property of page object, else write "no dataLayer found"

          if (test.input.includes("line_of_business")) {
            page.dataLayer = test.input;
          } else {
            page.dataLayer = "no dataLayer found";
          }
        } catch (err) {}
      });
      pageArray.push(page);
      operation();
    })
    .catch(err => console.log(err));
});

function createCSV() {
  function sortNumber(a, b) {
    return a.id - b.id;
  }
  let arrangedArray = pageArray.sort(sortNumber);
  // construct CSV from array of page objects
  const csvFromArrayOfObjects = convertArrayToCSV(arrangedArray);
  // write to file
  fs.writeFile("pages/test.csv", csvFromArrayOfObjects, "utf8", err => {
    console.log(err);
  });
}
