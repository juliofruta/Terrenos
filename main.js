const puppeteer = require('puppeteer');

async function scrapeProduct(url) {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    await page.goto(url)
    const div = await page.$$(".tileV2")
    
    var model = []

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

        await element.click()

        // TODO visit detailed page.
        // TODO extract geolocation info for future land price estimation.

        model.push(
            {
                price: adPriceText,
                espandedDescription: expandedDescriptionTextJSON
            }
        )
    }

    //TODO: implement pagination

    console.log(model)
}

scrapeProduct('https://www.vivanuncios.com.mx/s-venta-inmuebles/coyoacan/v1c1097l10268p1?pr=,2000000')