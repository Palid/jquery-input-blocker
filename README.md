# jQuery Input Blocker

Lets through only allowed characters for `<input>` elements. Also works with pasting!

Requires jQuery `1.9`.
Run with tests: `npm run`
Should work on IE 9.

## Getting Started

Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/Palid/jquery-input-blocker/master/dist/jquery.input-blocker.min.js
[max]: https://raw.github.com/Palid/jquery-input-blocker/master/dist/jquery.input-blocker.js

In your web page:

```html
<script src="jquery.js"></script>
<script src="dist/input-blocker.min.js"></script>
<script>
jQuery(function($) {
  $('selector').inputBlocker({
    canPaste: true,
    allowedRe: /\d/,
    maxlength: 10,
    trimOnPaste: false
  }); // "initializes input blocker with provided options"
});
</script>
```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Release History
V 1.00 released 15.08.2014.
