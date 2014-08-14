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
    this.numerical.inputBlocker({maxlength: 10});
    strictEqual(this.numerical.prop('maxlength'), 10, 'should have maxlength of 10');
    this.numerical.inputBlocker('destroy');
    // Webkit has bug that makes 524288 maxlength if undefined.
    // It should equal -1.
    strictEqual(this.numerical.prop('maxlength'), 524288, 'should have maxlength of -1');
  });

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