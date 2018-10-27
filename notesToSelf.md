## for showing an image with a link hint

```html
<div style="position:relative">
    <img src="https://i.stack.imgur.com/GhBMm.png?s=48&amp;g=1" class="BHK" brotkeysid0="34" style="position:absolute;top:0px;left:0px">
    <kbd class="LB-SS-swap1 eric-reverse" style="display: none; position: absolute; top: 0px; left: 0px;">dp</kbd>
</div>
```

Required to have div `style="position:relative"` as wrapper.

This might also solve my problem of wanting to not move the page content when showing such a link hint. Perhaps need to set `z-index`.