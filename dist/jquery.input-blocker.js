/*! input-blocker - v1.0.1 - 2014-11-10
* https://github.com/Palid/input-blocker
* Copyright (c) 2014 Dariusz 'Palid' Niemczyk; Licensed GNU */
(function ($) {
  "use strict";

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

  function getSelection(node) {
    return {
      start: node.selectionStart,
      end: node.selectionEnd
    };
  }

  function OnKeyDown(event) {
    var code = event.which || event.keyCode;
    this.inputBlocker.__lastSelection__ = getSelection(this);
    this.inputBlocker.__lastValue__ = this.value;
    if (event.ctrlKey && !event.altKey) {
      this.inputBlocker.__passEvent__ = false;
      return true;
    }
    if (KEYS[code]) {
      this.inputBlocker.__passEvent__ = false;
      this.inputBlocker.__lastKey__ = KEYS[code];
      return true;
    }
    this.inputBlocker.__passEvent__ = true;
  }

  function OnKeyPress(event) {
    var code = event.which || event.keyCode,
      character = String.fromCharCode(code);
    if (this.inputBlocker.__passEvent__) {
      this.inputBlocker.__lastKey__ = character;
      if (this.inputBlocker.__allowedRe__.test(character)) {
        this.inputBlocker.__lastAllowedKey__ = character;
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  function ReplacePasted() {
    var $el = $(this),
      maxlength = this.maxLength !== -1 && this.maxLength !== 524288 ? this.maxLength : -1,
      $data = this.inputBlocker,
      pasteRe = new RegExp($data.__allowedRe__.source ||
        $data.__allowedRe__.toSource(), "g"),
      match = $data.__lastPasteData__.match(pasteRe);
    if ($data.__trimOnPaste__) {
      $data.__lastPasteData__ = $.trim($data.__lastPasteData__);
    }
    if (match && match.join("") === $data.__lastPasteData__) {
      var newData = ($data.__lastValue__ ?
        ($.inputBlocker.concatPasted($data.__lastValue__, $data.__lastPasteData__, $data.__lastSelection__)) :
        ($data.__lastPasteData__));

      if (maxlength === -1 || newData.length <= maxlength) {
        this.value = newData;
      } else {
        this.value = $data.__lastValue__;
      }
    } else {
      this.value = $data.__lastValue__;
    }
    $el.trigger('keydown');
    $.inputBlocker.restoreCaretPosition($el, $data.__lastSelection__, $data.__lastPasteData__.length);
  }

  function WaitForPaste() {
    var value = this.value;
    if (value) {
      this.inputBlocker.__lastPasteData__ = value;
      ReplacePasted.call(this);
    } else {
      setTimeout(function () {
        return $.inputBlocker.waitForPaste.call(this);
      }, 20);
    }
  }

  function OnPaste(event) {
    if (this.inputBlocker.__canPaste__) {
      this.inputBlocker.__lastSelection__ = getSelection(this);
      this.inputBlocker.__lastValue__ = this.value;
      if (event.originalEvent &&
        event.originalEvent.clipboardData &&
        event.originalEvent.clipboardData.getData
      ) {
        this.inputBlocker.__lastPasteData__ = event.originalEvent.clipboardData.getData('text/plain');
        ReplacePasted.call(this);
        return false;
      } else {
        this.value = '';
        WaitForPaste.call(this);
        return false;
      }
    } else {
      return false;
    }
  }

  //Public methods
  $.inputBlocker = {};

  // Static method default options.
  $.inputBlocker.options = {
    canPaste: true,
    allowedRe: /./,
    maxLength: undefined,
    trimOnPaste: true
  };

  // Collection method.
  $.fn.inputBlocker = function (options) {
    var opts = options;
    if (typeof opts === "string" &&
      (opts === "destroy" || opts === "clear")
    ) {
      return $.inputBlocker.clearValidation(this);
    } else {
      opts = $.extend($.inputBlocker.options, options);
      this.each(function () {
        $.extend(opts, {
          node: this,
          $el: $(this)
        });
        $.inputBlocker.setValidation(opts);
      });
      return this;
    }
  };

  // validation starter method
  $.inputBlocker.setValidation = function (options) {
    if (options.$el.hasClass('jquery-input-blocker')) {
      throw options.$el.selector + " already has input-blocker initialized.";
    }
    $.extend(options.node, {
      inputBlocker: {
        __preInitMaxLength__: options.node.maxLength,
        __preInitValue__: options.node.value,
        __lastValue__: options.node.value,
        __passEvent__: true,
        __trimOnPaste__: options.trimOnPaste,
        __canPaste__: options.canPaste,
        __allowedRe__: options.allowedRe,
        __lastSelection__: {
          start: 0,
          end: 0
        },
        __lastPasteData__: '',
        __lastAllowedKey__: '',
        __lastKey__: ''
      }
    });
    // 524288 is a bug in webkit that equals undefined maxlength
    if (options.maxlength !== -1 && options.maxlength !== 524288) {
      options.$el.prop('maxlength', options.maxlength);
    }
    options.$el
      .addClass('jquery-input-blocker')
      .on('keydown.inputBlocker', OnKeyDown)
      .on('keypress.inputBlocker', OnKeyPress)
      .on('paste.inputBlocker', OnPaste);

  };

  // validation clearing method
  $.inputBlocker.clearValidation = function ($el) {
    if ($el.hasClass('jquery-input-blocker')) {
      var node = $el.get(),
        len = node.length;
      for (var i = 0; i < len; i++) {
        if (node[i].inputBlocker.__preInitMaxLength__ === -1) {
          node[i].removeAttribute('maxLength');
        } else {
          node[i].maxLength = node[i].inputBlocker.__preInitMaxLength__;
        }
        node[i].inputBlocker = undefined;
      }
      $el.off('keydown.inputBlocker', $el, $el.selector, OnKeyDown)
        .off('keypress.inputBlocker', $el, $el.selector, OnKeyPress)
        .off('paste.inputBlocker', $el, $el.selector, OnPaste)
        .removeClass('jquery-input-blocker');
    }
  };

  $.inputBlocker.concatPasted = function (lastValue, pastedValue, selection) {
    var content = lastValue.split(""),
      elements = selection.end - selection.start;
    content.splice(selection.start, elements, pastedValue);

    return content.join("");
  };

  $.inputBlocker.restoreCaretPosition = function ($el, selection, pastedLength) {
    var selectionStartProp = $el.prop('selectionStart'),
      position = selectionStartProp ?
      selection.start + pastedLength :
      selection.end + pastedLength;
    if (selectionStartProp) {
      $el.focus();
      $el.prop({
        selectionStart: position,
        selectionEnd: position
      });
    } else if ($el.prop('selectionEnd')) {
      $el.focus();
      $el.prop({
        selectionStart: position,
        selectionEnd: position
      });
    }
  };

  $.expr[':'].inputBlocker = function (elem) {
    return elem.inputBlocker;
  };

}(jQuery));
