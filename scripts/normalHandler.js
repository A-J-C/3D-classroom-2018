/* File: movementHandler.js
 * Author: mxcm21
 * Date: 05/03/2018
 * Version: 1.0.0
 * Description: This file handles all user input with the model,
 * 		it captures all key presses, and mouse movments, mapping these
 *      to changes in the cameras rotation and position. These changes
 *      are updated by calling the draw method */

var x_pos;
var y_pos;
var z_pos;
var pitch;
var yaw;

var key = {};
var previous = {x:0.0, y:0.0};
var rotate = 0.05;
var movement = 2.0;
var mouseCapture = false;

var modelRotate = {x: 0.0, y:0.0};
var modelRotateFactor = 5;

var doorOpen = false;
var roofOn = true;
var whiteboardHeight = [];
var whiteboardAdjust = 0.2;

function move() {
    /* moves camera based on current keys pressed */
    if (key[38])                        // up arrow key
        pitch += rotate;

    if (key[40])                        // down arrow key
        pitch -= rotate;

    if (key[37])                        // left arrow key
        yaw -= rotate;

    if (key[39])                        // right arrow key
        yaw += rotate;

    if (key[87]) {                      // w means it moves differently depending on rotation
        x_pos += movement * Math.cos(yaw);
        y_pos += movement * Math.sin(pitch);
        z_pos += movement * Math.sin(yaw);
    }

    if (key[65]) {                      // a
        x_pos += movement * Math.sin(yaw);
        z_pos -= movement * Math.cos(yaw);
    }

    if (key[83]) {                      // s
        x_pos -= movement * Math.cos(yaw);
        y_pos -= movement * Math.sin(pitch);
        z_pos -= movement * Math.sin(yaw);
    }

    if (key[68]) {                      // d
        x_pos -= movement * Math.sin(yaw);
        z_pos += movement * Math.cos(yaw);
    }

    if (key[82])                        // r key pressed we want to go vertically up
        y_pos += movement;

    if (key[70])                        // f key pressed we want to go vertically down
        y_pos -= movement;

    if (key[79])                        // on o pressed return to original camera view
        reset();

	/* DOOR, BOARDS and OTHER CONTROLLERS */

    if (key[80])                        // on p pressed toggle door
        doorOpen = (doorOpen) ? false : true;

    if (key[84]) {                       // on t pressed toggle roof
        roofOn = (roofOn) ? false : true;
        if(!roofOn)                     // if roof is off
            overview();                 // set camera to overview
    }

    if (key[55] && whiteboardHeight[0] > -2.2)      // if 7 pressed and not too low
        whiteboardHeight[0] -= whiteboardAdjust;    // lower first white board

    if (key[56] && whiteboardHeight[0] < 6.2)       // if 8 pressed and not too high
        whiteboardHeight[0] += whiteboardAdjust;    // raise first white board

    if (key[57] && whiteboardHeight[1] > -2.2)      // if 9 pressed
        whiteboardHeight[1] -= whiteboardAdjust;    // lower second white board

    if (key[48] && whiteboardHeight[1] < 6.2)       // if 0 pressed
        whiteboardHeight[1] += whiteboardAdjust;    // raise second white board

    /* LIGHTING TOGGLES */
	if (key[49])						// on 1 pressed
		toggleAmbientLight();			// toggle ambience

	if (key[50])						// on 2 pressed
		toggleDirectionalLight(); 		// toggle directional

	if (key[51])						// on 3 pressed
		togglePointLight(2); 			// toggle point light 2

	if (key[52])						// on 4 pressed
		togglePointLight(1); 			// toggle point light 1

	if (key[53])						// on 5 pressed
		togglePointLight(0); 			// toggle point light 0

	if (key[54])						// on 6 pressed
		toggleClassroom();  			// toggle classroom off

	if (key[71])						// on t pressed
		toggleTextures(); 	 			// toggle textures

	updateCamera();
}

function makeMove() {
	/* runs different mave depending on mode */
	if(objectMode)
		objectMove();
	else
		move();                         // make move
}

