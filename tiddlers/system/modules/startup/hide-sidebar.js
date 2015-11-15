/*\
title: $:/.tb/modules/startup/hide-sidebar.js
type: application/javascript
module-type: startup
created: 20151010151732122
creator: Tobias Beer
modified: 20151010151750739

Hides the sidebar on startup when the config tiddler [[$:/config/hide-sidebar-on-startup]] contains "yes"

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

// Export name and synchronous status
exports.name = "hide-sidebar-on-startup";
exports.platforms = ["browser"];
exports.after = ["startup"];
exports.synchronous = true;

exports.startup = function() {
	var conf = $tw.wiki.getTiddler("$:/config/HideSidebarOnStartup"),
		value = (conf ? conf.getFieldString("text") : "").toLowerCase(),
		state = value == "yes" ? "no" : "yes";
	$tw.wiki.setText("$:/state/sidebar", "text", undefined, state);
};

})();