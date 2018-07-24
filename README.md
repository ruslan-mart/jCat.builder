# jCat.builder

![logo](./assets/logo.png)

Compiles the code to ES5 and combines everything into one file

## Install

With [npm](https://www.npmjs.com) do:

```cmd
npm --save-dev install jcat-builder
```

or [yarn](https://yarnpkg.com):
```cmd
yarn --dev add jcat-builder
```

## Usage

```
Usage: jcat-builder {OPTIONS}

Options:

     --bundle, -b  Bundle path, default "dist/bundle.js"

     --module, -m  The main file of the module

   --compress, -c  Compress output using UglifyJS

    --libname, -l  Global object name, default "jCat"
```

### `package.json`

```json
{
	"scripts": {
		"build": "jcat-builder",
		"build:min": "jcat-builder --compress"
	},
	"builderOptions": {
		"bundle": "./dist/bundle.js",
		"main": "./index.js",
		"libName": "jCat"
	}
}
```

`builderOptions` is an additional field


### Node.js

```js
const jCatBuilder = require('jcat-builder');

jCatBuilder({
	bundle: './dist/bundle.js',
	main: './index.js',
	libName: 'jCat',
	compress: false
}, (err, buffer) => {
	if (err) {
		console.log('Error!');
	}
});
```

## License

[MIT](./LICENSE)