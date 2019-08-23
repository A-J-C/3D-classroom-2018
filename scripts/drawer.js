/* File: drawer.js
 * Author: mxcm21
 * Date: 05/03/2018
 * Version: 1.0.0
 * Description: This file draws all objects in the classroom.
 * 		it initialises the buffers for the cude and then builds
 * 		chairs, tables, etc. using a for loop. */

var doorRotate = 90;

function modifyMatrix(modelMatrix, data) {
	/* given data and a model matrix rotates and translates it */
	modelMatrix.translate(data.move_x, data.move_y, data.move_z);       // translate object
	modelMatrix.rotate(data.angle_x, 1, 0, 0);                          // rotate on x
	modelMatrix.rotate(data.angle_y, 0, 1, 0);                          // rotate on y
}


function draw() {
	/* uses request animation frame to keep drawing itself */
	requestAnimationFrame(draw);

	newFPS(); 																	// for framerate function
	/* code to draw */

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);                        // clear buffers

	pushMatrix(modelMatrix);
		modelMatrix.rotate(modelRotate.y, 0, 1, 0); 							// rotate whole model on y
		modelMatrix.rotate(modelRotate.x, 1, 0, 0); 							// rotate whole model on x

		/* chairs and tables */
		for (var i = 0; i < 27; i++) {
			data = objects[i];                                                  // get data of object
			pushMatrix(modelMatrix);
			modifyMatrix(modelMatrix, data);									// translate and rotate
			if (i % 9 < 6)
				createChair(data.highlight);                                    // add highlight
			else
				createTable(data.highlight);

			modelMatrix = matrixStack.pop();
		}

		/* add bookcase */
		pushMatrix(modelMatrix);
		modifyMatrix(modelMatrix, objects[27]);									// translate and rotate
		createBookcase(objects[27].highlight);
		modelMatrix = matrixStack.pop();

		/* add cabinets */
		for (var i = 28; i < 30; i++) {
			pushMatrix(modelMatrix);
			modifyMatrix(modelMatrix, objects[i]);								// translate and rotate
			createCabinet(false, objects[i].highlight);
			modelMatrix = matrixStack.pop();
		}

		/* create whiteboards */
		createWhiteBoardFrame(); 												// create frame

		for(var i = 0; i < 2; i++) {
			gl.uniform1i(u_isTextured, true); 											// we want to texture board
			gl.bindTexture(gl.TEXTURE_2D, boardTextures[i]);
			pushMatrix(modelMatrix);
				modelMatrix.translate(0, whiteboardHeight[i], -0.6*i);
				createWhiteboard();
			modelMatrix = matrixStack.pop();
		}
		gl.uniform1i(u_isTextured, false);

		/* create teacher desk and chair */
		pushMatrix(modelMatrix);
		modifyMatrix(modelMatrix, objects[30]);								// translate and rotate
		createTeacherTable(objects[30].highlight);
		modelMatrix = matrixStack.pop();

		pushMatrix(modelMatrix);
		modifyMatrix(modelMatrix, objects[31]);								// translate and rotate
		createTeacherChair(objects[31].highlight);
		modelMatrix = matrixStack.pop();

		/* add projector */
		createProjectorScreen();
		createProjector();

		/* floor */
		gl.uniform1i(u_isTextured, true); 											// we want to texture floor
		gl.bindTexture(gl.TEXTURE_2D, textures.floor.texture);
		createFloor();
		gl.uniform1i(u_isTextured, false);

		if (roofOn) {
			/* roof (uses same function) */
			pushMatrix(modelMatrix);
			modelMatrix.translate(0, 14, 0);
			createFloor(true);
			modelMatrix = matrixStack.pop();
		}

		/* back wall */
		pushMatrix(modelMatrix);
		modelMatrix.translate(0.5, 5.2, -27.5);
		createWall();
		modelMatrix = matrixStack.pop();

		/* front wall */
		pushMatrix(modelMatrix);
		modelMatrix.translate(0.5, 5.2, 27.5);
		modelMatrix.rotate(180, 0, 1, 0);
		createWall();
		modelMatrix = matrixStack.pop();

		/* lights */
		createLight();

		if(roofOn) {															// turning roof off also turns off side wall
			/* side wall with door */
				/* door */
				pushMatrix(modelMatrix);
				modelMatrix.translate(-15.74, 5, 25);
				modelMatrix.rotate(doorRotate, 0, 1, 0);                        // allows door to be opened and closed
				modelMatrix.translate(3.25, 0, 0);
				createDoor();
				modelMatrix = matrixStack.pop();

				/* door frame */
				createDoorFrame();

				/* right wall part */
				pushMatrix(modelMatrix);
				modelMatrix.translate(-15.75, 5.2, -5);
				modelMatrix.rotate(90, 0, 1, 0);
				createWall(45);
				modelMatrix = matrixStack.pop();

				/* left wall part */
				pushMatrix(modelMatrix);
				modelMatrix.translate(-15.75, 5.2, 26.25);
				modelMatrix.rotate(90, 0, 1, 0);
				createWall(2.5);
				modelMatrix = matrixStack.pop();

				/* top wall part (no skirting board) */
				pushMatrix(modelMatrix);
				modelMatrix.translate(-15.75, 5.2, 21.25);
				modelMatrix.rotate(90, 0, 1, 0);
				createWall(7.5, 4, false);
				modelMatrix = matrixStack.pop();

			/* handles door rotation */
			if (doorOpen && doorRotate != 0)
				doorRotate -= 5;
			else if (!doorOpen && doorRotate != 90)
				doorRotate += 5;
		}

		/* side wall with windows */
		pushMatrix(modelMatrix);
		modelMatrix.translate(16.75, 5.2, 24.5);
		modelMatrix.rotate(-90, 0, 1, 0);
		createWindowWall();
		modelMatrix = matrixStack.pop();

		/* turns classroom off */
		if(classroomTurningOff) {
			var change = false;
			for (var i = 0; i < 3; i++) {
				if(pointOn[i] > 0.0) {
					pointOn[i] -= 0.025;
					gl.uniform1f(u_pointLightOn[i], pointOn[i]);
					change = true;
				}
				if(pointLightVal[i] > 0.1) {
					pointLightVal[i] -= 0.025;
					change = true;
				}
			}
			for (var i = 0; i < 2; i++) {
				if(whiteboardHeight[i] > -2.2) {
					whiteboardHeight[i] -= 0.1;
					change = true;
				}
			}
			if (!change) {
				projectorOn = true;
				classroomTurningOff = false;
			}
		}

		/* turns calssroom on */
		if(classroomTurningOn) {
			var change = false;
			for (var i = 0; i < 3; i++) {
				if(pointOn[i] < 1.0) {
					pointOn[i] += 0.025;
					gl.uniform1f(u_pointLightOn[i], pointOn[i]);
					change = true;
				}
				if(pointLightVal[i] < 0.75) {
					pointLightVal[i] += 0.025;
					change = true;
				}
			}
			if(whiteboardHeight[0] < 3) {
				whiteboardHeight[0] += 0.1;
				change = true;
			}
			if(whiteboardHeight[1] < -2) {
				whiteboardHeight[1] += 0.1;
				change = true;
			}

			if (!change)
				classroomTurningOn = false;
		}

	modelMatrix = matrixStack.pop();
}
