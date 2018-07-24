#!/usr/bin/env node

const sade = require('sade');
const path = require('path');
const prog = sade('jcat-builder');


prog
	.version(require('../package').version)
	.option('--bundle, -b', 'Bundle path, default "dist/bundle.js"')
	.option('--main, -m', 'The main file of the module')
	.option('--compress, -c', 'Compress output using UglifyJS')
	.option('--libname, -l', 'Global object name, default "jCat"');

prog
	.command('build [...entries]', '', {
		default: true
	})
	.describe('Build once and exit')
	.action(run);

prog.parse(process.argv);


function run(str, options) {
	let {builderOptions = {}} = require(process.cwd() + '/package'),
		module = require('../');

	let {
		bundle = builderOptions.bundle,
		compress = false,
		libname = builderOptions.libName,
		main = builderOptions.main
	} = options;

	module({
		bundle,
		compress,
		libName: libname,
		main
	});
}