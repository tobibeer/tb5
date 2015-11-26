/*\
title: $:/.tb/demo/example.js
type: application/javascript
module-type: macro

<<examplemacro>>
<<examplemacro "foo bar">>

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
An example js macro rendering an internal link.
*/

exports.name = "examplemacro";

exports.params = [
	{ name: "tid" }
];

/*
Run the macro
*/
exports.run = function(tid) {
	var tid = tid || "GettingStarted",
	output ="[[" + tid + "]]";
	return output;
};

})();