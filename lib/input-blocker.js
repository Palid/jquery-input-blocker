;(function (window, $) {
    "use strict";

    var functionalKeys = {
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

    function onKeyDown(event) {
        var code = event.which || event.keyCode;
        if (event.ctrlKey && !event.altKey) {
            this.keyPressVariables.status = false;
        }
        if (functionalKeys[code]) {
            this.keyPressVariables.status = false;
        }
        this.keyPressVariables.status = true;
        this.keyPressVariables.preEventValue = this.$el.val();
    }

    function onKeyPress(event) {
        var code = event.which || event.keyCode;
        if (this.keyPressVariables.status) {
            if (this.re.test( String.fromCharCode(code) )) {
                return true;
            } else {
                return false;
            }
        }
    }

    var inputBlocker = function inputBlocker(el) {
        this.keyPressVariables = {
            status: true,
            preEventValue: ''
        };
    };

    function setValidation(el, options) {
        if (el.hasClass('jquery-input-blocker')){
            throw "inputBlocker was already initialized on " + (el.selector  ? el.selector : "an element") + "!";
        }
        if (!options || options && !options.regexp) {
            throw "You need to pass a regexp object in options.";
        }
        if (options) {
            if (options.regexp) {
                if (typeof options.regexp !== RegExp) options.regexp = new RegExp(options.regexp);
            }
            if (options.maxlength) el.prop('maxlength', options.maxlength);
        }

        this.re = options.regexp;
        this.$el = el;
        el.addClass('jquery-input-blocker');
        el.on('keydown', $.proxy(onKeyDown, this))
            .on('keypress', $.proxy(onKeyPress, this));
    }

    function clearValidation(el) {
        if (el.hasClass('jquery-input-blocker')) {
            el.off('keydown', $.proxy(onKeyDown, this))
                .off('keypress', $.proxy(onKeyPress, this));
        } else {
            throw (el.selector  ? "Element " + el.selector : "An element") + "didn't have inputBlocker initialized!";
        }

    }

    var exporting = {
        setValidation : $.proxy(setValidation, inputBlocker),
        clearValidation: $.proxy(clearValidation, inputBlocker)
    };

    if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
      window.inputBlocker = exporting;
      define(function() {
        return exporting;
      });

  } else {
    window.inputBlocker = exporting;
  }



})(window, jQuery);