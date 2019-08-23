/* File: objects.js
 * Author: mxcm21
 * Date: 05/03/2018
 * Version: 1.0.0
 * Description: This file defines every object in the classroom.
 *  	All objects are made using boxes. */

/* colours objects use and their highlighted version */
var chairLegCol = [33, 8, 8];
var h_chairLegCol = [99, 82, 82];
var seatCol = [0, 72, 112];
var h_seatCol = [132, 166, 186];
var greenSeatCol = [0, 76, 0];
var h_greenSeatCol = [129, 166, 129];
var tableLegCol = [65, 75, 86];
var h_tableLegCol = [99, 114, 131];
var tableTopCol = [244, 164, 96];
var h_tableTopCol = [248, 201, 160];
var floorCol = [59, 36, 66];
var wallCol = [96, 121, 121];
var railCol = [205, 175, 149];
var windowCol = [153, 204, 255];
var woodCol = [85, 58, 43];
var h_woodCol = [136, 117, 106];
var metalCol = [98, 109, 123];
var h_metalCol = [160, 167, 175];
var sepCol = [68, 76, 86];
var h_sepCol = [105, 111, 119];
var woodDeskCol = [131, 89, 89];
var woodHandleCol = [47, 32, 23];
var h_woodHandleCol = [88, 76, 69];
var woodSepCol = [67, 54, 46];
var h_woodSepCol = [85, 74, 66];
var projCol = [66, 0, 105];
var white = [255, 255, 255];
var black = [0, 0, 0];
var h_grey = [76, 76, 76];

function createChair(highlight = false, green = false) {
    /* define colours in RGB */
	var legs = (highlight && objectMode) ? h_chairLegCol : chairLegCol;
	var seat = (highlight && objectMode) ? h_seatCol : seatCol;

	if(green)
		seat = (highlight && objectMode) ? h_greenSeatCol : greenSeatCol;

	gl.uniform1i(u_isTextured, true); 											// we want to texture chair leather
	gl.bindTexture(gl.TEXTURE_2D, textures.chair.texture); 						// set texture to wood
	/* creates a chair */
	setColour(seat); 															// set colour
    /* chair base */
    pushMatrix(modelMatrix);                                               // add to stack
    modelMatrix.scale(2.0, 0.5, 2.0);                                           // set up the correct scale
    drawbox();					                              					// draw a box
    modelMatrix = matrixStack.pop();                                          	// pop from stack

    /* chair back */
    pushMatrix(modelMatrix);
    modelMatrix.translate(0, 1.25, -0.75);
    modelMatrix.scale(2.0, 2.0, 0.5);
    drawbox();
    modelMatrix = matrixStack.pop();

	gl.uniform1i(u_isTextured, false); 											// no longer texturing

	setColour(legs); 															// set colour
    /* back right chair leg */
    pushMatrix(modelMatrix);
    modelMatrix.translate(0.83, -1.0, -0.82);
    modelMatrix.scale(0.35, 1.55, 0.35);
    drawbox();
    modelMatrix = matrixStack.pop();

    /* back left chair leg */
    pushMatrix(modelMatrix);
    modelMatrix.translate(-0.83, -1.0, -0.82);
    modelMatrix.scale(0.35, 1.55, 0.35);
    drawbox();
    modelMatrix = matrixStack.pop();

    /* front right chair leg */
    pushMatrix(modelMatrix);
    modelMatrix.translate(0.83, -1.0, 0.82);
    modelMatrix.scale(0.35, 1.55, 0.35);
    drawbox();
    modelMatrix = matrixStack.pop();

    /* front left chair leg */
    pushMatrix(modelMatrix);
    modelMatrix.translate(-0.83, -1.0, 0.82);
    modelMatrix.scale(0.35, 1.55, 0.35);
    drawbox();
    modelMatrix = matrixStack.pop();
}

