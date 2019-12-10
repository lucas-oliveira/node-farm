fs = require('fs')

const replaceTemplate = require('./modules/replaceTemplate')


//Sync




// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8')

// console.log(textIn)

// const textOut = `This is what we know about the avocado: ${textIn}.\n Created on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log("File written!");

//Async

// fs.readFile('./txt/start.txt','utf-8', (err,data)=>{
//     fs.readFile(`./txt/${data}.txt`, 'utf-8', (error,data2)=>{
//         console.log(data2)
//     })
//     console.log(data)
// })

// console.log('Will read file')




const http = require('http')
const url = require('url')

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8')
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8')
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8')

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
const dataObj = JSON.parse(data)



const server = http.createServer((req, res)=>{
    const {query, pathname} = url.parse(req.url, true )
    if(pathname === '/' || pathname === '/overview'){
        
        res.writeHead(200, {
            'Content-type': 'text/html',
        })
        const cardsHtml = dataObj.map(el=> replaceTemplate(tempCard, el)).join('')
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml)
        res.end(output)
    } 
    
    
    else if (pathname === '/product') {
        res.writeHead(200, {
            'Content-type': 'text/html',
        })
        const product = dataObj[query.id]
        const output = replaceTemplate(tempProduct, product)
        res.end(output)

    } 
    
    
    else if (pathname === '/api') {
        res.writeHead(200, {
            'content-type': 'application/json'
        })
        res.end(data)
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello world',
        })
        res.end('<h1>Page not found</h1>');
    }
})

server.listen(5000, 'localhost', ()=>{
    console.log('Listening for requests on port 5000')
})