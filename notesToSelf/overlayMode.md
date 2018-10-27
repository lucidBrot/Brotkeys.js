## for showing an image with a link hint

```html
<div style="position:relative">
    <img src="https://i.stack.imgur.com/GhBMm.png?s=48&amp;g=1" class="BHK" brotkeysid0="34" style="position:absolute;top:0px;left:0px">
    <kbd class="LB-SS-swap1 eric-reverse" style="display: none; position: absolute; top: 0px; left: 0px;">dp</kbd>
</div>
```

Required to have div `style="position:relative"` as wrapper.

This might also solve my problem of wanting to not move the page content when showing such a link hint. Perhaps need to set `z-index`.



To do for that:

* edit the css file such that the generated link hints will have this absolute css
* change the way the generation of a link hint works (or provide an alternative version) for autogeneration from anchors or class-tags
* change the way the generation of a link hint works (or provide an alternative version) for manual adding of a link hintgg

The autogeneration functions all eventually call this function to do that:

```javascript
addBeautifulLinkHint(element, linkHint, swap_class){
		element.innerHTML += `<kbd class=\"${swap_class} ${this.LINKHINT_STYLE_CLASS}\">${linkHint}</kbd>`
}	
```

So all that is different, is `this.LINKHINT_STYLE_CLASS`. That would also be done manually.
My task is thus to add a way to set this variable (which is not used anywhere else btw at the moment 27.10.2018).

But what should be the default?
I'll first code it as optional, and if it works well, absolute position should probably be the default.