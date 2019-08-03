const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');


const url = 'http://www.assurantsolutions.com/brasil/br-condicoesGerais.html';

axios(url).then(response => {
    let html = response.data;
    let $ = cheerio.load(html);
    let pdfLinks = $("a[href$='.pdf']").attr("href");

    console.log(pdfLinks);
}).catch(console.error);

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