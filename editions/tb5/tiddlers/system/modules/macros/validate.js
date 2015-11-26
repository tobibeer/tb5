/*\
title: $:/.tb/modules/macros/validate.js
type: application/javascript
summary: registers contact form validation
modifier: Tobias Beer
module-type: macro
\*/

(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
contact form validation via <<validate "form-id">>
*/

exports.name = "validate";

exports.params = [
	{ name: "id" }
];

/*
Run the macro
*/
exports.run = function(id) {
    var f = document.getElementById(id);
    f.onsubmit = function() {
		var f = this,
			i = document.getElementById(this.getAttribute("id") + "-response"),
			mail = f._replyto.value,
			body = f.body.value,
			robot = f.answer.value,
			re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

		if (mail == f._replyto.placeholder || !re.test(mail)) {
			alert('Please enter a valid  email address!');
			f._replyto.focus();
			return false;
		}

		if (body === "" ||
			body == f.body.placeholder){
			alert("Please enter a message!");
			f.body.focus();
			return false;
		}

		robot = f.answer.value;
		if (robot === "" ||
			robot == f.answer.placeholder ||
		   	robot.toLowerCase().substr(0,2) != "no") {
			alert("You better be honest or you won't pe able to continue!");
			f.answer.focus();
			return false;
		}

		f.style.display = "none";
		if(i && i.parentNode) {
			i.parentNode.style.display = "block";
		}

		return true;
    };
};

})();