/**
 * This is a small server that fetches a URL and returns the content as a string.
 * 
 * This is intended to be used as a way to bypass CORS restrictions when fetching content via the browser.
 */

// TODO: Add error handling for fetch
// TODO: Implement Bearer token authentication

(() => {
    const express = require('express');

    const app = express()
    const port = 3000;
    
    app.use(express.json());

    app.options('/', (req: any, res: any) => {
        // Enable CORS preflight check allowing POST requests from any origin
        // ref: https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173')
        res.setHeader('Access-Control-Allow-Methods', 'POST')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
        res.end()
    });

    app.post('/', async (req: any, res: any) => {
        console.log('Got a POST request');
        console.log(req.body);

        let errorFound = false;
        
        const target = req.body.target;

        for (let i = 0; i < 1; i++) {
            if (!target) {
                errorFound = true;
                break;
            }
            else if (typeof target !== 'string') {
                errorFound = true;
                break;
            }
            else if (target.length === 0) {
                errorFound = true;
                break;
            }
            else if ( ! (target.startsWith("http://") || target.startsWith("https://")) ) {
                errorFound = true;
                break;
            }
            else {
                try {
                    new URL(target);
                } catch (e) {
                    errorFound = true;
                    break;
                }
            }
        }

        if (errorFound) {
            console.error('Bad Request');
            res.status(400).send('Bad Request\n');
            return;
        }

        try {
            const targetResp = await fetch(target)

            if (!targetResp.ok) {
                throw new Error('Failed to fetch target');
            }

            const targetText = await targetResp.text();

            res.setHeader('Access-Control-Allow-Origin', '*')
            res.end(targetText)
        }
        catch (e) {
            console.error(e);
            res.status(500).send('Internal Server Error');
            return;
        }

    })
    
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });


})();




