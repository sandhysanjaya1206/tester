const express = require('express')
const app = express()
const port = 3000

const http = require('http');
// const https = require('https');

// const forceSSL = function() {
//     return function(req, res, next) {
//         if (req.headers['x-forwarded-proto'] !== 'https') {
//             return res.redirect(
//                 ['https://', req.get('Host'), req.url].join('')
//             );
//         }
//         next();
//     };
// };

// // Instruct the app
// // to use the forceSSL
// // middleware
// app.use(forceSSL());

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/link', (req, res) => {
    // you have to options: 
    // - if you use dl, then you must send the entire deeplink: https://your.page.link/<trashid>
    // - if you use id, then you must send only the shortlink id: <trashid>
    const deeplink = req.query.dl || ('https://app.meeberian.com/' + req.query.id);
    const imageUrl = 'https://www.google.com.ar/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';
    const title = req.query.title;
    const desc = req.query.desc;
    // here you can use more query string variables to add more info to metadata attributes, 
    // doing some requests or appending them directly
    shareOther(res, deeplink, imageUrl, title, desc);
});

function shareOther(res, deeplink, imageUrl, title, description) {
    res.send(buildShareContent({
        deeplink: deeplink,
        title: title,
        description: description,
        image_url: imageUrl
    }));
}

const buildShareContent = function(data) {
    return ('<!DOCTYPE html>' +
        '<html>' +
        '<head>' +
        '<meta property="fb:app_id" content="985489241643811" />' +
        '<meta property="al:android:package" content="com.meeber.meeberian" />' +
        '<meta property="al:android:app_name" content="Meeberian" />' +
        '<meta property="al:android:url" content="meeber" />' +
        '<meta property="al:ios:url" content="meeber" />' +
        '<meta property="al:ios:app_store_id" content="1459505870" />' +
        '<meta property="al:ios:app_name" content="Meeberian" />' +
        '<meta property="al:web:should_fallback" content="true" />' +
        '<meta property="al:web:url" content="https://www.meeberian.com" />' + // dont know if this is required

        '<meta property="og:title" content="' + data.title + '" />' +
        '<meta property="og:description" content="' + data.description + '" />' +
        '<meta property="og:image" content="' + data.image_url + '" />' +
        '<meta property="og:image:width" content="' + (data.width || 640) + '" />' + // this is for the preview image to load on first share
        '<meta property="og:image:height" content="' + (data.height || 640) + '" />' + // this is for the preview image to load on first share

        '<meta name="twitter:card" content="summary" />' +
        '<meta name="twitter:site" content="@yourtag" />' +
        '<meta name="twitter:creator" content="@yourtag" />' +
        '<meta name="twitter:title" content="' + data.title + '" />' +
        '</head>' +
        '<body>' +
        '<script>' +
        'window.location = "' + data.deeplink + '"' +
        '</script>' +
        '</body>' +
        '</html>')
}

app.listen(process.env.PORT || 8080, () => console.log(`Example app listening at http://localhost:${port}`))