function createTable(highlight = false) {
    /* define colours in RGB */
	var legs = (highlight && objectMode) ?  h_tableLegCol : tableLegCol;
	var top = (highlight && objectMode) ?  h_tableTopCol : tableTopCol;

	gl.uniform1i(u_isTextured, true); 											// we want to texture table top
	gl.bindTexture(gl.TEXTURE_2D, textures.wood.texture); 						// set texture to wood

	setColour(top); 															// set colour
    /* table top */
    pushMatrix(modelMatrix);                                                    // add to stack
	modelMatrix.translate(0, 0.5, 0);
    modelMatrix.scale(7.0, 0.25, 5.0);                                           // set up the correct scale
    drawbox();					                              					// draw a box
    modelMatrix = matrixStack.pop();                                          	// pop from stack

	setColour(legs); 															// set colour
    /* back right table leg */
    pushMatrix(modelMatrix);
    modelMatrix.translate(2.75, -0.65, -2.15);
    modelMatrix.scale(0.35, 2.25, 0.35);
    drawbox();
    modelMatrix = matrixStack.pop();

    /* back left table leg */
    pushMatrix(modelMatrix);
    modelMatrix.translate(-2.75, -0.65, -2.15);
    modelMatrix.scale(0.35, 2.25, 0.35);
    drawbox();
    modelMatrix = matrixStack.pop();

    /* front right table leg */
    pushMatrix(modelMatrix);
    modelMatrix.translate(2.75, -0.65, 2.15);
    modelMatrix.scale(0.35, 2.25, 0.35);
    drawbox();
    modelMatrix = matrixStack.pop();

    /* front left table leg */
    pushMatrix(modelMatrix);
    modelMatrix.translate(-2.75, -0.65, 2.15);
    modelMatrix.scale(0.35, 2.25, 0.35);
    drawbox();
    modelMatrix = matrixStack.pop();

	gl.uniform1i(u_isTextured, false); 											// no longer texturing
}

function createFloor(roof = false) {
	var alpha = 1;
    var floor = floorCol;

	if (roof)
		floor = white;

    if($("#transparency").is(":checked")) {                                     // for transparency
        alpha = 0.2;
        floor = white;                                                			// set everything to white
    }

	setColour(floor, alpha); 													// set colour
	pushMatrix(modelMatrix);
	modelMatrix.translate(0.5, -1.78, 0);
	modelMatrix.scale(32.5, 0.01, 55.0);
    drawbox();
	modelMatrix = matrixStack.pop();
}

function createWall(length = 32.5, height = 14, skirting = true, top = true) {
	/* Draws a wall with skirting board, parameters have default values
	 * so that they don't always have to be provided for the "normal" case */

	var alpha = 1;
    var walls = wallCol;

    if($("#transparency").is(":checked")) {                                     // for transparency
        alpha = 0.2;
        walls = white; 															// set everything to white
    }

	var rail = railCol;
	var move = (14 - height)/2;

	if(top == false)
		move = -move;

	setColour(walls, alpha); 													// set colour
	/* Main wall */
	pushMatrix(modelMatrix);
	modelMatrix.translate(0, move, 0); 											// so it is all at the top
	modelMatrix.scale(length, height, 0.01);
	drawbox();
	modelMatrix = matrixStack.pop();

	setColour(rail, alpha); 													// set colour
	if (skirting) {
		/* skirting board */
		pushMatrix(modelMatrix);
		modelMatrix.translate(0, -6.75, 0.25);
		modelMatrix.scale(length, 0.5, 0.5);
		drawbox();
		modelMatrix = matrixStack.pop();
	}

	if (top) {
		/* ceiling decoratiion border */
		for (var i = 0; i < 4; i ++) {
			pushMatrix(modelMatrix);
			modelMatrix.translate(0, 6.5+(0.125*i), 0.125+(0.125*i) + 0.01);
			modelMatrix.scale(length, 1-(0.25*i), 0.25);
			drawbox();
			modelMatrix = matrixStack.pop();
		}
	}
}

function createWindow() {
	/* makes transparent window */
	var alpha = 0.2;
	var winCol = windowCol;
	var winShelf = white;

	pushMatrix(modelMatrix);
	modelMatrix.translate(-8.15, 0, 0);

		setColour(winCol, alpha); 													// set colour
		/* main window */
		pushMatrix(modelMatrix);
		modelMatrix.scale(10.3, 6, 0.01);
		drawbox();
		modelMatrix = matrixStack.pop();

		setColour(winShelf); 														// set colour
		/* windowsill */
		pushMatrix(modelMatrix);
		modelMatrix.translate(0, -3, 0);
		modelMatrix.scale(10.3, 0.5, 1);
		drawbox();
		modelMatrix = matrixStack.pop();

		/* vertical bars */
		for (var i = 0; i < 3; i++) {
			pushMatrix(modelMatrix);
			modelMatrix.translate(5.03*(i - 1), 0, 0);
			modelMatrix.scale(0.25, 6, 0.25);
			drawbox();
			modelMatrix = matrixStack.pop();
		}

		/* horizontal bars */
		for (var i = 0; i < 2; i++) {
			pushMatrix(modelMatrix);
			modelMatrix.translate(0, 3*i, 0);
			modelMatrix.scale(10.3, 0.25, 0.25);
			drawbox();
			modelMatrix = matrixStack.pop();
		}

	modelMatrix = matrixStack.pop();
}

