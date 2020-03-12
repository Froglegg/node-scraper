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

// for loops are blocking calls, so this function will run after the for loops is finished
function createCSV() {
  // console.log(pageArray);
  function sortNumber(a, b) {
    return a.id - b.id;
  }
  let arrangedArray = pageArray.sort(sortNumber);
  console.log(arrangedArray);
  // construct CSV from array of page objects
  const csvFromArrayOfObjects = convertArrayToCSV(arrangedArray);
  // write to file
  fs.writeFile("pages/test.csv", csvFromArrayOfObjects, "utf8", err => {
    console.log(err);
  });
}

// axios(url)
//   .then(response => {
//     let html = response.data;
//     var $ = cheerio.load(html); // xmlMode: true is a workaround for many cheerio bugs.
//     // let links = $("a");
//     // console.log(links[0].attribs.href);

//     let pageTitle = $('meta[property="og:title"]').attr("content");
//     let obj = $("script:not([src])");
//     let result;

//     Object.values(obj).forEach(el => {
//       try {
//         let test = JSON.stringify(el.children[0].data).match(/var dataLayer/);
//         if (test[0] == "var dataLayer") {
//           //   console.log(el.children[0].data);
//           page.dataLayer = el.children[0].data;
//           //   console.log(JSON.parse(page.dataLayer));
//           return (result = "dataExists");
//         }
//       } catch (err) {
//         // console.log("ERROR");
//       }
//     });

//     if (result === "dataExists") {
//       console.log(page);
//       pageArray.push(page);
//       console.log(pageArray);
//       const csvFromArrayOfObjects = convertArrayToCSV(pageArray);
//       console.log(csvFromArrayOfObjects);
//       // fs.writeFile("pages/" + page.title + ".md", JSON.stringify(page), err => {
//       //   console.log(err);
//       // });
//       fs.writeFile("pages/test.csv", csvFromArrayOfObjects, "utf8", err => {
//         console.log(err);
//       });
//     }
//   })
//   .catch(console.error);
