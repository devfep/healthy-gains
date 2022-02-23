// FILESYSTEM
const fs = require("fs");

const http = require("http");
const url = require("url");

const slugify = require("slugify");

const replaceTemplate = require("./modules/replaceTemplate");
// SERVER CREATION & ROUTING

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");

const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  // CL to see what's in the parsed object in order to destructure it for the vars of interest
  //   console.log(url.parse(req.url, true));

  const { query, pathname } = url.parse(req.url, true);

  //   overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });

    // looping over JSON-coverted obj stored in dataObj using a map to create arrays for templating
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARD%}", cardsHtml);

    res.end(output);

    // product page
  } else if (pathname === "/product") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    // API
  } else if (pathname === "/api") {
    //   TODO: moved fileread outside the callback to prevent JSON to be parsed everytime the API link is visited.
    // TODO: using the readFileSync method, the JSON file is loaded once and storeed in the data variable...see above and that is what is sent to end the response
    // fs.readFile(`${__dirname}/dev-data/data.json`, "utf-8", (err, data) => {
    //   // parse JSON to object
    //   const productData = JSON.parse(data);
    //   console.log(productData);

    // Send header info to network tab in console
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    res.end(data);

    //   404 ERROR
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
    });
    res.end("<h1>page not found</h1>");
  }
});

// local host 127.0.0.1 can be omitted since its the defaily

server.listen(8000, "127.0.0.1", () => {
  console.log("listening to request on port 8000");
});