function createWindowWall() {
	/* Code to make wall with windows in */

	/* we want 4 windows */
	for (var i = 0; i < 3; i++) {
		pushMatrix(modelMatrix);
		modelMatrix.translate(-16.3*i, 0, 0);
			/* left part of wall */
			createWall(6);

			/* top wall part (no skirting board) */
			pushMatrix(modelMatrix);
			modelMatrix.translate(-8.25, 0, 0);
			createWall(10.5, 4, false);
			modelMatrix = matrixStack.pop();

			/* bottom wall part (no top board) */
			pushMatrix(modelMatrix);
			modelMatrix.translate(-8.25, 0, 0);
			createWall(10.5, 4, true, false);
			modelMatrix = matrixStack.pop();

			/* right part of wall */
			pushMatrix(modelMatrix);
			modelMatrix.translate(-16.3, 0, 0);
			createWall(6);
			modelMatrix = matrixStack.pop();

			/* window */
			createWindow();
		modelMatrix = matrixStack.pop();
	}

	pushMatrix(modelMatrix);
	modelMatrix.translate(-51.95, 0, 0);
	createWall(0.1);
	modelMatrix = matrixStack.pop();

}

function createBookcase(highlight = false) {
	/* bookacase at back of classroom */
	var wood = (highlight && objectMode) ? h_woodCol : woodCol;

	gl.uniform1i(u_isTextured, true); 											// we want to texture wood
	gl.bindTexture(gl.TEXTURE_2D, textures.wood.texture); 						// set texture to wood

	setColour(wood); 												// set colour
	for (var i = 0; i < 4; i++) {
		/* base of shelf */
		pushMatrix(modelMatrix);
		modelMatrix.translate(0, 2.5*i - 1.25 ,0);
		modelMatrix.scale(7.5, 0.05, 3);
		drawbox();
		modelMatrix = matrixStack.pop();

		/* left side of shelf */
		pushMatrix(modelMatrix);
		modelMatrix.translate(-3.75, 2.5*i ,0);
		modelMatrix.scale(0.05, 2.5, 3);
	    drawbox();
		modelMatrix = matrixStack.pop();

		/* right side of shelf */
		pushMatrix(modelMatrix);
		modelMatrix.translate(3.75, 2.5*i ,0);
		modelMatrix.scale(0.05, 2.5, 3);
	    drawbox();
		modelMatrix = matrixStack.pop();
	}

	/* top of case */
	pushMatrix(modelMatrix);
	modelMatrix.translate(0, 8.75 ,0);
	modelMatrix.scale(7.5, 0.05, 3);
	drawbox();
	modelMatrix = matrixStack.pop();

	/* back of case */
	pushMatrix(modelMatrix);
	modelMatrix.translate(0, 3.75, -1.5);
	modelMatrix.scale(7.5, 10, 0.05);
	drawbox();
	modelMatrix = matrixStack.pop();

	/* add books to the shelf */
	setColour(white);
	for (var i = 0; i < 4; i++) {
		gl.bindTexture(gl.TEXTURE_2D, bookTextures[i]); 					// set to different book type
		pushMatrix(modelMatrix);
		modelMatrix.translate(0, 2.5*i,-0.25);
		modelMatrix.scale(7.5, 2.45, 2.5);
		drawbox();
		modelMatrix = matrixStack.pop();
	}

	gl.uniform1i(u_isTextured, false); 											// no longer texturing
}

