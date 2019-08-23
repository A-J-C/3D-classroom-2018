/* File: objectMovement.js
 * Author: mxcm21
 * Date: 05/03/2018
 * Version: 1.0.0
 * Description: This file handles object movment when the use switches
 * 		to object mode. */

var objects = {};
var selected;
var numberObjects = 32;
var adjust = 10;

var objMovment = 0.2;
var objRotate = 3.0;
var objectMode = false;

function objectMove() {
    /* swaps mode to move specific objects */
	objRotate = (mouseCapture) ? 6.0 : 3.0; 	// change rotate constant depending on arrows or mouse 
	
    if (key[87])                       // w means it moves differently depending on rotation
        objects[selected].move_z -= objMovment;

    if (key[65])                       // a
        objects[selected].move_x -= objMovment;

    if (key[83])                       // s
        objects[selected].move_z += objMovment;

    if (key[68])                       // d
        objects[selected].move_x += objMovment;

    if (key[82])                        // r key pressed we want to go vertically up
        objects[selected].move_y += objMovment;

    if (key[70])                        // f key pressed we want to go vertically down
        objects[selected].move_y -= objMovment;

    if (key[38])                        // up arrow key
        objects[selected].angle_x = (objects[selected].angle_x  - objRotate) % 360;

    if (key[40])                        // down arrow key
        objects[selected].angle_x = (objects[selected].angle_x  + objRotate) % 360;

    if (key[37])                        // left arrow key
        objects[selected].angle_y = (objects[selected].angle_y  - objRotate) % 360;

    if (key[39])                        // right arrow key
        objects[selected].angle_y = (objects[selected].angle_y  + objRotate) % 360;

    if (key[78]) {                       // on n pressed select next object
        objects[selected].highlight = 0;
        selected = (selected + 1) % numberObjects;
        objects[selected].highlight = 1;
    }

    if (key[80]) {                       // on p pressed select previous object
        objects[selected].highlight = 0;
        selected = (selected - 1) % numberObjects;
        if (selected == -1)                     // java handles modulus weirdly for negatives
            selected = numberObjects - 1;
        objects[selected].highlight = 1;
    }

    if (key[76]) {                          // on l pressed return object to original positions
        if (selected % 9 < 6 && selected < 27)         // check if selected is table or chair or other object
            setChair(selected);
        else if (selected < 27)
            setTable(selected);
		else if (selected == 27)
			setBookcase(selected);
		else if (selected < 30)
			setCabinet(selected);
		else if (selected == 30)
			setTeacherTable(selected);
		else 
			setTeacherChair(selected);

        objects[selected].highlight = 1;        // rehighlight
    }

    if (key[79])                        // on o pressed return all to original positions
        initialiseObjects();
}

function setChair(i) {
    chair = {};
    count = i % 9;
    chair.move_x = 3 * count - adjust + 3*Math.floor(count/2);
    chair.move_y = 0;
    chair.move_z = -17.5 + 10 * Math.floor(i/9);
    chair.angle_x = 0;
    chair.angle_y = 0;
    chair.highlight = 0;

    objects[i] = chair;
}

function setTable(i) {
    table = {};
    table.move_x = 9 * (i%9 - 6) - adjust + 1.5;
    table.move_y = 0;
    table.move_z = -15 + 10 * Math.floor(i/9);
    table.angle_x = 0;
    table.angle_y = 0;
    table.highlight = 0;

    objects[i] = table;
}

function setBookcase(i) {
	bookcase = {};
	bookcase.move_x = -9.5;
    bookcase.move_y = -0.5;
    bookcase.move_z = -25;
    bookcase.angle_x = 0;
    bookcase.angle_y = 0;
    bookcase.highlight = 0;

    objects[i] = bookcase;
}

function setCabinet(i) {
	cabinet = {};
	cabinet.move_x = 6 + (6 * (i-28));
    cabinet.move_y = -0.5;
    cabinet.move_z = -24;
    cabinet.angle_x = 0;
    cabinet.angle_y = 0;
    cabinet.highlight = 0;

    objects[i] = cabinet;
}

function setTeacherTable(i) {
	table = {};
	table.move_x = 0;
    table.move_y = -1.2;
    table.move_z = 20;
    table.angle_x = 0;
    table.angle_y = 0;
    table.highlight = 0;

    objects[i] = table;
}

function setTeacherChair(i) {
	chair = {};
	chair.move_x = 8.6;
    chair.move_y = 0;
    chair.move_z = 19.5;
    chair.angle_x = 0;
    chair.angle_y = 180;
    chair.highlight = 0;

    objects[i] = chair;
}

function initialiseObjects() {
    /* initialise all objects */

    for (var rows = 0; rows < 3; rows++) {
        for (var count = 0; count < 6; count++)
            setChair(9 * rows + count);

        for (var count = 0; count < 3; count++)
            setTable(6 * (rows+1) + 3*rows + count);
    }
	
	/* setup other dynamic objects */
	setBookcase(27);
	setCabinet(28);
	setCabinet(29);
	setTeacherTable(30);
	setTeacherChair(31); 

    selected = 0;
    objects[selected].highlight = 1;
}

initialiseObjects();                                      // initialise all object locations

$(document).ready(function() {                     // wait till document is fully loaded
    $("#objectMode").hide();                        // hide object mode

	/* For hiding and showing instructions */
	$("#hide").click(function() {
		$(".sideBar").addClass("hidden");
		$("#show").addClass("show");
	});

	$("#show").click(function() {
		$(".sideBar").removeClass("hidden");
		$("#show").removeClass("show");
	});

    /* Toggle for object mode or normal mode */
    $("#toggleObject").click(function() {
        $("#toggleObject").addClass("toggleSelect");
        $("#toggleNormal").removeClass("toggleSelect");

        $("#objectMode").show();
        $("#normalMode").hide();

        objectMode = true;
    });

    $("#toggleNormal").click(function() {
        $("#toggleNormal").addClass("toggleSelect");
        $("#toggleObject").removeClass("toggleSelect");

        $("#objectMode").hide();
        $("#normalMode").show();

        objectMode = false;
    });
});
