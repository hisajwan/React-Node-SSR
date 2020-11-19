import express from 'express';
import fs from 'fs';
import path from 'path';
import serialize from 'serialize-javascript';
import React from 'react';
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom';
import App from './ssr-client/src/App';

const app = express();

const PORT = process.env.PORT || 5000;

const renderServerDOM = (req, res) => {

    const initialData = {
        creator: 'Himanshu Sajwan'
    }

    const html = ReactDOMServer.renderToString(
        <StaticRouter location={req.url}>
            <App initialData={initialData} />
        </StaticRouter>
    )

    // Read index.html file
    fs.readFile(`${__dirname}/ssr-client/build/index.html`, 'utf8', (err, markup) => {
        if(err) throw err;

        const data = markup.replace(/<div id="root"><\/div>/, `<div id="root">${html}</div><script>window.__INITIAL_STATE__= ${serialize(initialData)}</script>`)
        res.send(data);
    })
}


// Serve built files with static files middleware
app.use('/static', express.static(path.join(__dirname, 'ssr-client/build/static')));

// Serves request using renderServerDOM function
app.get('/', renderServerDOM);

// In case if path is not found
app.get('*', (req, res)=> {
    res.status(404).sendFile(`${__dirname}/not-found.html`)
})

// Starting Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})