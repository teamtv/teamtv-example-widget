# TeamTV widget example

_Simple Example how to build a widget for on your website which includes data from the teamtv EventStream_

Everyone wants to show some interesting information to their fans. To include such interesting information you can now build a teamtv widget. This will use the eventstream api (which includes all match events) to populate cool widgets. 

# Getting started

This repository contains all the boilerplate required to build a widget. It also contains an example of a widget to get you started. The only thing you need to do is build it.

Make sure you install a dependencies:
```bash
npm install
```

## Creating your own widget

In the `src` directory there are two files: `Widget.js` and `Widget.css`. 


## Building

```bash
npm run-script build
```
This will create `dist/widget.js`

## Modifying the build

By default the webpack configuration will exclude all the external React dependencies from the bundle. We have chosen to do so the final bundle will stay small and React dependencies can be loaded from a cdn (and cached). This also required you to load `react` and `react-dom` yourself.
If you would like to create a self-contained bundle remove the `externals` part form the `webpack.prod.config.js` file.
For further modifications please have a look at the webpack documentation.

## Usage

```html
<html>
<head>
    <script crossorigin src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
</head>
<body>
Hieronder mooie stuff!
<div>

    <script src="dist/widget.js"></script>
    <script>
      teamtv.insertWidget("<eventstream endpoint url>");
    </script>
</div>
</body>
</html>


```
