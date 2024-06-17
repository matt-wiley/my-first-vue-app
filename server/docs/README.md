# `shuttleServer.ts`

### Running the server

```bash
# From the project root dir

npx ts-node server/shuttleServer.ts 
```

### `fetch`

Snippet to execute a fetch agains the shuttle server from the browser console 

```javascript
await fetch("http://localhost:3000", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ target: "https://www.sciencedaily.com/rss/all.xml" }),
})
.then((response) => response.text())
.then((text) => console.log(text));

```


### `cURL`

Script curl against the shuttle server

```bash
#!/usr/bin/env bash

curl -sSL \
     -H 'Content-Type: application/json' \
     -X POST \
     -d "{\"target\": \"${1}\"}" \
     http://localhost:3000

```