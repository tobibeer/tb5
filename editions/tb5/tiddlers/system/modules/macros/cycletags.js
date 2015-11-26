/*\
created: 20151008200037346
creator: Tobias Beer
modified: 20151008200114256
title: $:/.tb/modules/macros/cycletags.js
type: application/javascript
module-type: macro
summary: a javascript macro allowing to cycle through tags
created: 20140110061443770
creator: Tobias Beer
modified: 20151008100040598

<<cycletags """foo bar baz""">>

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
Allows to cycle through a number of tags.
*/

exports.name = "cycletags";

exports.params = [
	{ name: "tags"},
	{ name: "group"},
	{ name: "label"},
	{ name: "tooltip"},
	{ name: "class"},
	{ name: "reset"},
	{ name: "resetLabel"},
	{ name: "resetTooltip"}
];

/*
Run the macro
*/
exports.run = function(paramtags, group, btnText, btnTip, cls, reset, resetText, resetTip) {
	var current = -1, cycle = "", next, removeAction = "", resetCode, tip,
		tid = $tw.wiki.getTiddler(this.getVariable("currentTiddler")),
		currentTags = tid && tid.fields.tags ? tid.fields.tags : [],
		tags = $tw.utils.parseStringArray(paramtags),
		locale = this.wiki.getTiddler("$:/.tb/modules/macros/cycletags.js/lingo"),
		lingo = function(index) {
			return locale ? $tw.wiki.extractTiddlerDataItem(locale,index,"") : "";
		};
	group = " " + (group ? group + "-" : "") + lingo("tag");
	$tw.utils.each(tags, function(tag, i){
		if(currentTags.indexOf(tag) > -1) {
			current = i;
			return false;
		}
	});
	if (current < 0) {
		next = 0;
	} else {
		next = tags.length  > (current + 1) ? current + 1 : 0;
		removeAction = "<$action-sendmessage $message=\"tm-remove-tag\" $param=\"\"\"" + tags[current] + "\"\"\"/>";
	}
	tip =
		btnTip ?
		btnTip :
		(lingo("add") + group + " '" + tags[next] + "'" +
			(current < 0 ? "" : " " + lingo("removing") + group + " '" + tags[current] + "'")
		);
	cycle = "<$button class=\"cycletags " + cls + "\" tooltip=\"" + tip + "\">" +
		"<$action-sendmessage $message=\"tm-add-tag\" $param=\"\"\"" + tags[next] + "\"\"\"/>" +
		removeAction +
		(btnText ? btnText : tags[next]) +
		"</$button>";
	if(reset && current > -1) {
		tip = resetTip ?
			resetTip :
			(lingo("remove") + group + " '" + tags[current] + "' ");
		resetCode =
			"<$button message=\"tm-remove-tag\" " +
				"class=\"cycletags-reset " + cls + "\" " +
				"tooltip=\"" + tip + "\" " +
				"param=\"\"\"" + tags[current] + "\"\"\">" +
			(resetText ? resetText : "-") +
			"</$button>";
		if( reset == "after") {
			cycle = cycle + resetCode;
		} else {
			cycle = resetCode + cycle;
		}
	}
	return "<$fieldmangler>" + cycle + "</$fieldmangler>";
};

})();