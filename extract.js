const fs = require('fs');
const path = require('path');

const dir = 'C:/Users/LENOVO/Desktop/elecV/ElecVendors/app';
const arabicRegex = /[\u0600-\u06FF]+/;
let results = new Set();

function walk(dir) {
  let files = fs.readdirSync(dir);
  for (let file of files) {
    let fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      let lines = content.split('\n');
      for(let line of lines) {
        if(arabicRegex.test(line)) {
            let matches = line.match(/(['"`])(.*?[\u0600-\u06FF]+.*?)\1/g);
            if(matches) {
               matches.forEach(m => results.add(m.slice(1, -1)));
            } else {
               let jsxMatch = line.match(/>([^<]*[\u0600-\u06FF]+[^<]*)</);
               if(jsxMatch) results.add(jsxMatch[1].trim());
               else results.add(line.trim());
            }
        }
      }
    }
  }
}
walk(dir);
console.log(JSON.stringify(Array.from(results), null, 2));
