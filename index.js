const puppeteer = require('puppeteer');

let page = null;
let browser = null;

browser = puppeteer.launch({ headless: false })
.then( async (browser) => {
    page = await browser.newPage();

    page.setViewport({
        width: 1920,
        height: 1080,
        isMobile: false,
        isLandscape: true
    });

    page.goto('https://www.tradingview.com/markets/stocks-usa/market-movers-gainers/')

    await page.waitForNavigation();
    const stockCodes = await page.evaluate(() => {
        const tableBody = document.querySelectorAll('.stretch-gZJAyxim > table:nth-child(1) > tbody > tr');
        return Array.from(tableBody).map(element => element.getAttribute('data-rowkey'));
    });

    const stockRows = await page.evaluate(() => {
        const tableBody = document.querySelectorAll('.stretch-gZJAyxim > table:nth-child(1) > tbody > tr');
        return Array.from(tableBody).map(element => element.textContent);
    });

    // console.log(data);
    console.log('Here are the Top 100 Gainers in the Stock Market Right Now')
    console.log('------------------------------------------------------------');
    stockCodes.map((element, i) => {
        console.log((i+1) + ': ' + element.substring(element.indexOf(':') + 1) + ' ' + stockRows[i].substring(element.substring(element.indexOf(':') + 1).length, stockRows[i].indexOf('D'))
        + '\n\tToday\'s Growth: ' + stockRows[i].substring(stockRows[i].indexOf('%') - 5, stockRows[i].indexOf('%') + 1).replaceAll('D', '')
        + '\n\tLink: ' + `https://www.tradingview.com/symbols/${element}/` + '\n');
    });

})
.catch((error) => {
    console.log(error)
})

