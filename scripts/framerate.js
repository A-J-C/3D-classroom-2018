/* File: framerate.js
 * Author: mxcm21
 * Date: 05/03/2018
 * Version: 1.0.0
 * Description: This file displays the FPS count to the user */

var totFPS = 60.0; 										// stores fps count
var noFPS = 1.0;
var then = Date.now();

function newFPS() {
	/* adds new fps val to totFPS */
	var now = Date.now();
	totFPS += 1000 / (now - then);
	noFPS++;
	then = now;
}

/* so FPS count is only updated every half second (easier to look at) */
window.setInterval(function(){
    var avgFPS = totFPS / noFPS; 							// get average
	noFPS = 1; 												// reset number
	totFPS = avgFPS; 										// reset initial value of totFPS

	var fps = Math.min(avgFPS, 60).toFixed(1);
	$("#rate").text(fps);    								// set value of rate to the current average FPS capped at 60
}, 1000);
