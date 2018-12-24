## for showing an image with a link hint and for not moving text content when showing link hints

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
* change the way the generation of a link hint works (or provide an alternative version) for manual adding of a link hint

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



For within text, I can even place the parent container directly within the text:

```javascript
<a href="https://eric.mink.li/public_files/summaries/basisjahr/LinAlg_Singulärwertzerlegung.jpg" brotkeysid0="30">Singular Value Decomposition Flowchart<span style="position:relative"><kbd class="LB-SS-swap1 eric-reverse" style="display: inline; position: absolute;">dt
</kbd>    
</span>
</a>
```

Only issue is that it seems to be a bit lower like this... To make sure it's centered vertically, we need 

```css
position: absolute;
top: 50%;
transform: translateY(-50%)
```

Because top is relative to the parent height and translateY is relative to the link hint's height, thus moving its center to the center height of the parent.

So for text content, we can just inject

```html
<span style="position:relative;">
<kbd class="{SWAP_CLASS} {LINKHINT_STYLE_CLASS}" style="position:absolute;top:50%;transform:translateY(-50%)">
     dt
</kbd>
</span>
```

into the actual link text innerHTML
in order to get <kbd>dt</kbd> as a link hint.

*This solves the problem of showing link hints without moving the page content!*

Regarding images, it's a bit harder since they would need an outer wrapper div or span that is relative. Modify the img tag itself to be absolute, and also have above code snippet in it (with or without the span part). If the image is not positioned absolutely, the link hint will show up next to the image instead.

That is also ok for the moment though, since images will neeed their own case anyways.



For images, I either have to make the user tag them with a different class. But that's annoying for them. Or I just check whether the element to generate a link hint for is an image, and if yes launch my image mode. Next todo is finding out where exactly to perform that check.



## For images

generate an outer container with `position:relative;`. In it our image and the link hint.



```html
<span style="position:relative;" class="BHK" brotkeysid0="34"><img src="https://i.stack.imgur.com/GhBMm.png?s=48&amp;g=1">
                
                <kbd class="LB-SS-swap1 eric-reverse overlay-hint" style="display: inline; transform: translate(-150%, -50%);">dp</kbd>

</span>
```

The `translate` in x direction is so that the link hint lies somewhat on the image. It would be nice if we could center it on the image but for that we'd need the image width. the y direction is because setting element-level transform overrides the `overlay-hint`class:![1545652686816](C:\Users\Eric\AppData\Roaming\Typora\typora-user-images\1545652686816.png)

It would likely make sense to create an `overlay-image-hint` class and use that one instead of `overlay-hint`. The we could also drop the element-level transform. (note that the style is set by brotkeys anyways).

https://stackoverflow.com/questions/15375022/center-image-vertically-horizontally-over-another-without-dimensions sounds promising for centering:
Use `display:block` instead of `inline` (issues with brotkeys on change there? Again, argument for using different css class), `position:absolute` in the `kbd` and `position:relative` in the outer span. set `top`, `left`,`bottom`, `right` to 0, `z-index` to 1 and set a `center center` background.
However, my content is not an image... can I still use background?



Perhaps using `img...offsetHeight` from javascript makes it easier to center the kbd tag.