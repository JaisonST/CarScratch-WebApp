const puppeteer = require('puppeteer');

async function generatePDF(url, reportid){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Directing to the result page
    await page.goto('http://localhost:80'+url, {waitUntil: ['domcontentloaded']});
    await page.waitFor(1000);
    // Saves pdf 
    await page.pdf({ path: './reports/'+reportid+'.pdf', format: 'A4' });
    await browser.close();
}

module.exports = generatePDF;