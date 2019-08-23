/* File: lightHandler.js
 * Author: mxcm21
 * Date: 05/03/2018
 * Version: 1.0.0
 * Description: Contains methods to change all lighting in the classroom */

var directScalar_val = 0.5;
var prevDiff = 0.5;
var pointScalar_val = 0.5;
var ambient = false;
var directional = false;
var pointOn = [0.0, 0.0, 0.0];
var pointLightVal = [0.0, 0.0, 0.0];
var classroomTurningOn = false;
var classroomTurningOff = false;
var classroomToggle = true;
var projectorOn = false;

function toggleAmbientLight() {
	/* toggles ambience on and off */
	if(ambient) {
		gl.uniform3f(u_AmbientLight, 0.0, 0.0, 0.0);
		ambient = false;
	} else {
		gl.uniform3f(u_AmbientLight, 0.25, 0.25, 0.25);
		ambient = true;
	}
}

function toggleDirectionalLight() {
	/* toggles directional light on and off */
	if(directional) {
		prevDiff = directScalar_val;
		directScalar_val = 0.0;
		updateDirectLighting();
		directional = false;
	} else {
		directScalar_val = prevDiff;
		directional = true;
		updateDirectLighting();
	}
	updateDirectLighting();
}

function togglePointLight(i) {
	/* toggles provided point light light on and off */
	pointOn[i] = (pointOn[i] >= 1.0) ? false : true;
	pointLightVal[i] = (pointLightVal[i] >= 0.75) ? 0.1 : 0.75;
	gl.uniform1f(u_pointLightOn[i], pointOn[i]);
}

function toggleClassroom() {
	/* turns all lights off and moves whiteboards down */
	if (classroomToggle) {
		classroomTurningOff = true;
		classroomTurningOn = false;
	} else {
		classroomTurningOn = true;
		classroomTurningOff = false;
		projectorOn = false;
	}

	classroomToggle = (classroomToggle) ? false : true;
}

function setAllLights() {
	/* so taht point lights rotate witht the model */
	for (var i = 0; i < numPoints; i++) {
		/* where they should be if not rotated */
		var currX = 0;
		var currY = 25;
		var currZ = 15 - 15 * i;

		var modX = modelRotate.x  * Math.PI/180;
		var modY = modelRotate.y * Math.PI/180;

		/* if model is rotated we also need to rotate the lights */
		rotatedY = currY * Math.cos(modX) - currZ * Math.sin(modX);
		rotatedZ = currZ * Math.cos(modX) + currY * Math.sin(modX);
		rotatedX = rotatedZ * Math.sin(modY) + currX * Math.cos(modY);
		rotatedZ = rotatedZ * Math.cos(modY) + currX * - Math.sin(modY);

		var pLightDirection = new Vector3([rotatedX, rotatedY, rotatedZ]);      // set light direction
		gl.uniform3fv(u_pLightPositions[i], pLightDirection.elements);
	}
}

function updateDirectLighting() {
	/* sets the value of diffuse lighting */
	if(directional)																// check directional lighting is on
		gl.uniform1f(u_directScalar, directScalar_val); 						// set direct lighting value
}

function updatePointLighting() {
	/* sets the value of point lighting */
	gl.uniform1f(u_pointScalar, pointScalar_val); 								// set point lighting value
}

/* wait till document is fully loaded */
$(document).ready(function() {
	$("#directFader").on("input", function() {
		directScalar_val = $(this).val();
		updateDirectLighting();
	});

	$("#pointFader").on("input", function() {
		pointScalar_val = $(this).val();
		updatePointLighting();
	});
});
