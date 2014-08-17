(function ($) {
  /*
    ======== A Handy Little QUnit Reference ========
    http://api.qunitjs.com/

    Test methods:
      module(name, {[setup][ ,teardown]})
      test(name, callback)
      expect(numberOfAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      throws(block, [expected], [message])
  */

  //Privates and consts
  var KEYS = {
    37: 'left arrow',
    39: 'right arrow',
    8: 'backspace',
    46: 'delete',
    45: 'insert',
    36: 'home',
    35: 'end',
    33: 'page up',
    34: 'page down',
    9: 'tab',
    ctrlKey: 'control',
    altKey: 'alt',
    shiftKey: 'shift'
  };
  var USERAGENT = navigator.userAgent;


  function emulateEvents(target, options) {
    var node = target.get();
    var keydown = $.Event('keydown', {
      target: node,
      which: (options.character && !options.code) ? options.character.charCodeAt(0) : options.code,
      bubbles: true,
      cancellable: true,
      originalTarget: node
    });
    var keypress = $.Event('keypress', {
      target: node,
      which: options.character ? options.character.charCodeAt(0) : options.code,
      bubbles: true,
      cancellable: true,
      originalTarget: node
    });
    target.trigger(keydown);
    target.trigger(keypress);
    return target;
  }

  module('jQuery#input-blocker', {
    // This will run before each test in this module.
    setup: function () {
      this.numerical = $('.numerical');
      this.numerical.inputBlocker('destroy');
    }
  });

  test('is chainable', function () {
    expect(1);
    // Not a bad test to run on collection methods.
    strictEqual(this.numerical.inputBlocker(), this.numerical, 'should be chainable');
  });

  test('has class', function () {
    expect(1);
    strictEqual(this.numerical.inputBlocker().hasClass('jquery-input-blocker'), true, 'should have class jquery-input-blocker');
  });

  test('restores previous maxlength after destroy', function () {
    expect(2);
    this.numerical.inputBlocker({
      maxlength: 10
    });
    strictEqual(this.numerical.prop('maxlength'), 10, 'should have maxlength of 10');
    this.numerical.inputBlocker('destroy');
    if (USERAGENT.indexOf('WebKit') !== -1) {
      // Webkit has bug that makes 524288 maxlength if undefined.
      strictEqual(this.numerical.prop('maxlength'), 524288, 'should have maxlength of 524288');
    } else {
      // It should equal -1.
      strictEqual(this.numerical.prop('maxlength'), -1, 'should have maxlength of -1');
    }
  });

  test('__passEvent__', function () {
    var node = this.numerical.get(0);
    expect(14);
    this.numerical.inputBlocker();
    for (var key in KEYS) {
      emulateEvents(this.numerical, {
        code: key
      });
      strictEqual(node.inputBlocker.__passEvent__, false, 'should equal false');
    }
    emulateEvents(this.numerical, {
      code: 80,
      character: 'P'
    });
    strictEqual(node.inputBlocker.__passEvent__, true, 'should equal true');
  });

  test('__lastKey__', function () {
    var node = this.numerical.get(0);
    expect(14);
    this.numerical.inputBlocker({
      allowedRe: /\d/
    });
    for (var key in KEYS) {
      emulateEvents(this.numerical, {
        code: key
      });
      strictEqual(node.inputBlocker.__lastKey__, KEYS[key], 'should equal ' + KEYS[key]);
    }
    emulateEvents(this.numerical, {
      code: 80,
      character: 'P'
    });
    strictEqual(node.inputBlocker.__lastKey__, 'P', 'should be equal P');
  });

  test('__lastAllowedKey__', function () {
    var node = this.numerical.get(0);
    expect(34);
    this.numerical.inputBlocker({
      allowedRe: /\d/
    });
    for (var i = 0; i < 10; i++) {
      emulateEvents(this.numerical, {
        character: i + ''
      });
      strictEqual(node.inputBlocker.__lastKey__, node.inputBlocker.__lastAllowedKey__, 'should equal __lastKey__');
      strictEqual(node.inputBlocker.__lastAllowedKey__, i + '', 'should equal ' + i);
    }
    var chars = ['a','b','c','d','e','f','g'];
    for (var y = 0; y< chars.length; y++){
      emulateEvents(this.numerical, {
        character: chars[i]
      });
      notStrictEqual(node.inputBlocker.__lastKey__, node.inputBlocker.__lastAllowedKey__, 'should not equal __lastKey__');
      notStrictEqual(node.inputBlocker.__lastAllowedKey__, chars[i], 'should not equal ' + chars[i]);
    }
  });

  // TODO: pasting tests

  module(':inputBlocker selector', {
    // This will run before each test in this module.
    setup: function () {
      this.elems = $('#qunit-fixture').children();
      this.numerical = $('.numerical');
      this.special = $('.special');
      this.numerical.inputBlocker();
    }
  });

  test('is inputBlocker initialized', function () {
    expect(3);
    deepEqual(this.elems.filter(':inputBlocker').get(), this.elems.first().get(), 'has inputBlocker initialized');
    this.special.inputBlocker();
    deepEqual(this.elems.filter(':inputBlocker').get(), this.elems.get(), 'has inputBlocker initialized');
    this.special.inputBlocker('destroy');
    deepEqual(this.elems.filter(':inputBlocker').get(), this.elems.first().get(), 'has inputBlocker initialized');
  });

}(jQuery));
