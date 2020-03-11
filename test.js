var cheerio = require("cheerio");
var html = `
<body>
  <script src="someUrl" type="text/javascript" />
  <script src="someUrl" type="text/javascript" />
  <script src="someUrl" type="text/javascript" />
  <script type="text/javascript">var months = [6,12,24,36,48,60]; var amounts = [5000,10000,15000,20000,25000]</script>
</body>
`;
var str,
  $ = cheerio.load(html, { xmlMode: true }); // xmlMode: true is a workaround for many cheerio bugs.
console.log((str = $("script:not([src])")[0].children[0].data)); // no cleaner way to do this, cheerio?
// var months = [6,12,24,36,48,60]; var amounts = [5000,10000,15000,20000,25000]

var months = JSON.parse(str.match(/months = (\[.*?\])/)[1]);
console.log(months);
// [ 6, 12, 24, 36, 48, 60 ]

var amounts = JSON.parse(str.match(/amounts = (\[.*?\])/)[1]);
console.log(amounts);
// [ 5000, 10000, 15000, 20000, 25000 ]