function reset() {
    /* to reset camera position */
	x_pos = 12.341;
	y_pos = 9.137;
	z_pos = -27.507;
	pitch = -0.140;
	yaw = 1.830;
	modelRotate = {x: 0.0, y:0.0};
    whiteboardHeight[0] = 3;
    whiteboardHeight[1] = -2;
    updateCamera();
}

function overview() {
    /* change camera to birds eye view */
	x_pos = -79.372;
	y_pos = 37.305;
	z_pos = -25.208;
	pitch = -0.440;
	yaw = 0.380;
	modelRotate = {x: 0.0, y:0.0};
	updateCamera();
}

function updateCamera() {
	/* updates the view matrix */
	viewMatrix.setLookAt(x_pos, y_pos, z_pos,
        x_pos + Math.cos(yaw) * Math.cos(pitch),                                // calculate look at variables
        y_pos + Math.sin(pitch),
        z_pos + Math.sin(yaw) * Math.cos(pitch), 0, 1, 0);

    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);              // pass to uniform variables
}

function toggleTextures() {
	/* toggles textures on and off */
	if(globalTextures) {
		gl.uniform1i(u_globalTextures, false);
		globalTextures = false;
	} else {
		gl.uniform1i(u_globalTextures, true);
		globalTextures = true;
	}
}

function p() {
    /* returns corrent coords to user for bug checking */
    return "\nx_pos = "+x_pos.toFixed(3)+";\n" +
    "   y_pos = "+y_pos.toFixed(3)+";\n" +
    "   z_pos = "+z_pos.toFixed(3)+";\n" +
    "   pitch = "+pitch.toFixed(3)+";\n" +
    "   yaw = "+yaw.toFixed(3)+";\n";
}

document.onkeydown = function(ev) {
	$(".fader").blur(); 							    // click off range selector
    if (ev.keyCode == 17)  {                            // if CTRL clicked toggle mode
        if(objectMode)
            $("#toggleNormal").click();
        else {
            $("#toggleObject").click();
        }
    } else {
    	key[ev.keyCode] = true;                         // set key press
        makeMove();                                     // make move
    }
};

document.onkeyup = function(ev) {
    if (ev.keyCode != 16)
        key[ev.keyCode] = false;                        // set key press to false
};


$(document).ready(function() {                          // wait till document is fully loaded

	/* Following code allows a "mouse grab" to rotate camera */
    document.getElementById("canv").onmousedown = function(ev) {    // mouse down on canvas
        mouseCapture = true;
		$("body").addClass("binded");        		   // set mouse to crosshair
		$("#canv").addClass("binded");
		$("html").addClass("binded");
		previous = {x:ev.clientX, y:ev.clientY};       // update previous
    };

	document.onmouseup = function(ev) {    			  // mouse up
        mouseCapture = false;
		for (k in key)                         		  // reset all key presses to false
                key[k] = false;
        $("body").removeClass("binded");    		  // set mouse back to normal
		$("#canv").removeClass("binded");
		$("html").removeClass("binded");
    };

	document.getElementById("canv").onmousemove = function(ev) {    // mouse moves on canvas
        if (mouseCapture) {                          				// check if mouse is captured
            var deltaX = ev.clientX - previous.x;                   // get difference in x
            var deltaY = ev.clientY - previous.y;                   // get difference in y
			previous = {x:ev.clientX, y:ev.clientY};                // update previous

			if (objectMode) {										// if in object mode
				key[38] = (deltaX > 0);								// simulate key presses for object rotation
				key[40] = (deltaX < 0);
				key[39] = (deltaY > 0);
				key[37] = (deltaY < 0);
				makeMove(); 										// move
			} else {												// if in normal mode
				modelRotate.x += deltaY/modelRotateFactor;          // rotate whole model in x
				modelRotate.y += deltaX/modelRotateFactor;

				setAllLights();									    // update light positions
			}
		}
    };

	/* Binds scroll wheel to zoom in/out */
	$("#canv").on('mousewheel', function(ev) {
		if(ev.originalEvent.deltaY < 0)
			key[87] = true;
		else
			key[83] = true;

		makeMove();
    		key[87] = false;                                        // turn keys back off
		key[83] = false;
	});
});
