/*\
	title: $:/plugins/tobibeer/letfilter/let.js
	type: application/javascript
	module-type: filteroperator
	version: 0.6.1 BETA

	a filter to compare and calculate dates, numbers and booleans
\*/

(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
Export our filter function
*/
exports.let = function(source,operator,options) {
	var blanks,date,fieldAt,op,rand,
		operation,type,func,field,
		isOp,isType,isFunc,
		exact = false,
		YMDhms = '',
		add = 0,
		operand = operator.operand,
		result,resCount=0,results = [],
		options = (operator.suffix || '').split(' '),
		isTrue = function (val){
			var result;
			if(val === ''){
				if(blanks){
					result = false;					
				} else {
					return;
				}
			} else {
				if(exact) {
					if(val === '1' || val.toLowerCase() === 'true') {
						result = true;
					} else if(val === '0' || val.toLowerCase() === 'false') {
						result = false;
					} else {
						return;
					}
				} else {
					result = 
						val != '0' &&
						val.toLowerCase() != "false";
				}
			}
			return result;
		};

	$tw.utils.each(options, function(o,index){
		o = $tw.utils.trim(o);
		if(!o){
			return;
		}

		if (o === '!') {
			exact = true;

		} else if (o.charAt(0) === '-' || o.charAt(0) === '+') {
			add = parseInt(o.substr(1,o.length-2));
			if(!isNaN(add)){
				add = o.charAt(0) === '+' ? add : -add;
				YMDhms = o.substr(o.length-1);
			}

		} else if(o === 'BLANKS') {
			blanks = true;

		} else {
			isOp = 0;
			isType = 0;
			isFunc = 0;

			if(!operation){
				$tw.utils.each(['EQ','NEQ','LE','LT','GE','GT'], function(comp,index) {
					if(o === comp) {
						isOp = 1;
						operation = comp;
						return;
					}
				});
			}

			if(!isOp && !type){
				$tw.utils.each(['DATE','INT','NUM','BOOL'], function(t,index) {
					if(o === t) {
						isType = 1;
						type = t;
						return;
					}
				});
			}

			if(!isOp && !isType && !func){
				$tw.utils.each(['SUM','AVG','MIN','MAX','AND','OR','NOR','RANDOM'], function(f,index) {
					if(o === f) {
						isFunc = 1;
						func = f;
						return;
					}
				});
			}

			if(!isOp && !isType && !isFunc){
				field = o; 
			}
		}
	});

	if(func && !type){
		switch(func) {
			case "AND":
			case "OR":
			case "NOR":
				type = "BOOL";
				break;
			case "AVG":
			case "SUM":
			case "MIN":
			case "MAX":
				type = "NUM";
				break;
			case "RANDOM":
				type = "INT";
		}
	}


	if(!type){
		type = 'DATE';
	}

	if(!operation){
		operation = 'EQ';
	}

	if(!field && func != 'RANDOM'){
		field = 'modified';
	}

	if(type === 'DATE'){
		operand = $tw.utils.parseDate(operand);
		if (operand == 'Invalid Date') {
			operand = new Date();
		}
	}

	if(type === 'NUM' || type === 'INT') {
		if(type === 'NUM') {
			op = parseFloat(operand);					
		} else {
			op = parseInt(operand);			
		}

		if(isNaN(op) && !func) {
			console.log("letfilter: operand is not a number!");
			return;
		}
	}

	if(type === 'BOOL') {
		op = operand ? isTrue(operand) : false;
	}

	// Function to convert a date/time to a date integer
	var ok = function(val,title) {

			var res = false;

			if(type == 'DATE'){

				val = $tw.utils.parseDate(val);
				op = new Date(operand);

				if(val == 'Invalid Date') {
					return;
				}

				if(!exact) {
					val.setHours(0,0,0,0);
					op.setHours(0,0,0,0);
				}

				if(YMDhms){
					switch(YMDhms){
						case 'Y':
						case 'y':
							op.setFullYear(op.getFullYear() + add);
							break;
						case 'M':
							op.setFullYear(op.getFullYear(), op.getMonth() + add);

							break;
						case 'D':
						case 'd':
							op.setDate(op.getDate() + add);
							break;
						case 'h':
							op.setHours(op.getHours() + add);
							break;
						case 'm':
							op.setMinutes(op.getMinutes() + add);
							break;
						case 's':
							op.setSeconds(op.setSeconds() + add);
							break;
						default:
							console.log("letfilter error: Don't know how to calculate with: " + YMDhms);
							return;
					}
				}

				val = val.getTime();
				op = op.getTime();

			} else if(type === 'INT' || type === 'NUM') {


				if(val === ''){
					if(blanks){
						val = 0;
					} else {
						return;
					}
				} else {
					if(type === 'INT') {
						val = parseInt(val);
					} else {
						val = parseFloat(val);
					}
				}

				if(isNaN(val)) {
					return;
				}

			//BOOL
			} else {
				val = isTrue(val);
				if(val == undefined) return;
			}

			if(func) {
				res = val;
			} else {

				switch(operation) {
					case 'EQ':
						res = val === op;
						break;
					case 'NEQ':
						res = val !== op;
						break;
					case 'LT':
						res = val < op;
						break;
					case 'LE':
						res = val <= op;
						break;
					case 'GT':
						res = val > op;
						break;
					case 'GE':
						res = val >= op;
						break;
					default:
						return;
				}
			}

			return res;
		};

	source(function(tiddler,title) {

		if(func === "RANDOM"){
			if(!tiddler && title || tiddler && (!field || field && tiddler.fields[field])){
				results.push(title);
			}
		} else {
			if(tiddler && tiddler.fields[field] != undefined) {
				var res = ok(tiddler.fields[field],title);

				if(func && res != undefined) {
					if(undefined == result) {
						switch(func) {
							case "NOR":
								result = !res;
								break;
							case "OR":
							case "AND":
								result = res;
								break;
							case "MIN":
								result = res;
								break;
							default:
								result = 0;
						}
					}

					switch(func) {
						case "AND":
							result = result && res;
							break;
						case "OR":
							result = result || res;
							break;
						case "NOR":
							result = result && !res;
							break;
						case "AVG":
							resCount++;
						case "SUM":
							result += res;	
							break;					
						case "MIN":
							result = Math.min(result,res);
							break;
						case "MAX":
							result = Math.max(result,res);
					}

				} else if(res) {
					results.push(title);
				}
			}
		}
	});

	if(func === "RANDOM") {
		op = isNaN(op) ? 1 : op;
		while(results.length > op) {
			results.splice(Math.floor(Math.random()*results.length),1);
		}
	} else {
		if(func && result != undefined) {
			if(func === "AVG") {
				result = result / resCount;
			}
			if(type === 'NUM'){
				result = parseFloat(result.toFixed(4));
			}
			if(type === "BOOL"){
				result = Boolean(result);
			}
			results.push(result.toString());
		}
	}

	return results;
};

})();