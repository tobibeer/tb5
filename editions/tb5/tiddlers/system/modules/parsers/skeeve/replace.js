/*\
title: $:/parsers/skeeve/rules/replace.js
type: application/javascript
module-type: wikirule

Wiki pragma rule for replacements

```
\replace /search/replace/
```

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports.name = "replace";
exports.types = {pragma: true};

/*
Instantiate parse rule
*/
exports.init = function(parser) {
	this.parser = parser;
	// Regexp to match
	this.matchRegExp = /^\\replace\s+\/((?:[^\/\\]*|\\.)*)\/((?:[^\/\\]*|\\.)*)\/[ \t]*$/mg;
	this.findNextMatch = findNextMatch;
}

function findNextMatch(startPos) {
	this.matchRegExp.lastIndex = startPos;
	this.match = this.matchRegExp.exec(this.parser.source);
	if(!this.match) return undefined;
	if(this.replacementsDone) return this.match.index;
	
	this.replacementsDone = true;
	
	// Find the end of all pragmas
	var pragmaLine = /^(?:.*\n)*\s*\\.*\n/g;
	pragmaLine.exec(this.parser.source);
	var pragmaEnd = pragmaLine.lastIndex;
	var src = this.parser.source.substr(pragmaEnd);
		
	do {
		var search = new RegExp(this.match[1], "gm"),
			 replace = this.match[2].replace(/\\n/g,"\n").replace(/\\t/g,"\t").replace(/\\(.)/g, "$1");
		src = src.replace(search, replace);
	} while(this.match = this.matchRegExp.exec(this.parser.source));
	this.parser.source = this.parser.source.substr(0,pragmaEnd) + src;
	this.parser.sourceLength = this.parser.source.length;
	this.match = this.matchRegExp.exec(this.parser.source)
	return this.match.index;
};

/*
Parse the most recent match
*/
exports.parse = function() {
	// Move past match
	this.parser.pos = this.matchRegExp.lastIndex;
	return [];
};

})();
