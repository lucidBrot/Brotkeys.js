var manager;
// words of the form [f]abcdefg unless enable_f_mode is set to false
// DONT INCLUDE AN UPPERCASE X, because that is used to immediately abort f mode here.
var wordMap = new Map([
	["secret", function(){window.open("https://eric.mink.li/src/php/ccount/click.php?id=sneric","_self");}],
]);
// single characters that can interrupt at any time during the word-typing mode
var interruptMap = new Map([
	["X", function(){manager.abort_f_mode();}],
	["D", function(){console.log("user disabled shortcuts"); manager.disable();}],
]);

manager = new HotkeyManager(wordMap, interruptMap);
manager.interrupt_caseInsensitivity = false;

manager.loadNeededJSCSSForStyleSwapping();
// please notify me on entering and leaving fmode simply by showing the link hints
// this is the simplest way to do this. for other options, see the examples in brotkeys.js#brotkeys_autogenerate_manager_for_anchors and brotkeys.js#brotkeys_autogenerate_manager_for_class_tag
var notifyFModeFunc = manager.genToggleKeysOnNotify();
manager.setNotifyFModeFunction(notifyFModeFunc);
manager.log_prefix = "[M] ";
manager.autogenerate(manager.GenerationEnum.tag_anchor);