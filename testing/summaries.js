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
// please notify me on entering and leaving fmode
var notifyFModeFunc = function(entering){
	if(entering){
		manager.showKeys(true, "LB-SS-swap1");
	} else {
		manager.showKeys(false, "LB-SS-swap1");
	}
};
manager.setNotifyFModeFunction(notifyFModeFunc);
manager.log_prefix = "[M] ";
manager.autogenerate(manager.GenerationEnum.tag_anchor);