const express = require('express');
const path = require('path');
const fs = require('fs');

const wss =  new (require('ws').Server)({ port: 3334 });

const app = express();

const wsClientArray = [ ];

app.use(express.static(path.resolve(__dirname, '../dist')));
app.listen(3333);

wrappWsClient();
function wrappWsClient() {
    const wsClientPath = path.resolve(__dirname, '../dist/wsClient.js');
    if(!fs.existsSync( wsClientPath )){
        const distPath = path.resolve(__dirname, '../dist');
        if(!fs.existsSync(distPath)){
            fs.mkdirSync(distPath);
        }
        fs.copyFileSync( path.resolve(__dirname, './wsClient.js'), wsClientPath ); 
    };
    const indexHtmlFilePath = path.resolve(__dirname, '../dist/index.html'); 
    if( fs.existsSync(indexHtmlFilePath) ){
        const indexHtmlFile = fs.readFileSync(indexHtmlFilePath); 
        const indexHtml = indexHtmlFile.toString();
        const replaced = indexHtml.replace(/<body>.*<\/body>/s, matchStr => {
            const scriptLink = '<script src="wsClient.js"></script>';
           return  matchStr.includes(scriptLink)? matchStr : matchStr.replace(/>\s*<\/body>/, `>\n    ${ scriptLink }\n</body>` ); 
        });
        if( replaced !== indexHtml ){
            fs.writeFileSync(indexHtmlFilePath, replaced);
        }
    };
};

fs.watch( path.resolve(__dirname, '../dist'), eventName => {
    wrappWsClient();
    wsClientArray.map( ws => ws.send('reload'));
});

wss.on('connection', function connection(ws) {
    wsClientArray.push( ws );
    ws.on('close', function disconnection() {
        const index = wsClientArray.indexOf( ws );
        if( index > -1 ){
            wsClientArray.splice( index, 1);
        }
    });
});
console.log('http://localhost:3333');