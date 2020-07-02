# calendar-app

A basic Electron application needs just these files:

- `package.json` - Points to the app's main file and lists its details and dependencies.
- `main.js` - Starts the app and creates a browser window to render HTML. This is the app's **main process**.
- `index.html` - A web page to render. This is the app's **renderer process**.

You can learn more about each of these components within the [Quick Start Guide](https://electronjs.org/docs/tutorial/quick-start).

## Rules with jshint
```bash 
{
    "jshint.options": {
        "esversion": 6
    },
    "editor.formatOnSave": true,
    "prettier.requireConfig": true,
    "files.autoSave": "afterDelay",
    "window.zoomLevel": 2,
    "javascript.updateImportsOnFileMove.enabled": "always",
    "prettier.singleQuote": true,
    "prettier.quoteProps": "consistent",
    "prettier.trailingComma": "es5",
    "prettier.useTabs": true,
    "prettier.vueIndentScriptAndStyle": true,
    "jshint.reportWarningsAsErrors": true,
}
```

## To Use

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash

# Create DB
mysql -h <HOSTNAME>  -u <USERNAME> -p <PASSWORD>  < /path/to/dump.sql
#check if hostname, username, password are not equal in dbProvider.js
# Go into the repository
cd calendar-app
# Install dependencies
npm install
# Run the app
npm start
# Test the app
yarn coverage
```
