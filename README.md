# my-first-vue-app

Building an front-end-only RSS Reader with Vue.js (Vue 2)


## Project setup

This project was created using the Vue CLI. To run this project, you need to have Node.js installed. 

Versions used in development:
- Node.js: `20.14.0`
  - npm: `10.7.0`

Install the dependencies with the following command:
```
npm install
```

Run the development server with the following command:
```
npm run dev
```

> **NOTE:** By default, the development server will run on http://localhost:5173/

> See the `scripts` section in the `package.json` file for more commands.

### Debugging in Visual Studio Code

This project was developed using Visual Studio Code. To debug the project, you can use the built-in debugger.

Create a `launch.json` file in the `.vscode/` folder with the following content:

> If you already have a `launch.json` file, you can add the following configuration as a new element in the `configurations` array.

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "vuejs: chrome",
      "url": "http://localhost:5173/",
      "webRoot": "${workspaceFolder}/src",
      "sourceMapPathOverrides": {
        "webpack:///src/*": "${webRoot}/*"
      },
      "runtimeExecutable": "/path/to/chrome-or-chromium",
    }
  ]
}
```

