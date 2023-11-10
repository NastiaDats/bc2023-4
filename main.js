const http = require('http');
const fs = require('fs');
const fastXmlParser = require('fast-xml-parser')

const server = http.createServer((req, res) => {
  fs.readFile('data.xml', 'utf-8', (err, xmlData) => {
  if (err) {
  res.writeHead(500, { 'Content-Type': 'text/plain' });
  res.end('Internal Server Error');
  return;
  }

  const parser = new fastXmlParser.XMLParser();
  const jsonObj = parser.parse(xmlData);

  if (jsonObj.err) {
  res.writeHead(500, { 'Content-Type': 'text/plain' });
  res.end('Error parsing XML');
  return;
  }

  const assets = jsonObj.indicators.res;

  let minAsset = null;
  assets.forEach((asset) => {
  const value = parseFloat(asset.value);
  if (minAsset === null || value < minAsset.value) {
  minAsset = {
  value: value,
  };
  }
  });

  const builder = new fastXmlParser.XMLBuilder();
  const responseXML = builder.build({
  data:{
  min_value:minAsset.value,
  },
  });
  res.writeHead(200, { 'Content-Type': 'application/xml' });
  res.end(responseXML);
  
  });
 });

 const host = 'localhost';
 const port = 8000;
 server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
 });