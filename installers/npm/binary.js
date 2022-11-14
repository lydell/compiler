var fs = require('fs');
var package = require('./package.json');
var path = require('path');



// MAIN
//
// This function is used by install.js and by the bin/elm backup that gets
// called when --ignore-scripts is enabled.


module.exports = function()
{
	// figure out package of binary
	var version = package.version.replace(/^(\d+\.\d+\.\d+).*$/, '$1'); // turn '1.2.3-alpha' into '1.2.3'
	var subPackageName = '@lydell/elm_' + process.platform + '_' + process.arch;

	// temporary code to support ARM Mac via Rosetta until we have a native binary
	if (process.platform === 'darwin' && process.arch === 'arm64')
	{
		// note: remove "arm64" from this package when adding elm_darwin_arm64
		subPackageName = '@lydell/elm_darwin_x64';
	}

	verifyPlatform(version, subPackageName);

	var fileName = process.platform === 'win32' ? 'elm.exe' : 'elm';

	try
	{
		var subBinaryPath = require.resolve(subPackageName + '/' + fileName);
	}
	catch (error)
	{
		if (error && error.code === 'MODULE_NOT_FOUND')
		{
			exitFailure(version, missingSubPackageHelp(subPackageName));
		}
		else
		{
			exitFailure(version, 'I had trouble requiring the binary package for your platform (' + subPackageName + '):\n\n' + error);
		}
	}

	// as mentioned in bin/elm we cannot do any optimizations on Windows
	if (process.platform === 'win32')
	{
		return subBinaryPath;
	}

	// figure out where to put the binary
	var binaryPath = path.resolve(__dirname, package.bin.elm);
	var tmpPath = binaryPath + '.tmp';

	// optimize by replacing the JS bin/elm with the native binary directly
	try
	{
		// atomically replace the file with a hard link to the binary
		fs.linkSync(subBinaryPath, tmpPath);
		fs.renameSync(tmpPath, binaryPath);
	}
	catch (error)
	{
		exitFailure(version, 'I had some trouble writing file to disk. It is saying:\n\n' + error);
	}

	return binaryPath;
}



// VERIFY PLATFORM


function verifyPlatform(version, subPackageName)
{
	if (subPackageName in package.optionalDependencies) return;

	var situation = process.platform + '_' + process.arch;
	console.error(
		'-- ERROR -----------------------------------------------------------------------\n\n'
		+ 'I am detecting that your computer (' + situation + ') may not be compatible with any\n'
		+ 'of the official pre-built binaries.\n\n'
		+ 'I recommend against using the npm installer for your situation. Check out the\n'
		+ 'alternative installers at https://github.com/elm/compiler/releases/tag/' + version + '\n'
		+ 'to see if there is something that will work better for you.\n\n'
		+ 'From there I recommend asking for guidance on Slack or Discourse to find someone\n'
		+ 'who can help with your specific situation.\n\n'
		+ '--------------------------------------------------------------------------------\n'
	);
	process.exit(1);
}



// EXIT FAILURE


function exitFailure(version, message)
{
	console.error(
		'-- ERROR -----------------------------------------------------------------------\n\n'
		+ message
		+ '\n\nNOTE: You can avoid npm entirely by downloading directly from:\n'
		+ 'https://github.com/elm/compiler/releases/tag/' + version + '\n'
		+ 'All this package does is distributing a file from there.\n\n'
		+ '--------------------------------------------------------------------------------\n'
	);
	process.exit(1);
}



// MISSING SUB PACKAGE HELP


function missingSubPackageHelp(subPackageName)
{
	return (
		'I support your platform, but I could not find the binary package (' + subPackageName + ') for it!\n\n'
		+ 'This can happen if you use the "--omit=optional" (or "--no-optional") npm flag.\n'
		+ 'The "optionalDependencies" package.json feature is used by Elm to install the correct\n'
		+ 'binary executable for your current platform. Remove that flag to use Elm.\n\n'
		+ 'This can also happen if the "node_modules" folder was copied between two operating systems\n'
		+ 'that need different binaries - including "virtual" operating systems like Docker and WSL.\n'
		+ 'If so, try installing with npm rather than copying "node_modules".'
	);
}
