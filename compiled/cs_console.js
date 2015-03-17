/*
CS Console Version: 1.1.1
*/

/*
The MIT License (MIT)

Copyright (c) 2013 Adam Rensel, Code School LLC

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

(function() {
  var Filter, STYLES, defaults, extend, toHexString, _i, _results,
    __slice = [].slice;

  STYLES = {
    'ef0': 'color:#000',
    'ef1': 'color:#A00',
    'ef2': 'color:#0A0',
    'ef3': 'color:#A50',
    'ef4': 'color:#00A',
    'ef5': 'color:#A0A',
    'ef6': 'color:#0AA',
    'ef7': 'color:#AAA',
    'ef8': 'color:#555',
    'ef9': 'color:#F55',
    'ef10': 'color:#5F5',
    'ef11': 'color:#FF5',
    'ef12': 'color:#55F',
    'ef13': 'color:#F5F',
    'ef14': 'color:#5FF',
    'ef15': 'color:#FFF',
    'eb0': 'background-color:#000',
    'eb1': 'background-color:#A00',
    'eb2': 'background-color:#0A0',
    'eb3': 'background-color:#A50',
    'eb4': 'background-color:#00A',
    'eb5': 'background-color:#A0A',
    'eb6': 'background-color:#0AA',
    'eb7': 'background-color:#AAA',
    'eb8': 'background-color:#555',
    'eb9': 'background-color:#F55',
    'eb10': 'background-color:#5F5',
    'eb11': 'background-color:#FF5',
    'eb12': 'background-color:#55F',
    'eb13': 'background-color:#F5F',
    'eb14': 'background-color:#5FF',
    'eb15': 'background-color:#FFF'
  };

  toHexString = function(num) {
    num = num.toString(16);
    while (num.length < 2) {
      num = "0" + num;
    }
    return num;
  };

  [0, 1, 2, 3, 4, 5].forEach(function(red) {
    return [0, 1, 2, 3, 4, 5].forEach(function(green) {
      return [0, 1, 2, 3, 4, 5].forEach(function(blue) {
        var b, c, g, n, r, rgb;

        c = 16 + (red * 36) + (green * 6) + blue;
        r = red > 0 ? red * 40 + 55 : 0;
        g = green > 0 ? green * 40 + 55 : 0;
        b = blue > 0 ? blue * 40 + 55 : 0;
        rgb = ((function() {
          var _i, _len, _ref, _results;

          _ref = [r, g, b];
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            n = _ref[_i];
            _results.push(toHexString(n));
          }
          return _results;
        })()).join('');
        STYLES["ef" + c] = "color:#" + rgb;
        return STYLES["eb" + c] = "background-color:#" + rgb;
      });
    });
  });

  (function() {
    _results = [];
    for (_i = 0; _i <= 23; _i++){ _results.push(_i); }
    return _results;
  }).apply(this).forEach(function(gray) {
    var c, l;

    c = gray + 232;
    l = toHexString(gray * 10 + 8);
    STYLES["ef" + c] = "color:#" + l + l + l;
    return STYLES["eb" + c] = "background-color:#" + l + l + l;
  });

  extend = function() {
    var dest, k, obj, objs, v, _j, _len;

    dest = arguments[0], objs = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    for (_j = 0, _len = objs.length; _j < _len; _j++) {
      obj = objs[_j];
      for (k in obj) {
        v = obj[k];
        dest[k] = v;
      }
    }
    return dest;
  };

  defaults = {
    fg: '#FFF',
    bg: '#000'
  };

  Filter = (function() {
    function Filter(options) {
      if (options == null) {
        options = {};
      }
      this.opts = extend({}, defaults, options);
      this.input = [];
      this.stack = [];
    }

    Filter.prototype.toHtml = function(input) {
      var buf;

      this.input = typeof input === 'string' ? [input] : input;
      buf = [];
      this.forEach(function(chunk) {
        return buf.push(chunk);
      });
      this.input = [];
      return buf.join('');
    };

    Filter.prototype.forEach = function(callback) {
      var buf, handleDisplay,
        _this = this;

      buf = '';
      handleDisplay = function(code) {
        code = parseInt(code, 10);
        if (code === -1) {
          callback('<br/>');
        }
        if (code === 0) {
          if (_this.stack.length) {
            callback(_this.resetStyles());
          }
        }
        if (code === 1) {
          callback(_this.pushTag('b'));
        }
        if (code === 2) {

        }
        if ((2 < code && code < 5)) {
          callback(_this.pushTag('u'));
        }
        if ((4 < code && code < 7)) {
          callback(_this.pushTag('blink'));
        }
        if (code === 7) {

        }
        if (code === 8) {
          callback(_this.pushStyle('display:none'));
        }
        if (code === 9) {
          callback(_this.pushTag('strike'));
        }
        if (code === 24) {
          callback(_this.closeTag('u'));
        }
        if ((29 < code && code < 38)) {
          callback(_this.pushStyle("ef" + (code - 30)));
        }
        if (code === 39) {
          callback(_this.pushStyle("color:" + _this.opts.fg));
        }
        if ((39 < code && code < 48)) {
          callback(_this.pushStyle("eb" + (code - 40)));
        }
        if (code === 49) {
          callback(_this.pushStyle("background-color:" + _this.opts.bg));
        }
        if ((89 < code && code < 98)) {
          callback(_this.pushStyle("ef" + (8 + (code - 90))));
        }
        if ((99 < code && code < 108)) {
          return callback(_this.pushStyle("eb" + (8 + (code - 100))));
        }
      };
      this.input.forEach(function(chunk) {
        buf += chunk;
        return _this.tokenize(buf, function(tok, data) {
          switch (tok) {
            case 'text':
              return callback(data);
            case 'display':
              return handleDisplay(data);
            case 'xterm256':
              return callback(_this.pushStyle("ef" + data));
          }
        });
      });
      if (this.stack.length) {
        return callback(this.resetStyles());
      }
    };

    Filter.prototype.pushTag = function(tag, style) {
      if (style == null) {
        style = '';
      }
      if (style.length && style.indexOf(':') === -1) {
        style = STYLES[style];
      }
      this.stack.push(tag);
      return ["<" + tag, (style ? " style=\"" + style + "\"" : void 0), ">"].join('');
    };

    Filter.prototype.pushStyle = function(style) {
      return this.pushTag("span", style);
    };

    Filter.prototype.closeTag = function(style) {
      var last;

      if (this.stack.slice(-1)[0] === style) {
        last = this.stack.pop();
      }
      if (last != null) {
        return "</" + style + ">";
      }
    };

    Filter.prototype.resetStyles = function() {
      var stack, _ref;

      _ref = [this.stack, []], stack = _ref[0], this.stack = _ref[1];
      return stack.reverse().map(function(tag) {
        return "</" + tag + ">";
      }).join('');
    };

    Filter.prototype.tokenize = function(text, callback) {
      var ansiHandler, ansiMatch, ansiMess, handler, i, length, newline, process, realText, remove, removeXterm256, tokens, _j, _len, _results1,
        _this = this;

      ansiMatch = false;
      ansiHandler = 3;
      remove = function(m) {
        return '';
      };
      removeXterm256 = function(m, g1) {
        callback('xterm256', g1);
        return '';
      };
      newline = function(m) {
        if (_this.opts.newline) {
          callback('display', -1);
        } else {
          callback('text', m);
        }
        return '';
      };
      ansiMess = function(m, g1) {
        var code, _j, _len;

        ansiMatch = true;
        if (g1.trim().length === 0) {
          g1 = '0';
        }
        g1 = g1.trimRight(';').split(';');
        for (_j = 0, _len = g1.length; _j < _len; _j++) {
          code = g1[_j];
          callback('display', code);
        }
        return '';
      };
      realText = function(m) {
        callback('text', m);
        return '';
      };
      tokens = [
        {
          pattern: /^\x08+/,
          sub: remove
        }, {
          pattern: /^\x1b\[38;5;(\d+)m/,
          sub: removeXterm256
        }, {
          pattern: /^\n+/,
          sub: newline
        }, {
          pattern: /^\x1b\[((?:\d{1,3};?)+|)m/,
          sub: ansiMess
        }, {
          pattern: /^\x1b\[?[\d;]{0,3}/,
          sub: remove
        }, {
          pattern: /^([^\x1b\x08\n]+)/,
          sub: realText
        }
      ];
      process = function(handler, i) {
        var matches;

        if (i > ansiHandler && ansiMatch) {
          return;
        } else {
          ansiMatch = false;
        }
        matches = text.match(handler.pattern);
        text = text.replace(handler.pattern, handler.sub);
        if (matches == null) {

        }
      };
      _results1 = [];
      while ((length = text.length) > 0) {
        for (i = _j = 0, _len = tokens.length; _j < _len; i = ++_j) {
          handler = tokens[i];
          process(handler, i);
        }
        if (text.length === length) {
          break;
        } else {
          _results1.push(void 0);
        }
      }
      return _results1;
    };

    return Filter;

  })();

  window.ansi_to_html = Filter;

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.CSConsole = (function() {
    var CSConsoleHistory, KeyActions;

    CSConsole.prototype.keyMap = {
      'Alt-Delete': "delGroupAfter",
      'Alt-Left': "goGroupLeft",
      'Alt-Right': "goGroupRight",
      'Cmd-Right': "goLineEnd",
      'Ctrl-E': "goLineEnd",
      'Ctrl-Alt-Backspace': "delGroupAfter",
      'Delete': "delCharAfter",
      'End': "goLineEnd",
      'Home': "goLineStartSmart",
      'PageDown': "goPageDown",
      'PageUp': "goPageUp",
      'Right': "goCharRight",
      'Ctrl-F': "goCharRight"
    };

    CSConsole.prototype.outputWidgets = [];

    CSConsole.prototype.currentLine = 0;

    CSConsole.prototype.submitInProgress = false;

    function CSConsole(el, options) {
      this.moveInputForward = __bind(this.moveInputForward, this);
      this.addColors = __bind(this.addColors, this);
      this.formatWidgetElementText = __bind(this.formatWidgetElementText, this);
      this.buildWidget = __bind(this.buildWidget, this);
      this.renderResponse = __bind(this.renderResponse, this);
      this.responseObject = __bind(this.responseObject, this);
      this.lineNumber = __bind(this.lineNumber, this);
      this.inputLine = __bind(this.inputLine, this);
      this.promptLength = __bind(this.promptLength, this);
      this.submit = __bind(this.submit, this);
      this.initCallbacks = __bind(this.initCallbacks, this);
      this.showWelcomeMessage = __bind(this.showWelcomeMessage, this);
      this.previousHistory = __bind(this.previousHistory, this);
      this.nextHistory = __bind(this.nextHistory, this);
      this.focusInput = __bind(this.focusInput, this);
      this.innerConsole = __bind(this.innerConsole, this);
      this.reset = __bind(this.reset, this);
      this.getAllInput = __bind(this.getAllInput, this);
      this.setPrompt = __bind(this.setPrompt, this);
      this.getValue = __bind(this.getValue, this);
      this.setValue = __bind(this.setValue, this);      this.options = options;
      if (!this.options.prompt) {
        this.options.prompt = '> ';
      }
      this.initCallbacks(options);
      this.initializeKeyMap();
      this.initConsole(el);
      this.submitHistory = new CSConsoleHistory(this.options);
    }

    CSConsole.prototype.setValue = function(value) {
      return this.console.setLine(this.lineNumber(), "" + this.options.prompt + value);
    };

    CSConsole.prototype.getValue = function() {
      return this.getAllInput();
    };

    CSConsole.prototype.setPrompt = function(prompt) {
      this.console.setLine(this.currentLine, this.console.getLine(this.currentLine).replace(new RegExp(this.options.prompt), prompt));
      return this.options.prompt = prompt;
    };

    CSConsole.prototype.focus = function() {
      return this.console.getInputField().focus();
    };

    CSConsole.prototype.appendToInput = function(value) {
      return this.console.setLine(this.lineNumber(), "" + (this.console.getLine(this.lineNumber())) + value);
    };

    CSConsole.prototype.getAllInput = function() {
      var input, lineInput, startingInput;

      startingInput = this.currentLine;
      input = [];
      while (startingInput <= this.lineNumber()) {
        if (startingInput === this.currentLine) {
          lineInput = this.console.getLine(startingInput).substr(this.promptLength(), this.console.getLine(this.currentLine).length);
          input.push(lineInput);
        } else {
          input.push(this.console.getLine(startingInput));
        }
        startingInput++;
      }
      return input.join("\n");
    };

    CSConsole.prototype.reset = function(welcomeMessage) {
      var widget, _i, _len, _ref;

      if (welcomeMessage == null) {
        welcomeMessage = true;
      }
      this.submitInProgress = false;
      this.console.setValue('');
      _ref = this.outputWidgets;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        widget = _ref[_i];
        this.console.removeLineWidget(widget);
      }
      this.outputWidgets = [];
      if (this.options.welcomeMessage && welcomeMessage) {
        this.showWelcomeMessage();
        this.moveInputForward();
      }
      this.console.refresh();
      return this.console.scrollIntoView();
    };

    CSConsole.prototype.innerConsole = function() {
      return this.console;
    };

    CSConsole.prototype.initializeKeyMap = function() {
      return window.CodeMirror.keyMap.console = this.keyMap;
    };

    CSConsole.prototype.initConsole = function(el) {
      var keyActions,
        _this = this;

      el.className += " cs-console cs-console-height cs-console-width";
      keyActions = new KeyActions(this.options);
      this.console = window.CodeMirror(el, {
        mode: {
          name: this.options.syntax,
          useCPP: true
        },
        gutter: this.options.lineNumbers,
        lineNumbers: this.options.lineNumbers,
        theme: this.options.theme || "vibrant-ink",
        indentUnit: 2,
        tabSize: 2,
        keyMap: 'console',
        lineWrapping: true,
        onKeyEvent: this.focusInput,
        undoDepth: 0,
        autoFocus: this.options.autoFocus,
        extraKeys: {
          "Enter": this.submit,
          "Ctrl-M": this.submit,
          "Tab": this.noop,
          "Left": keyActions.goCharLeft,
          "Ctrl-B": keyActions.goCharLeft,
          "Backspace": keyActions.delCharBefore,
          "Cmd-Up": keyActions.goDocStart,
          "Cmd-Down": keyActions.goDocEnd,
          "Cmd-Left": keyActions.goLineStart,
          "Home": keyActions.goLineStart,
          "Ctrl-A": keyActions.goLineStart,
          "Alt-Backspace": keyActions.delGroupBefore,
          "Ctrl-W": keyActions.delGroupBefore,
          "Cmd-Backspace": keyActions.deleteLine,
          "Up": this.nextHistory,
          "Down": this.previousHistory,
          "Ctrl-P": this.nextHistory,
          "Ctrl-N": this.previousHistory,
          "Shift-Cmd-Right": this.noop,
          "Shift-Cmd-Left": this.noop,
          "Shift-Right": this.noop,
          "Shift-Alt-Right": this.noop,
          "Shift-Alt-Left": this.noop,
          "Ctrl-Enter": this.noop,
          "Alt-Enter": this.noop,
          "Shift-Tab": this.noop,
          "Cmd-S": this.noop,
          "Ctrl-Z": this.noop,
          "Cmd-Z": this.noop
        }
      });
      keyActions.setConsole(this.console);
      setTimeout((function() {
        return _this.console.refresh();
      }), 1);
      this.console.getScrollerElement().className += " cs-console-height";
      this.console.getWrapperElement().className += " cs-console-height cs-console-width";
      if (this.options.welcomeMessage) {
        this.showWelcomeMessage();
      }
      if (this.options.initialValue) {
        this.setValue(this.options.initialValue);
        this.moveInputForward();
      }
      if (this.options.autoFocus) {
        setTimeout((function() {
          return _this.console.getInputField().focus();
        }), 10);
      }
      return this.moveInputForward();
    };

    CSConsole.prototype.focusInput = function(cm, evt) {
      var cursorPos;

      cursorPos = this.console.getCursor();
      if (cursorPos.line === this.lineNumber()) {
        this.storedCursorPosition = this.console.getCursor();
        if (cursorPos.ch < this.promptLength()) {
          this.console.setCursor({
            line: cursorPos.line,
            ch: this.promptLength()
          });
        }
      } else {
        this.console.setCursor(this.storedCursorPosition);
      }
      return false;
    };

    CSConsole.prototype.nextHistory = function() {
      return this.setValue(this.submitHistory.nextHistory());
    };

    CSConsole.prototype.previousHistory = function() {
      return this.setValue(this.submitHistory.previousHistory());
    };

    CSConsole.prototype.showWelcomeMessage = function() {
      var line;

      this.console.setValue("");
      line = {
        content: this.options.welcomeMessage
      };
      return this.buildWidget(1, line, {
        above: true
      });
    };

    CSConsole.prototype.initCallbacks = function(options) {
      this.commandValidate = options.commandValidate;
      return this.commandHandle = options.commandHandle;
    };

    CSConsole.prototype.submit = function() {
      var input;

      input = this.getAllInput();
      if ((this.options.commandValidate === void 0 || this.options.commandValidate(input)) && !this.submitInProgress) {
        this.submitInProgress = true;
        this.submitHistory.push(input);
        this.submitHistory.resetIndex();
        return this.commandHandle(input, this.responseObject(), this.options.prompt);
      } else if (this.submitInProgress) {
        return this.nonReactingNewline();
      } else {
        return this.moveInputForward();
      }
    };

    CSConsole.prototype.nonReactingNewline = function() {
      this.currentLine = this.lineNumber();
      return this.console.setLine(this.currentLine, "" + (this.inputLine()) + "\n");
    };

    CSConsole.prototype.promptLength = function() {
      return this.options.prompt.length;
    };

    CSConsole.prototype.inputLine = function() {
      return this.console.getLine(this.lineNumber());
    };

    CSConsole.prototype.lineNumber = function() {
      return this.console.lineCount() - 1;
    };

    CSConsole.prototype.responseObject = function() {
      var _this = this;

      return function(responseLines) {
        return _this.renderResponse(responseLines);
      };
    };

    CSConsole.prototype.renderResponse = function(responseLines) {
      var line, lineNumber, _i, _len;

      if (!responseLines) {
        this.moveInputForward();
        this.submitInProgress = false;
        return;
      }
      lineNumber = this.lineNumber();
      if (responseLines.constructor === Array) {
        for (_i = 0, _len = responseLines.length; _i < _len; _i++) {
          line = responseLines[_i];
          this.buildWidget(lineNumber, line);
        }
      } else {
        this.buildWidget(lineNumber, responseLines);
      }
      this.buildWidget(lineNumber, {
        content: document.createElement('p'),
        className: 'cs-console-output-spacer bottom'
      });
      this.moveInputForward();
      return this.submitInProgress = false;
    };

    CSConsole.prototype.htmlEscape = function(string) {
      return ('' + string).replace(/&(?!\w+;|#\d+;|#x[\da-f]+;)/gi, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g, '&#x2F;');
    };

    CSConsole.prototype.buildWidget = function(lineNumber, responseLine, widgetOptions) {
      var widgetContent, widgetElement,
        _this = this;

      if (widgetOptions == null) {
        widgetOptions = {};
      }
      widgetContent = responseLine ? responseLine.content : '';
      if (this.isHtmlElement(widgetContent)) {
        widgetElement = widgetContent;
      } else {
        widgetElement = document.createElement('div');
        widgetElement.innerHTML = this.formatWidgetElementText(this.htmlEscape(widgetContent));
        widgetElement.className = "cs-console-output-element";
        widgetElement.style.whiteSpace = 'pre-wrap';
      }
      if (responseLine != null ? responseLine.className : void 0) {
        widgetElement.className += " " + responseLine.className;
      }
      if (Object.keys(widgetOptions).indexOf('coverGutter') < 0) {
        widgetOptions.coverGutter = false;
      }
      if (Object.keys(widgetOptions).indexOf('noHScroll') < 0) {
        widgetOptions.noHScroll = true;
      }
      this.outputWidgets.push(this.console.addLineWidget(lineNumber, widgetElement, widgetOptions));
      return setTimeout(function() {
        return _this.console.scrollIntoView({
          line: _this.console.lineCount() - 1,
          ch: 0
        });
      }, 100);
    };

    CSConsole.prototype.isHtmlElement = function(obj) {
      return obj && obj.constructor.toString().search(/HTML.+Element/) > 0;
    };

    CSConsole.prototype.formatWidgetElementText = function(message) {
      message = message.replace(/^\s/, '');
      message = "<p class='cs-console-output-spacer top'></p>" + message;
      return this.addColors(message);
    };

    CSConsole.prototype.addColors = function(message) {
      var filter;

      filter = new window.ansi_to_html();
      return filter.toHtml(message);
    };

    CSConsole.prototype.moveInputForward = function() {
      this.currentLine = this.lineNumber() + 1;
      this.console.setLine(this.currentLine - 1, "" + (this.inputLine()) + "\n" + this.options.prompt);
      this.storedCursorPosition = {
        line: this.currentLine,
        ch: this.promptLength()
      };
      return this.console.setCursor(this.storedCursorPosition);
    };

    CSConsole.prototype.noop = function() {};

    KeyActions = (function() {
      KeyActions.prototype._defaultCommands = CodeMirror.commands;

      function KeyActions(options) {
        this.isCursorAtPrompt = __bind(this.isCursorAtPrompt, this);
        this.promptLength = __bind(this.promptLength, this);
        this.consoleLineCount = __bind(this.consoleLineCount, this);
        this.deleteLine = __bind(this.deleteLine, this);
        this.delGroupBefore = __bind(this.delGroupBefore, this);
        this.goLineStart = __bind(this.goLineStart, this);
        this.goDocEnd = __bind(this.goDocEnd, this);
        this.goDocStart = __bind(this.goDocStart, this);
        this.delCharBefore = __bind(this.delCharBefore, this);
        this.goCharLeft = __bind(this.goCharLeft, this);
        this.setConsole = __bind(this.setConsole, this);        this.options = options;
      }

      KeyActions.prototype.setConsole = function(console) {
        return this.console = console;
      };

      KeyActions.prototype.goCharLeft = function() {
        if (this.isCursorAtPrompt()) {
          return this._defaultCommands.goCharLeft(this.console);
        }
      };

      KeyActions.prototype.delCharBefore = function() {
        if (this.isCursorAtPrompt()) {
          return this._defaultCommands.delCharBefore(this.console);
        }
      };

      KeyActions.prototype.goDocStart = function() {
        return this.console.scrollIntoView({
          line: 0,
          ch: 0
        });
      };

      KeyActions.prototype.goDocEnd = function() {
        return this.console.scrollIntoView({
          line: this.consoleLineCount(),
          ch: 0
        });
      };

      KeyActions.prototype.goLineStart = function() {
        var cursorPos;

        cursorPos = this.console.getCursor();
        return this.console.setCursor({
          line: cursorPos.line,
          ch: this.promptLength()
        });
      };

      KeyActions.prototype.delGroupBefore = function() {
        var cursorStartPos, futurePos;

        cursorStartPos = this.console.getCursor();
        this.console.moveH(-1, "group");
        futurePos = this.console.getCursor().ch;
        this.console.setCursor(cursorStartPos);
        if (futurePos >= this.promptLength()) {
          return this._defaultCommands.delGroupBefore(this.console);
        }
      };

      KeyActions.prototype.deleteLine = function() {
        return this.console.setLine(this.console.getCursor().line, this.options.prompt);
      };

      KeyActions.prototype.consoleLineCount = function() {
        return this.console.lineCount() - 1;
      };

      KeyActions.prototype.promptLength = function() {
        return this.options.prompt.length;
      };

      KeyActions.prototype.isCursorAtPrompt = function() {
        return this.console.getCursor().ch > this.promptLength();
      };

      return KeyActions;

    })();

    CSConsoleHistory = (function() {
      CSConsoleHistory.prototype.storage = {};

      CSConsoleHistory.prototype.currentIndex = 0;

      CSConsoleHistory.prototype.historyLabel = 'cs-console-history';

      CSConsoleHistory.prototype.cachedHistory = [];

      CSConsoleHistory.prototype.maxEntries = 25;

      function CSConsoleHistory(options) {
        this.previousHistory = __bind(this.previousHistory, this);
        this.nextHistory = __bind(this.nextHistory, this);
        this.getHistory = __bind(this.getHistory, this);
        this.push = __bind(this.push, this);
        var localHistory;

        this.options = options;
        if (this.options.historyLabel) {
          this.historyLabel = "cs-" + this.options.historyLabel + "-console-history";
        }
        if (this.options.maxEntries) {
          this.maxEntries = options.maxHistoryEntries;
        }
        if (this.localStorageExists()) {
          this.storage = window.localStorage;
          localHistory = this.getHistory();
          if (localHistory) {
            this.cachedHistory = localHistory;
          }
          this.currentIndex = this.cachedHistory.length - 1;
        }
      }

      CSConsoleHistory.prototype.localStorageExists = function() {
        var e;

        try {
          return !!(window['localStorage'] !== null && window.localStorage);
        } catch (_error) {
          e = _error;
          return false;
        }
      };

      CSConsoleHistory.prototype.push = function(item) {
        var currentHistory, startSlice;

        if (!item) {
          return;
        }
        currentHistory = this.getHistory();
        if (currentHistory[currentHistory.length - 1] === item) {
          return;
        }
        currentHistory.push(item);
        if (currentHistory.length >= this.maxEntries) {
          startSlice = currentHistory.length - this.maxEntries;
          currentHistory = currentHistory.slice(startSlice, currentHistory.length);
        }
        this.cachedHistory = currentHistory;
        this.storage[this.historyLabel] = JSON.stringify(currentHistory);
        return this.currentIndex = currentHistory.length - 1;
      };

      CSConsoleHistory.prototype.getHistory = function() {
        if (this.storage[this.historyLabel]) {
          return JSON.parse(this.storage[this.historyLabel]);
        } else {
          return [];
        }
      };

      CSConsoleHistory.prototype.nextHistory = function() {
        var history;

        if (this.cachedHistory.length > 0) {
          history = this.cachedHistory[this.currentIndex];
        } else {
          history = '';
        }
        if (this.currentIndex > 0) {
          this.currentIndex--;
        }
        return history;
      };

      CSConsoleHistory.prototype.previousHistory = function() {
        if (this.currentIndex < this.cachedHistory.length - 1) {
          this.currentIndex++;
          return this.cachedHistory[this.currentIndex];
        } else {
          return '';
        }
      };

      CSConsoleHistory.prototype.clearHistory = function() {
        this.storage[this.historyLabel] = "[]";
        return this.cachedHistory = [];
      };

      CSConsoleHistory.prototype.resetIndex = function() {
        return this.currentIndex = this.cachedHistory.length - 1;
      };

      return CSConsoleHistory;

    })();

    return CSConsole;

  }).call(this);

}).call(this);
