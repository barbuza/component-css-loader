# Component stylesheets loader

[Webpack](webpack.github.io) loader that provides simple convention on how to
organize component's stylesheets.

_If component has an associated stylesheets, **stylesheets file should has the
same name** (except extension of cource) and be **placed in the same directory**. When
component is required stylesheets file will be required as well._

## Installation

```
npm install --save-dev barbuza/component-css-loader
```

## Usage

In config file:

``` javascript
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: [
          'component-css?ext=styl&varName=styles',
          'babel'
        ]
      },
      {
        test: /\.styl$/,
        loaders: [
          'style',
          'css?module&importLoaders=1&localIdentName=[hash:base64:5]',
          'stylus'
        ]
      },
      // ...
    ],
    // ...
  },
```

Read more about [webpack loaders](http://webpack.github.io/docs/using-loaders.html).

## Avaliable queries

`ext` specifies the extension of matching style files

`varName` for use with css local-scope, defines the name for exported identifiers hash

## Example

Imagine you have `Button` component (in this case, component file has
`js` extension, and stylesheets file has [`styl`](http://learnboost.github.io/stylus/)) extension):

```
...
├── components
│   ├── Button.js
│   ├── Button.styl
│   ...
...
```

`Button.js`
```js
export default class Button {
  render() {
    return (
      <div> className={styles.root}>
        <div className={styles.caption}>{this.props.caption}</div>
      </div>
    )
  }
}
```

`Button.styl`
```css
.root {
  background: gray;
}

.caption {
  font-weight: bold;
}
```

as the result you have isolated style definitions for `Button` component and there is no worry about class name clashes

### How it works?

`component-css-loader` modifies original component source code and adds
```
var [varName] = require('./[ComponentName].[ext]')
```
at the first line.

For better understanding, read [the source code](./index.js).
