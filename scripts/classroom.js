/* File: classroom.js
 * Author: mxcm21
 * Date: 05/03/2018
 * Version: 1.0.0
 * Description: This file initialises all matrixes, gets the canvas element
 * 		from the HTML page, grabs variables from the shaders,
 *		sets up the shaders and initialises lighting */

"use strict";

var program;                                                                    // gl program defined in HTML
var modelMatrix = new Matrix4();                                                // model matrix
var viewMatrix = new Matrix4();                                                 // view matrix
var projMatrix = new Matrix4();                                                 // projection matrix
var g_normalMatrix = new Matrix4();                                             // coordinate transformation matrix
var matrixStack = [];                                                         	// stack holds matrix
var numPoints = 3;                                                              // number of point lights

/* declare as global variables so model class can also access */
var gl;
var canvas;
var u_ModelMatrix;
var u_ViewMatrix;
var u_NormalMatrix;
var u_ProjMatrix;
var u_LightColour;
var u_LightDirection;
var u_isLighting;
var u_AmbientLight;
var u_Colour;
var u_directScalar;
var u_pointScalar;
var u_pLightPositions;
var u_pointLightOn;
var u_isTextured;
var u_texture;
var u_projector;
var lightDirection;
var u_globalTextures;
var globalTextures = false;
var boardTextures;
var bookTextures;

var textures = {wood: {loc: 'tableWood.jpg'},
				chair: {loc: 'chair.jpg'},
				floor: {loc: 'floor.jpg'},
				metal: {loc: 'metal.jpg'},
				whiteboard1: {loc: 'whiteboard1.jpg'},
				whiteboard2: {loc: 'whiteboard2.jpg'},
				door: {loc: 'door.jpg'},
				book1: {loc: 'book1.jpg'},
				book2: {loc: 'book2.jpg'},
				book3: {loc: 'book3.jpg'},
				book4: {loc: 'book4.jpg'},
				slide: {loc: 'slide.png'}};

function main() {
    canvas = document.getElementById('canv');                                   // get canvas
    gl = canvas.getContext("webgl", {                                           // retrieve context
        premultipliedAlpha: false                                               // so transparent walls look normal
    });

    /* check if loaded or not */
    if (!gl) {
        console.log('Failed to retrieve rendering context for WebGL');
        return 0;
    }

    program = webglUtils.createProgramFromScripts(gl, ["vshader", "fshader"]);  // get shaders

    gl.clearColor(0, 0, 0, 1);                                                  // clear canvas and set background to black
    gl.clear(gl.Color_BUFFER_BIT);

    gl.enable(gl.DEPTH_TEST);                                                   // enable hidden surface removal
    gl.clear(gl.DEPTH_BUFFER_BIT);

    gl.enable(gl.CULL_FACE);                                                    // cull all faces not shown in view
    gl.useProgram(program);                                                     // define program for gl to use

    // get the storage locations of uniform attributes
    u_ModelMatrix = gl.getUniformLocation(program, 'u_ModelMatrix');
    u_ViewMatrix = gl.getUniformLocation(program, 'u_ViewMatrix');
    u_NormalMatrix = gl.getUniformLocation(program, 'u_NormalMatrix');
    u_ProjMatrix = gl.getUniformLocation(program, 'u_ProjMatrix');
    u_LightColour = gl.getUniformLocation(program, 'u_LightColour');
    u_LightDirection = gl.getUniformLocation(program, 'u_LightDirection');
	u_AmbientLight = gl.getUniformLocation(program, 'u_AmbientLight');
	u_Colour = gl.getUniformLocation(program, 'u_Colour');
	u_directScalar = gl.getUniformLocation(program, 'u_directScalar');
	u_pointScalar = gl.getUniformLocation(program, 'u_pointScalar');
    u_isLighting = gl.getUniformLocation(program, 'u_isLighting');
	u_isTextured = gl.getUniformLocation(program, 'u_isTextured');
	u_texture = gl.getUniformLocation(program, 'u_texture');
	u_globalTextures = gl.getUniformLocation(program, 'u_globalTextures');
	u_projector = gl.getUniformLocation(program, 'u_projector');

	/* since it is an array */
	u_pLightPositions = [];
	u_pointLightOn = [];
	for (var i = 0; i < numPoints; i++) {
		u_pLightPositions.push(gl.getUniformLocation(program,
			'u_pLightPositions[' + i + ']'));
		u_pointLightOn.push(gl.getUniformLocation(program,
			'u_pointLightOn[' + i + ']'));
	}

    // check everything loaded
    if (!u_ModelMatrix || !u_ViewMatrix || !u_NormalMatrix ||
        !u_ProjMatrix || !u_LightColour || !u_LightDirection ||
        !u_isLighting || !u_Colour || !u_directScalar || !u_pointScalar ||
        !u_pLightPositions || !u_isLighting || !u_isTextured || !u_texture ||
		!u_globalTextures || !u_projector) {
          console.log('Failed to Get the storage locations of u_ModelMatrix, u_ViewMatrix, and/or u_ProjMatrix');
          return;
      }

	projMatrix.setPerspective(30, canvas.width/canvas.height, 1, 1000);          // projection matrix calculation
	gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);              // pass to uniform variables
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

    // allows for transparency
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

	/* LIGHTING */
	gl.uniform3f(u_LightColour, 1.0, 1.0, 1.0); 							    // set white light
	/* directional light from above window side */
    lightDirection = new Vector3([-87, 43, 11]);                            	// set light direction
    lightDirection.normalize();                                                 // normalise light direction
    gl.uniform3fv(u_LightDirection, lightDirection.elements);
	toggleDirectionalLight();

	/* ambient lighting */
	gl.uniform4f(u_Colour, 1.0, 1.0, 1.0, 1.0);
	toggleAmbientLight();

	/* point lighting
     * lighting is much higher than ceiling to get the light to point at
     * the ground more than the walls */
    for (var i = 0; i < numPoints; i++)                                         // use loop as three point lights in a row
		togglePointLight(i);													 // turn point light on

    /* sets up buffers */
    setUp();

    $(window).on('resize', resizeCanvas);                                       // re scale canvas on window resize
}

