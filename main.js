const puppeteer = require('puppeteer');

async function scrapeProduct(url) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url)
    const div = await page.$$(".tileV2")
    for(const element of div) {
        
        // Get ad price
        const [adPrice] = await element.$$('span.ad-price')
        const text = await adPrice.getProperty('innerText');
        const adPriceText = await text.jsonValue()

        // Get location
        const [readMore] = await element.$$('div.tile-read-more-expanded')
        const [espandedDescription] = await readMore.$$('div.expanded-description')
        const expandedDescriptionText = await espandedDescription.getProperty('innerText');
        const expandedDescriptionTextJSON = await expandedDescriptionText.jsonValue()

        console.log(
            {
                price: adPriceText,
                espandedDescription: expandedDescriptionTextJSON
            }
        )
    }
}

scrapeProduct('https://www.vivanuncios.com.mx/s-venta-inmuebles/coyoacan/v1c1097l10268p1?pr=,2000000')