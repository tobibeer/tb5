/*\
title: $:/.tb/modules/startup/responsive.js
type: application/javascript
module-type: startup
created: 20151112123235915
creator: Tobias Beer
modified: 20151112123235915
modifier: Tobias Beer

Switches themes depending on screen size.

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

// Export name and synchronous status
exports.name = "responsive";
exports.platforms = ["browser"];
exports.after = ["startup"];
exports.synchronous = true;

exports.startup = function() {
	var handler = function(event) {
			var n = Object.keys(window.responsive).length;
			$tw.utils.each(window.responsive, function(theme, key){
				n--;
				var current,
					width = parseInt(key),
					w = window,
					d = document,
					e = d.documentElement,
					g = d.getElementsByTagName('body')[0],
					bodyWidth = w.innerWidth || e.clientWidth || g.clientWidth;
				if (n == 0 || bodyWidth < width && !isNaN(width)) {
					current = $tw.wiki.getTiddlerText("$:/theme");
				  	if (current != theme) {
						$tw.wiki.setText("$:/theme","text",null,theme);
					}
					return false;
				}
			});
		};
	window.addEventListener("resize",handler);
	window.responsive = $tw.wiki.getTiddlerData("$:/theme/responsive",Object.create(null));
	handler();
};

})();
