
#Getting started with Flow type checking

>This TL;DR assumes you already have Node and NPM installed.
>For the official guide, check the blogpost [here](https://flowtype.org/blog/2016/10/13/Flow-Typed.html)

##Install flow
First, install **Flow** and **Flow-CLI**
```npm install -g flow-bin flow-typed```

Flow-bin provides binaries for Flow on Mac/Win/Lin.
Flow-typed is a CLI tool for adding type definitions to projects.

##To add Flow types to a project
Create a new ```.flowconfig``` in the same folder as your package.json. Inside add the following text:
```bash
[ignore]
<PROJECT_ROOT>/node_modules/fbjs/.*
```
Install ```flow-bin``` into your project:
```npm install --save-dev flow-bin```
Now run:
```npm install```
```flow-typed install```
This adds type definition files based on what is in the package.json file.

 Here is an example output:

```bash
21:29 $ flow-typed install
• Found flow-bin@v0.33.0 installed. Installing libdefs compatible with this version of Flow...
• Found 31 dependencies in package.json. Searching for libdefs...
• flow-typed cache not found, fetching from GitHub...done.
• Installing 5 libdefs...
  • redux_v3.x.x.js
    └> ./flow-typed/npm/redux_v3.x.x.js
  • react-redux_v4.x.x.js
    └> ./flow-typed/npm/react-redux_v4.x.x.js
  • lodash_v4.x.x.js
    └> ./flow-typed/npm/lodash_v4.x.x.js
  • express_v4.x.x.js
    └> ./flow-typed/npm/express_v4.x.x.js
  • flow-bin_v0.x.x.js
    └> ./flow-typed/npm/flow-bin_v0.x.x.js
• Generating stubs for untyped dependencies...
  • babel-plugin-syntax-async-functions@^6.8.0
    └> flow-typed/npm/babel-plugin-syntax-async-functions_vx.x.x.js
  • babel-plugin-transform-decorators-legacy@^1.3.4
    └> flow-typed/npm/babel-plugin-transform-decorators-legacy_vx.x.x.js
  • babel-plugin-transform-runtime@^6.9.0
    └> flow-typed/npm/babel-plugin-transform-runtime_vx.x.x.js
  • apiai@^2.0.7
    └> flow-typed/npm/apiai_vx.x.x.js
  • babel-plugin-transform-regenerator@^6.9.0
    └> flow-typed/npm/babel-plugin-transform-regenerator_vx.x.x.js
  • babel-polyfill@^6.9.1
    └> flow-typed/npm/babel-polyfill_vx.x.x.js
  • babel-preset-es2015@^6.9.0
    └> flow-typed/npm/babel-preset-es2015_vx.x.x.js
  • babel-preset-react@^6.11.1
    └> flow-typed/npm/babel-preset-react_vx.x.x.js
  • babel-preset-stage-0@^6.5.0
    └> flow-typed/npm/babel-preset-stage-0_vx.x.x.js
  • fetch@^1.1.0
    └> flow-typed/npm/fetch_vx.x.x.js
  • firebase@^3.2.0
    └> flow-typed/npm/firebase_vx.x.x.js
  • socket.io@^1.4.8
    └> flow-typed/npm/socket.io_vx.x.x.js
  • react-tap-event-plugin@^1.0.0
    └> flow-typed/npm/react-tap-event-plugin_vx.x.x.js
  • webpack-dev-middleware@^1.8.4
    └> flow-typed/npm/webpack-dev-middleware_vx.x.x.js
  • webpack-hot-middleware@^2.13.0
    └> flow-typed/npm/webpack-hot-middleware_vx.x.x.js
  • babel-loader@^6.2.4
    └> flow-typed/npm/babel-loader_vx.x.x.js
  • idle-js@^0.1.0
    └> flow-typed/npm/idle-js_vx.x.x.js
  • dateformat@^1.0.12
    └> flow-typed/npm/dateformat_vx.x.x.js
  • babel-runtime@^6.9.2
    └> flow-typed/npm/babel-runtime_vx.x.x.js
  • material-ui@^0.15.2
    └> flow-typed/npm/material-ui_vx.x.x.js
  • webpack@^1.13.1
    └> flow-typed/npm/webpack_vx.x.x.js
  • nodemon@^1.10.0
    └> flow-typed/npm/nodemon_vx.x.x.js
  • source-map-loader@^0.1.5
    └> flow-typed/npm/source-map-loader_vx.x.x.js
  • babel-core@^6.10.4
    └> flow-typed/npm/babel-core_vx.x.x.js

!! No flow@v0.33.0-compatible libdefs found in flow-typed for the above untyped dependencies !!

   I've generated `any`-typed stubs for these packages, but consider submitting
   libdefs for them to https://github.com/flowtype/flow-typed/
```
