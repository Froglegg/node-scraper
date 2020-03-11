const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
var jQuery = require("jquery");

const url = "http://www-staging.assurant.com";

var pageArray = [];

axios(url)
  .then(response => {
    let html = response.data;
    var $ = cheerio.load(html, { xmlMode: true }); // xmlMode: true is a workaround for many cheerio bugs.
    let pageTitle = $('meta[property="og:title"]').attr("content");
    let page = { title: pageTitle };
    let obj = $("script:not([src])");
    let result;

    Object.values(obj).forEach(el => {
      try {
        let test = JSON.stringify(el.children[0].data).match(/var dataLayer/);
        if (test[0] == "var dataLayer") {
          //   console.log(el.children[0].data);
          page.dataLayer = el.children[0].data;
          //   console.log(JSON.parse(page.dataLayer));
          return (result = "dataExists");
        }
      } catch (err) {
        // console.log("ERROR");
      }
    });

    if (result === "dataExists") {
      console.log(page);
      pageArray.push(page);
      console.log(pageArray);
      fs.writeFile("pages/" + page.title + ".md", JSON.stringify(page), err => {
        console.log(err);
      });
    }

    // console.log(html);
    // let selectOptions = $('#jumpMenu > option');
    // let optionsArray = [];

    // selectOptions.each(function() {
    //     let link = $(this).val();
    //     optionsArray.push(link);
    // });

    // let formattedArray = [];

    // for (var i = 1; i < optionsArray.length; i++) {
    //     // console.log(optionsArray[i]);
    //     formattedItems = optionsArray[i].slice(5);
    //     formattedArray.push("http://www.assurantsolutions.com" + formattedItems);
    // }

    //     for (var i = 0; i < formattedArray.length; i++) {
    //         // console.log(formattedArray[i]);
    //         axios(formattedArray[i]).then(response => {
    //             let html = response.data;
    //             let $ = cheerio.load(html);
    //             let h1Tags = $('h1').text();
    //             let bodyText = $('body > div > div:nth-child(5)');
    //             fs.writeFile("representatives/" + h1Tags, bodyText, (err) => {
    //                 // throws an error, you could also catch it here
    //                 if (err) throw err.message;
    //                 // success case, the file was saved
    //                 console.log('text saved!');
    //             });

    // fs.appendFile('all.txt', bodyText, function (err) {
    //   if (err) throw err;
    //   console.log('Saved!');
    // });

    //         }).catch(console.error);
    //     }
  })
  .catch(console.error);
