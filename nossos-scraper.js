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
            let h1Tags = $('h1').html();
            let bodyText = $('body > div > div:nth-child(5)');
            // let pdfUrl = $("a[href$='.pdf']");
            fs.writeFile("representatives/" + h1Tags, bodyText, (err) => {
                // throws an error, you could also catch it here
                if (err) throw err.message;
                // success case, the file was saved
                console.log('text saved!');
            });

        }).catch(console.error);
    }


    // axios({
    //     url: 'http://localhost:5000/static/example.pdf',
    //     method: 'GET',
    //     responseType: 'blob', // important
    // }).then((response) => {
    //     const url = window.URL.createObjectURL(new Blob([response.data]));
    //     const link = document.createElement('a');
    //     link.href = url;
    //     link.setAttribute('download', 'file.pdf');
    //     document.body.appendChild(link);
    //     link.click();
    // });



}).catch(console.error);