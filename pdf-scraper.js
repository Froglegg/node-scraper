const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');


const url = 'http://www.assurantsolutions.com/brasil/nossos_representantos/';

axios(url).then(response => {
    let html = response.data;
    let $ = cheerio.load(html);
    let selectOptions = $('#jumpMenu > option');
    let optionsArray = [];


    selectOptions.each(function() {
        let link = $(this).val();
        optionsArray.push(link);
    });

    let formattedArray = [];

    for (var i = 1; i < optionsArray.length; i++) {
        // console.log(optionsArray[i]);
        formattedItems = optionsArray[i].slice(5);
        formattedArray.push("http://www.assurantsolutions.com" + formattedItems);
    }

    for (var i = 0; i < formattedArray.length; i++) {
        // console.log(formattedArray[i]);
        axios(formattedArray[i]).then(response => {
            let html = response.data;
            let $ = cheerio.load(html);
            let h1Tags = $('h1').text();
            // h1Tags = h1Tags.text();
            let pdfLinks = $("a[href$='.pdf']").attr("href");
            fs.writeFile("pdfs/" + h1Tags, pdfLinks, (err) => {
                // throws an error, you could also catch it here
                if (err) throw err.message;
                // success case, the file was saved
                console.log('pdf link saved! ' + h1Tags);
            });
        }).catch(console.error);
    }


}).catch(console.error);