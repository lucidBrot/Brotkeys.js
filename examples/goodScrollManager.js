/*
* (c) Eric Mink, eric@mink.li, 2019
*
* This file is an example how to use Brotkeys.js for handling scrolling with the J and K keys.
* It contains some additional code in comparison to badScrollManager.js that makes it less tedious to use.
*/

var manager;

// Make sure the manager does not use j and k:
// Define them as words, but don't act on them
var wordMap = new Map([
	["j", function(){}],
	["k", function(){}],
]);
// these single characters that can interrupt at any time during the word-typing mode
var interruptMap = new Map([
	["D", function(){console.log("user disabled shortcuts"); manager.disable(); manager.leave_f_mode();}],
]);

manager = new HotkeyManager(wordMap, interruptMap);
manager.interrupt_caseInsensitivity = false;

// please notify me on entering and leaving fmode simply by showing the link hints
// this is the simplest way to do this. for other options, see the examples in brotkeys.js#brotkeys_autogenerate_manager_for_anchors and brotkeys.js#brotkeys_autogenerate_manager_for_class_tag
var notifyFModeFunc = manager.genToggleKeysOnNotify(); // returns a function
manager.setNotifyFModeFunction(notifyFModeFunc); // takes the function as callback for when FMode is triggered

manager.log_prefix = "[Scrolling Brotkeys Manager] "; // optional prefix for logging to the console

// add a link hint to every anchor tag (<a/>)
manager.autogenerate(manager.GenerationEnum.tag_anchor); 
// add a link hint to every element with css class "linkhintgen"
manager.autogenerate(manager.GenerationEnum.class_tagged, "linkhintgen", undefined);

// set up scrolling on j and k
function handleKeyDown(e){
	// j
	if (e.keyCode==74) {
		window.scrollBy(0, 50);
	}
	// k
	if (e.keyCode==75){
		window.scrollBy(0,-50);
	}
}
$(document).keydown(handleKeyDown);