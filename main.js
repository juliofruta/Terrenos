const puppeteer = require('puppeteer');

async function scrapeProduct(url) {
    const browser = await puppeteer.launch()//({ headless: false })
    const page = await browser.newPage()
    await page.goto(url)
    const div = await page.$$(".tileV2")
    
    var model = []

    for(const element of div) {
        
        // Get ad price
        const [adPrice] = await element.$$('span.ad-price')
        const text = await adPrice.getProperty('innerText');
        const adPriceText = await text.jsonValue()

        // Get description
        const [readMore] = await element.$$('div.tile-read-more-expanded')
        const [espandedDescription] = await readMore.$$('div.expanded-description')
        const expandedDescriptionText = await espandedDescription.getProperty('innerText');
        const expandedDescriptionTextJSON = await expandedDescriptionText.jsonValue()

        // Get title
        const [urlElement] = await element.$$('div.tile-desc')
        const [ahreflink] = await element.$$('a.href-link')
        const href = await ahreflink.getProperty('href')
        const hrefText = await href.jsonValue()

        await model.push(
            {
                price: adPriceText,
                description: expandedDescriptionTextJSON,
                url: hrefText
            }
        )
    }

    for(const entry of model) {
        await page.setDefaultNavigationTimeout(0)
        await page.goto(entry.url)
        const [elementWithLocation] = await page.$$('img.signed-map-image')
        const locationURL = await elementWithLocation.getProperty('src')
        const locationURLText = await locationURL.jsonValue()
        const [, coordinates] = locationURLText.match(/center=(.*?)&zoom/) || [];
        entry.coordinates = coordinates
    }

    //TODO: use numbers for price
    //TODO: user numbers for location
    console.log(model)
}



scrapeProduct('https://www.vivanuncios.com.mx/s-venta-inmuebles/coyoacan/v1c1097l10268p1?pr=,2000000')