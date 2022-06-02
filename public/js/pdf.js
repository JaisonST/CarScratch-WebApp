const puppeteer = require('puppeteer');

async function generatePDF(){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Directing to the result page
    await page.goto('http://localhost:80/result/');

    // Saves pdf 
    await page.pdf({ path: './records/Report_1123456.pdf', format: 'A4' });
    
    await browser.close();
}

module.exports = generatePDF;