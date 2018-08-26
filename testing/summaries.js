var manager;
// words of the form [f]abcdefg unless enable_f_mode is set to false
// DONT INCLUDE AN UPPERCASE X, because that is used to immediately abort f mode here.
var wordMap = new Map([
	["br", function(){window.open("https://github.com/lucidBrot/Brotkeys.js", "_self");}],
	["sh", function(){window.open("https://github.com/lucidBrot/shiverBot", "_self");}],
	["secret", function(){window.open("https://eric.mink.li/src/php/ccount/click.php?id=sneric","_self");}],
	["ei", function(){window.open("https://github.com/lucidBrot/einz", "_self");}],
	["apk", function(){window.open("https://eric.mink.li/src/php/ccount/click.php?id=einz_v0.2.apk", "_self");}],
	["au", function(){window.open("https://github.com/lucidBrot/Autorun_StickMagic","_self");}],
	["gi", function(){window.open("https://github.com/lucidBrot","_self");}],
	["li", function(){window.open("https://linkedin.com/in/minkeric","_self");}],
	["so", function(){window.open("https://stackoverflow.com/users/story/2550406","_self");}],
	["em", function(){window.open("mailto://eric@mink.li", "_self");}],
	["des", function(){alert("TODO: all those content links");}],
	["ed", function(){window.open("./summaries.html", "_self");}],
	["pu", function(){window.open("./publications.html", "_self");}],
	["pr", function(){window.open("#projects", "_self");}],
]);
// single characters that can interrupt at any time during the word-typing mode
var interruptMap = new Map([
	["X", function(){manager.abort_f_mode();}],
	["D", function(){console.log("user disabled shortcuts"); manager.disable();}],
]);

manager = new HotkeyManager(wordMap, interruptMap);
manager.interrupt_caseInsensitivity = false;
// please notify me on entering and leaving fmode
/*var notifyFModeFunc = function(entering){
	if(entering){
		StyleSwapper.showKeys(true, "LB-SS-swap1"); //important: this class must be defined in an _external_ css file.
	} else {
		StyleSwapper.showKeys(false, "LB-SS-swap1");
	}
};
manager.setNotifyFModeFunction(notifyFModeFunc);*/
manager.log_prefix = "[M1] ";