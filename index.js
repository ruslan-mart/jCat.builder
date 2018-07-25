const DEFAULT_BUNDLE = 'dist/bundle.js';
const DEFAULT_EXT = 'js';
const DEFAULT_COMPRESS_EXT_PREFIX = 'min';
const DEFAULT_LIBNAME = 'jCat';

const browserify = require('browserify');
const babelify = require('babelify');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const UglifyJS = require('uglify-js');

function createBundleFile(bundlePath, content) {
	let directory = path.dirname(bundlePath);

	if (!fs.existsSync(directory)) {
		mkdirp.sync(directory);
	}

	let writeStream = fs.createWriteStream(bundlePath);
	writeStream.write(content);
	writeStream.end();
}

module.exports = (options = {}, callback) => {
	let {
		bundle = DEFAULT_BUNDLE,
		compress = false,
		libName = DEFAULT_LIBNAME,
		main = ''
	} = options;

	let mainDirectory = process.cwd();

	if (!path.extname(bundle)) {
		bundle += '.' + DEFAULT_EXT;
	}

	if (compress) {
		bundle = bundle.replace(/\.\w+/, '.' + DEFAULT_COMPRESS_EXT_PREFIX + '$&');
	}

	if (typeof callback !== 'function') {
		callback = null;
	}

	let builder = browserify(path.normalize(mainDirectory + path.sep + main), {
		standalone: 'jCat',
	});

	builder.transform(babelify, {
		presets: [
			['@babel/preset-env', {
				exclude: ['transform-typeof-symbol']
			}]
		]
	});

	builder.bundle((err, buffer) => {
		if (err) {
			return callback && callback(err, null);
		}

		let code = buffer.toString();

		code = code.replace(/g\.jCat\s*=\s*f\(\)/, `
			var jCat = g['${libName}'] !== null && typeof g['${libName}'] !== 'object' ? (g['${libName}'] = {}) : g['${libName}'];
			var _f = f();
			for(var i in _f) if(_f.hasOwnProperty(i)) jCat[i] = _f[i];
		`);


		if (callback === null || callback(null, buffer) !== false) {

			if (compress) {
				code = UglifyJS.minify(code).code;
			}

			createBundleFile(path.normalize(mainDirectory + path.sep + bundle), code);
		}
	});
};