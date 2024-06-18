# my-first-vue-app



## 

### shuttle-server

This is a support server that removes CORS restrictions for retrieving resources (in this case XML for feed data).

- Codebase: https://github.com/matt-wiley/shuttle-server

#### Example `fetch` from browser

```javascript
await fetch("https://shuttle-rftnh5bqzq-uc.a.run.app", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ target: "https://www.sciencedaily.com/rss/all.xml" }),
})
.then((response) => response.text())
.then((text) => console.log(text));
```

#### Example `cURL` from terminal

```bash
curl -sSL \
     -H 'Content-Type: application/json' \
     -X POST \
     -d "{\"target\": \"https://www.sciencedaily.com/rss/all.xml\"}" \
     https://shuttle-rftnh5bqzq-uc.a.run.app
```