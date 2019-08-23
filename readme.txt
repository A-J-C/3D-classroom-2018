Author: mxcm21
Date: 06/03/2018
This file is to provide an overview of every file I have created for this assignment:

===== Since my program uses textures make sure -allow-file-access-from-files is set =====

CONTROLS:
	- All controls are given on screen via togllable HUD.


FILES:
- classroom
	These are files I have created. I have split them apart even though they could all be in one so the code
	is easier to understand and maintain

	- classroom.html
		This is the main page, which includes the canvas tag. It loads all the scripts and also
		includes the Vertex Shader and Fragment Shader. They are included here so they don't need
		to be written as Strings in a js file.

	- classroom.css
		I've included some basic styling for the web page, resizing the canvas so it is full screen,
		and including styling transitions for the instructions to be hidden/revealed.

	- scripts
		- classroom.js
			The main JavaScript file. It initialises all matrices for WebGL to use, as well as extracting
			the locations of uniform attributes, and the program for gl to use. It also loads the textures.

		- buffers.js
			I've moved all buffers used into this separate file. Only a buffer for a cube is needed, as
			all other objects are made from manipulated cubes.

		- objects.js
			All objects I create, such as tables and chairs are created by this file. It manipulates a
			standard cube to create different shapes.

		- drawer.js
			Here for loops create different objects in the "objects.js" file and add them to the
			model matrix in varying positions, according to a dictionary.

		- objectHandler.js
			This handles the user toggling between "normal" and "object" moving modes. When in object
			movement mode, key presses are used to move between different objects and manipulate the
			positions they are in. It does this by updating dictionary values used by drawer.js stating
			where to translate the models to.

		- normalHandler.js
			This handles "normal" moving mode. Key presses, mouse drags and the wheel scrolling are all
			captured and used to manipulate the view matrix, giving the user a different view of the classroom.

		- lightHandler.js
			This handles all the lighting changes. E.g. toggling point lights off, adjusting their power, or
			turning the projector on.

		- framerate.js
			I've made this file to display to the user the current framerate. It updates a counter on screen
			which informs the user. I thought this would be useful for user's with particularly slow machines
			who were wondering why they experienced so much lag.

	- assets
		- library
			- All files in the library are common webgl files to make the main program work, taken from Frederick Li's
			  Practical 3 code.
			- jQuery is also included to let me manipulate onscreen instructions.

		- icon.jpg
			This is a simple favicon used to make the webpage feel more like a real site.

		-textures
			- All files needed for textures
