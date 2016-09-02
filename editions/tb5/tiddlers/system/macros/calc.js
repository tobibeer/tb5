/*\
title: $:/.tb/macros/calc
type: application/javascript
module-type: macro

Computes a (Field) value +,-,*,/ a provided value.

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
Information about this macro
*/

exports.name = "calc";

exports.params = [
	{name: "value"},
	{name: "operation"},
	{name: "until"},
	{name: "beyond"},
	{name: "decimals"},
	{name: "tiddler"},
	{name: "by"}
];

/*
Run the macro
*/
exports.run = function(value, operation, until, beyond, decimals, tiddler, by) {
	if(!value) {
		return;
	}
	if("" === operation){
		operation = "+";
	}
	var
		curr,dec,init,initMatch,op,opGiven,r,result,val,
		regInit = /^((?:[0-9]+)|(?:(?:[0-9]*)[\.,\,](?:[0-9]*))){1}[=][>](.*)/mg,
		ops = ["+","-","*","/"];
	initMatch = regInit.exec(value);
	if(initMatch) {
		init = initMatch[1].replace(/[\,]/,".");
		value = initMatch[2];
	}
	curr = parseFloat(
		isNaN(parseFloat(value)) ?
		this.wiki.getTextReference(value, init || "NaN", tiddler || this.getVariable("currentTiddler")) :
		value
	);
	until = parseFloat(until);
	decimals = parseInt(decimals);

	op = operation.charAt(0);
	opGiven = ops.indexOf(op) >= 0;
	if(!opGiven) {
		op = "+";
	}
	initMatch = regInit.exec(by);
	if(initMatch) {
		init = initMatch[1].replace(/[\,]/,".");
		by = initMatch[2];
	}
	val = parseFloat(
		isNaN(parseFloat(by)) ?
		this.wiki.getTextReference(by, init || "NaN", tiddler || this.getVariable("currentTiddler")) :
		by
	);
	if(by === "") {
		val = opGiven ?
			(operation.length < 2 ? 0 : parseFloat(operation.substr(1))) :
			parseFloat(operation);
	}
	if(isNaN(curr)) {
		result = "NaN";
	} else {
		switch (op){
			case "-": result = curr - val; break;
			case "*": result = curr * val; break;
			case "/": result = curr / val; break;
			case "+":
				/* falls through */
			default: result = curr + val;
		}
		if(!isNaN(until)) {
			if (!(
				"+" == op || "*" == op ?
				result <= until :
				result >= until
			)) {
				if("true" == beyond) {
					result = true;
				} else {
					result = until;
				}
			}
			if(beyond && result !== true) {
				result = false;
			}
		}
	}

	if(!isNaN(result)){
		r = result.toString();
		dec = r.indexOf('.');
		if(dec > -1){
			dec = r.substr(dec).length;
			if(
				!isNaN(decimals) && dec > decimals ||
				isNaN(decimals) && dec > 2
			){
				result = result.toFixed(isNaN(decimals) ? 2 : decimals);
			}
		}
	}
	return result.toString();
};

})();