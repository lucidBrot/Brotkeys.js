class StyleSwapper {
	// **********************
	// (c) amwinter cc-by-sa 3.0, https://stackoverflow.com/a/14249194/2550406
	// (c) aMarCruz cc-by-sa 3.0, https://stackoverflow.com/questions/9153718/change-the-style-of-an-entire-css-class-using-javascript#comment58478348_14249194
	//     modified by LucidBrot aka Eric Mink
	static cssrules(){
	  var rules={}; var ds=document.styleSheets,dsl=ds.length;
	  for (var i=0;i<dsl;++i){
		var dsi=ds[i].cssRules||ds[i].rules,dsil=dsi.length;
		for (var j=0;j<dsil;++j) rules[dsi[j].selectorText]=dsi[j];
	  }
	  return rules;
	};
	static css_getclass(name,createifnotfound){
	  var rules=StyleSwapper.cssrules();
	  if (!rules.hasOwnProperty(name)) throw 'StyleSwapper: Did not find class '+name+". Is it in an _external_ stylesheet?";
	  return rules[name];
	};
	// **********************
	static showKeys(on, target_class){
		// sanitize
		if(!target_class.startsWith('.')){
			target_class = '.'+target_class;
		}
		
		// using this code means the button always takes up space, even when not visible
		// If you want to use this code for brotkeys, remember to enable the visiblity line in keys.css
		///var shown = on ? "visible" : "hidden";
		///StyleSwapper.css_getclass(target_class).style.visibility=shown;
		
		// using this code instead means the button will not take up space when not visible and shift the whole page when activating
		var display = on ? "inline" : "none";
		StyleSwapper.css_getclass(target_class).style.display=display;
	}
}