function pushMatrix(m) {
	/* adds matrix to the array stack */
    matrixStack.push(new Matrix4(m));
}

function setUp() {
    /* sets up buffers only need to do once */
    n = initVertexBuffers(gl);                                             		// initialise vertex buffers
    if (n < 0) {
        console.log('Failed to set the vertex information');
        return 0;
    }

    gl.uniform1i(u_isLighting, true);											// set lighting to true
	gl.uniform1i(u_isTextured, false); 											// set texturing to false
	gl.uniform1i(u_projector, 0.0); 											// set projector off

	setUpTextures(); 															// load textures

	/* draw an initialise everything */
	updateDirectLighting(); 													// changes diffuse lighting value
	updatePointLighting(); 														// set point lighting
    resizeCanvas();                                                             // make sure canvas is properly scaled
    reset();                                                                 	// sets camera to correct position
	setAllLights(); 															// sets all point lights to correct position
    requestAnimationFrame(draw);
}

function setUpTextures() {
	/* loads in each texture in array at top */
    for(var textType in textures)
        setTexture(textures[textType]);

    gl.uniform1i(u_texture, 0);                                                 // set sampler
	toggleTextures();															// turn on textures
	boardTextures = [textures.whiteboard1.texture, textures.whiteboard2.texture];
	bookTextures = [textures.book1.texture, textures.book2.texture, textures.book3.texture, textures.book4.texture];
}

function setTexture(dict) {
    /* given a dictionary creates texture for it */
    dict.texture = gl.createTexture();                                          // create new texture
    dict.image = new Image();                                                   // create new image
    dict.image.crossOrigin = null;
    dict.image.src = 'assets/textures/' + dict.loc;                             // get source
    dict.image.onload = function() {                                            // when image is loaded
        gl.bindTexture(gl.TEXTURE_2D, dict.texture);                            // bind it
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, dict.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.generateMipmap(gl.TEXTURE_2D);                                       // generate mip map for it
    }
};

function resizeCanvas() {
    /* makes sure the canvas is optimised to the display size */
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);                            // resize canvas
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);                       // setup view port
}
