# Simple RSS Plugin for Gridsome

```js
module.exports = {
  plugins: [
    // rss.xml
    {
      use: 'gridsome-plugin-simplerss',
      options: {
        contentTypeName: 'Article',
        author: 'Author name',
        siteTitle: 'Site title',
        siteUrl: 'http://localhost',
        feedUrl: 'http://localhost/rss/index.xml',
        maxItems: 10
      }
    },
  ]
}
```