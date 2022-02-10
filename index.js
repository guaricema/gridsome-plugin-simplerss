const RSS = require('rss')
const fs = require('fs')
const path = require('path')

module.exports = function (api, options) {
  api.afterBuild(({ queue, config }) => {
        const feed = new RSS({
            title: options.siteTitle || '',
            site_url: options.siteUrl || '',
            feed_url: options.feedUrl || '',
        })
    
        const author = options.author || 'author'
        const siteUrl = options.siteUrl || 'http://localhost:8080'
        const contentType = options.contentTypeName || 'Article'
    
        let articles = queue.filter(page => { 
            if(page.path.indexOf('/' + contentType.toLowerCase() + '/') !== -1) {
                return true
            }
        })

        let articlesList = [];

        for(let a in articles) {
            // parse json from file to object
            const article = JSON.parse(fs.readFileSync(articles[a].dataOutput), 'utf8')

            // TODO: make this more configurable
            articlesList.push({
                title: article.data.backend.carma_articles_by_id.article_title,
                description: article.data.backend.carma_articles_by_id.article_lead,
                date: article.data.backend.carma_articles_by_id.article_date,
                url: siteUrl + articles[a].path,
                author: author
            });
        }

        let articlesSorted = articlesList.sort(function(a, b) {
            return new Date(b.date) - new Date(a.date);
        });
    
        if(options.maxItems) {
            articlesSorted = articlesSorted.filter((item, index) => index < options.maxItems)
        }

        articlesSorted.forEach(item => feed.item(item))
        
        const output = {
          dir: config.outputDir + '/rss',
          name: 'index.xml'
        }
    
        const outputPath = path.resolve(process.cwd(), output.dir)
        const outputPathExists = fs.existsSync(outputPath)
        const fileName = output.name.endsWith('.xml') ? output.name : `${output.name}.xml`
    
        if (outputPathExists) {
          fs.writeFileSync(path.resolve(process.cwd(), output.dir, fileName), feed.xml())
        } else {
          fs.mkdirSync(outputPath, { recursive: true })
          fs.writeFileSync(path.resolve(process.cwd(), output.dir, fileName), feed.xml())
        }
    })    
}