function createCabinet(brown = false, highlight = false) {
	/* for closed cabinets at back of classroom */
	var metal = (highlight && objectMode) ? h_metalCol : metalCol;
	var handle = (highlight && objectMode) ? h_grey : black;
	var separator = (highlight && objectMode) ? h_sepCol : sepCol;

	if (brown) {
		metal = (highlight && objectMode) ? h_woodCol : woodDeskCol;
	    handle = (highlight && objectMode) ? h_woodHandleCol : woodHandleCol;
	    separator = (highlight && objectMode) ? h_woodSepCol : woodSepCol;
	} else {
		gl.uniform1i(u_isTextured, true); 											// we want to texture metal
		gl.bindTexture(gl.TEXTURE_2D, textures.metal.texture);
	}

	for (var i = 0; i < 3; i++) {
		/* case */
		setColour(metal); 												// set colour
		pushMatrix(modelMatrix);
		modelMatrix.translate(0, 2.6*i, -1.5);
		modelMatrix.scale(5, 2.5, 2.5);
		drawbox();
		modelMatrix = matrixStack.pop();

		/* handle */
		setColour(handle); 												// set colour
		pushMatrix(modelMatrix);
		modelMatrix.translate(0, 2.6*i, -0.2);
		modelMatrix.scale(1, 0.1, 0.1);
		drawbox();
		modelMatrix = matrixStack.pop();

		/* separator */
		setColour(separator); 											// set colour
		pushMatrix(modelMatrix);
		modelMatrix.translate(0, 2.6*i + 1.3, -1.5);
		modelMatrix.scale(5, 0.1, 2.5);
		drawbox(separator);
		modelMatrix = matrixStack.pop();
	}

	gl.uniform1i(u_isTextured, false);
}

function createDoor() {
    door = woodCol;

	gl.uniform1i(u_isTextured, true); 											// we want to texture door
	gl.bindTexture(gl.TEXTURE_2D, textures.door.texture);
	setColour(door); 															// set colour
	pushMatrix(modelMatrix);
	modelMatrix.translate(0.5, -1.78, 0);
	modelMatrix.scale(7.5, 10, 0.01);
    drawbox();
	modelMatrix = matrixStack.pop();

	gl.uniform1i(u_isTextured, true); 											// we want to texture door handle
	gl.bindTexture(gl.TEXTURE_2D, textures.metal.texture);
	setColour(metalCol);
	pushMatrix(modelMatrix);
	modelMatrix.translate(3.25, -2, 0);
	modelMatrix.scale(0.25, 0.5, 0.5);
    drawbox();
	modelMatrix = matrixStack.pop();

	pushMatrix(modelMatrix);
	modelMatrix.translate(3, -2, -0.3);
	modelMatrix.scale(0.75, 0.5, 0.25);
    drawbox();
	modelMatrix = matrixStack.pop();

	pushMatrix(modelMatrix);
	modelMatrix.translate(3, -2, 0.3);
	modelMatrix.scale(0.75, 0.5, 0.25);
    drawbox();
	modelMatrix = matrixStack.pop();

	gl.uniform1i(u_isTextured, false);
}

function createDoorFrame() {
	/* creates textured door frame */
	pushMatrix(modelMatrix);
	modelMatrix.translate(-15.74, 4.95, 25.25);

		setColour(h_sepCol);
		gl.uniform1i(u_isTextured, true); 											// we want to texture door frame
		gl.bindTexture(gl.TEXTURE_2D, textures.wood.texture);
		/* left part of frame */
		pushMatrix(modelMatrix);
		modelMatrix.translate(0, -1.7, -0.125);
		modelMatrix.scale(0.25, 10, 0.25);
	    drawbox();
		modelMatrix = matrixStack.pop();

		/* top part of frame */
		pushMatrix(modelMatrix);
		modelMatrix.translate(0, 3.4, -4);
		modelMatrix.scale(0.25, 0.25, 8.0);
	    drawbox();
		modelMatrix = matrixStack.pop();

		/* right part of frame */
		pushMatrix(modelMatrix);
		modelMatrix.translate(0, -1.7, -7.875);
		modelMatrix.scale(0.25, 10, 0.25);
	    drawbox();
		modelMatrix = matrixStack.pop();

		gl.uniform1i(u_isTextured, false);
	modelMatrix = matrixStack.pop();
}

function createWhiteBoardFrame() {
	/* frame the two whiteboards go in */
	setColour(metalCol);
	gl.uniform1i(u_isTextured, true); 											// we want to texture metal
	gl.bindTexture(gl.TEXTURE_2D, textures.metal.texture);

	for(var i = 0; i < 2; i ++) {
		pushMatrix(modelMatrix);
		modelMatrix.translate(12 - 24*i, 4.95, 27);
		modelMatrix.scale(1, 12.5, 1);
		drawbox();
		modelMatrix = matrixStack.pop();
	}

	gl.uniform1i(u_isTextured, false);
}

function createWhiteboard() {
	/* draws a whiteboard */
	setColour(white);

	/* main board */
	pushMatrix(modelMatrix);
	modelMatrix.translate(0, 3, 27.3);
	modelMatrix.scale(23, 4, 0.1);
	drawbox();
	modelMatrix = matrixStack.pop();

	/* pen tray */
	setColour(black);
	pushMatrix(modelMatrix);
	modelMatrix.translate(0, 1, 27);
	modelMatrix.scale(23, 0.25, 0.5);
	drawbox();
	modelMatrix = matrixStack.pop();
}

function createTeacherTable(highlight = false) {
	/* makes teacher's desk reusing cabinet */
	var legs = (highlight && objectMode) ? h_woodHandleCol : woodHandleCol;
	var top = (highlight && objectMode) ? h_woodSepCol : woodSepCol;

	gl.uniform1i(u_isTextured, true); 											// we want to texture table top
	gl.bindTexture(gl.TEXTURE_2D, textures.wood.texture); 						// set texture to wood

	/* cabinet part */
	pushMatrix(modelMatrix);
	modelMatrix.translate(5, 0, 0);
	modelMatrix.scale(0.5, 0.4, 2); 							// change it's dimensions
	createCabinet(true, highlight); 							// create a brown cabinet
	modelMatrix = matrixStack.pop();

	/* table top */
	setColour(top);
	pushMatrix(modelMatrix);
	modelMatrix.translate(7.5, 2.7, -3);
	modelMatrix.scale(7.5, 0.25, 5);
	drawbox();
	modelMatrix = matrixStack.pop();

	/* front leg */
	setColour(legs);
	pushMatrix(modelMatrix);
	modelMatrix.translate(11, 1.15, -5.35);
	modelMatrix.scale(0.35, 3.25, 0.35);
	drawbox();
	modelMatrix = matrixStack.pop();

	/* back leg */
	setColour(legs);
	pushMatrix(modelMatrix);
	modelMatrix.translate(11, 1.15, -0.7);
	modelMatrix.scale(0.35, 3.25, 0.35);
	drawbox();
	modelMatrix = matrixStack.pop();

	gl.uniform1i(u_isTextured, false); 											// no longer texturing
}

function createTeacherChair(highlight = false) {
	/* chair for the teacher, normal chair in different colour */
	createChair(highlight, true); 													// true to signify change colour
}

function createLight() {
	/* adds light */
	for (var i = 0; i < 3; i++) {
		setColour(white, pointLightVal[i]);
		pushMatrix(modelMatrix);
		modelMatrix.translate(0, 12.1, 15 - 15*i);
		modelMatrix.scale(10.0, 0.25, 2.0);
		drawbox();
		modelMatrix = matrixStack.pop();
	}
}

function createProjectorScreen() {
	/* small screen to tecture for projection */
	var projColour = (projectorOn) ? white : wallCol;

	if (projectorOn) {
		gl.uniform1f(u_projector, 1.0);
		gl.uniform1i(u_isTextured, true); 										// we want to texture with slide
		gl.bindTexture(gl.TEXTURE_2D, textures.slide.texture);
	}

	setColour(projColour);
	pushMatrix(modelMatrix);
	modelMatrix.translate(0.5, 7, 27.4);
	modelMatrix.scale(15.0, 7, 0.01);
	drawbox();
	modelMatrix = matrixStack.pop();

	gl.uniform1f(u_projector, 0.0);
	gl.uniform1i(u_isTextured, false);
}

function createProjector() {
	/* hangs a projector from the ceiling */
	pushMatrix(modelMatrix);
	modelMatrix.translate(0.5, 11.2, 12.5);

		pushMatrix(modelMatrix);
		setColour(black);
		modelMatrix.scale(0.5, 2, 0.5);
		drawbox();
		modelMatrix = matrixStack.pop();

		setColour(projCol);
		pushMatrix(modelMatrix);
		modelMatrix.translate(0, -1, 0);
		modelMatrix.rotate(10, 1, 0, 0);
		modelMatrix.scale(3.0, 0.5, 3.0);
		drawbox();
		modelMatrix = matrixStack.pop();
	modelMatrix = matrixStack.pop();
}

function drawbox() {
    /* draws a box, fundamental for building everything else */
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);            // pass model matrix
	g_normalMatrix.setInverseOf(modelMatrix);                                   // calculate normal
    g_normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, g_normalMatrix.elements);        // pass it to variable
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);                      // draw the box
}

function setColour(col, alpha = 1.0) {
	/* updates colour of box about to be drawn */
	gl.uniform4f(u_Colour, col[0]/255.0, col[1]/255.0, col[2]/255.0, alpha);	// change colour
}
