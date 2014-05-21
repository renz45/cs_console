(function() {
  var cm, commandHandle, commandValidate, consoleOptions, csConsole, currentLine, inputValue, setup;

  cm = null;

  csConsole = null;

  inputValue = '';

  consoleOptions = {
    commandHandle: commandHandle = function() {},
    commandValidate: commandValidate = function(line) {
      return true;
    },
    prompt: '> '
  };

  setup = function() {
    csConsole = createConsole(consoleOptions);
    csConsole.reset();
    cm = csConsole.innerConsole();
    return inputValue = 'hello Worldy';
  };

  currentLine = function() {
    return cm.getLine(cm.lineCount() - 1);
  };

  module('Public API: #setValue', {
    setup: setup
  });

  test('it sets the value of the input line', function() {
    csConsole.setValue(inputValue);
    return ok(currentLine().match(new RegExp(inputValue)));
  });

  test('it sets the multi-line value of the input line', function() {
    inputValue = 'hello worldy\nthis is\nmulti-line';
    csConsole.setValue(inputValue);
    return ok(cm.getValue().match(new RegExp(inputValue)));
  });

  module('Public API: #getValue', {
    setup: setup
  });

  test('it returns the value of the input line', function() {
    cm.setLine(cm.lineCount() - 1, "> " + inputValue);
    return equal(csConsole.getValue(), inputValue);
  });

  test('it returns the multi-line value of the input line', function() {
    inputValue = 'hello worldy\nthis is\nmulti-line';
    cm.setLine(cm.lineCount() - 1, "> " + inputValue);
    return equal(csConsole.getValue(), inputValue);
  });

  module('Public API: #setPrompt', {
    setup: setup
  });

  test('it sets the prompt of the editor', function() {
    var newPrompt;

    newPrompt = "<< ";
    csConsole.setValue(inputValue);
    ok(currentLine().match(new RegExp("^" + consoleOptions.prompt + inputValue)));
    csConsole.setPrompt(newPrompt);
    return ok(currentLine().match(new RegExp("^" + newPrompt + inputValue)));
  });

  module('Public API: #reset', {
    setup: setup
  });

  test('it should clear the console', function() {
    csConsole.commandHandle = function(line, responder, prompt) {
      return responder({
        content: line
      });
    };
    csConsole.setValue(inputValue);
    csConsole.submit();
    csConsole.setValue(inputValue);
    ok(csConsole.outputWidgets.length > 0);
    csConsole.reset();
    ok(csConsole.outputWidgets.length === 0);
    return ok(csConsole.getValue().length === 0);
  });

  test('it should clear the console and show the welcome message if available', function() {
    csConsole.commandHandle = function(line, responder, prompt) {
      return responder({
        content: line
      });
    };
    csConsole.options.welcomeMessage = "I welcome you";
    csConsole.setValue(inputValue);
    csConsole.submit();
    csConsole.setValue(inputValue);
    ok(csConsole.outputWidgets.length > 0);
    csConsole.reset();
    ok(csConsole.outputWidgets.length === 1);
    ok(csConsole.getValue().length === 0);
    return ok(csConsole.outputWidgets[0].node.innerText.match(new RegExp(csConsole.options.welcomeMessage)));
  });

  test('it should clear the console and not show the welcome message if false is passed to reset(false)', function() {
    csConsole.commandHandle = function(line, responder, prompt) {
      return responder({
        content: line
      });
    };
    csConsole.options.welcomeMessage = "I welcome you";
    csConsole.setValue(inputValue);
    csConsole.submit();
    csConsole.setValue(inputValue);
    ok(csConsole.outputWidgets.length > 0);
    csConsole.reset(false);
    ok(csConsole.outputWidgets.length === 0);
    ok(csConsole.getValue().length === 0);
    return ok(!cm.getValue().match(new RegExp(csConsole.options.welcomeMessage)));
  });

  module('Public API: #buildWidget', {
    setup: setup
  });

  test('it creates the specified widget', function() {
    var widgetClass, widgetContent;

    csConsole.commandHandle = function(line, responder, prompt) {
      return responder(false);
    };
    widgetContent = 'Widget content!';
    widgetClass = 'widget-class-yo';
    csConsole.setValue(inputValue);
    csConsole.submit();
    csConsole.buildWidget(0, {
      content: widgetContent,
      className: widgetClass
    });
    ok(csConsole.outputWidgets[0].node.className.match(new RegExp(widgetClass)));
    ok(csConsole.outputWidgets[0].node.innerText.match(new RegExp(widgetContent)));
    return ok(csConsole.outputWidgets.length > 0);
  });

  module('Public API: #appendToInput', {
    setup: setup
  });

  test('it appends to the input field', function() {
    var appendedInput;

    appendedInput = 'APPENDTOYOU';
    csConsole.setValue(inputValue);
    csConsole.appendToInput(appendedInput);
    return ok(currentLine().match(new RegExp(inputValue + appendedInput)));
  });

}).call(this);
(function(){
  module('constructor options');
  test('setting prompt without welcome message should display prompt', function(){
    var prompt = ">>> ";
    var cs_console = createConsole({
      prompt: prompt
    });
    var cm = cs_console.innerConsole();

    ok( cm.getLine(cm.lineCount() - 1).match(new RegExp(prompt)) );
  });

  test('setting a prompt with a welcome message should display prompt', function(){
    var prompt = ">>> ";
    var cs_console = createConsole({
      prompt: prompt,
      welcomeMessage: 'Welcome to the console my friend'
    });
    var cm = cs_console.innerConsole();

    ok( cm.getLine(cm.lineCount() - 1).match(new RegExp(prompt)) );
  });

  test('prompt defaults to "> "', function(){
    var cs_console = createConsole();
    var cm = cs_console.innerConsole();
    ok( cm.getLine(cm.lineCount() - 1).match(new RegExp("> ")) );
  });

  test('setting a historyLabel uses it as a key on localStorage', function(){
    var historyLabel = 'test-console';
    var prompt = '>> ';
    var cs_console = createConsole({
      historyLabel: historyLabel,
      prompt: prompt,
      commandHandle: function(line, report, prompt){report(false)}, 
    });

    var cm = cs_console.innerConsole();
    cm.setLine(cm.lineCount() - 1, prompt + "blah blah and more blah");
    cs_console.submit();

    ok( Object.keys(localStorage).join().match(new RegExp(historyLabel)) );
  });

  test('setting a welcome message displays a welcome message', function(){
    var welcomeMessage = 'Hello, this is the console';
    var cs_console = createConsole({welcomeMessage: welcomeMessage});
    var cm = cs_console.innerConsole();
    ok( cs_console.outputWidgets[0].node.innerText.match(new RegExp(welcomeMessage)) );
  });

  test('setting autoFocus to true starts the console with focus', function(){
    var welcomeMessage = 'Hello, this is the console';
    var cs_console = createConsole({
      autoFocus: true
    });
    var cm = cs_console.innerConsole();
    ok( cm.options.autoFocus);
  });

  test('setting a commandHandle callback gets called on submit', function(){
    var callbackCalled = false;

    var commandHandle = function(){callbackCalled = true;}

    var cs_console = createConsole({
      commandHandle: commandHandle
    });

    var cm = cs_console.innerConsole();
    cm.setLine(cm.lineCount() - 1, prompt + "> blah blah and more blah");
    cs_console.submit();

    ok( callbackCalled );
  });

  test('setting a commandValidate callback gets called on submit', function(){
    var callbackCalled = false;

    var commandValidate = function(){callbackCalled = true;}

    var cs_console = createConsole({
      commandValidate: commandValidate
    });

    var cm = cs_console.innerConsole();
    cm.setLine(cm.lineCount() - 1, "> blah blah and more blah");
    cs_console.submit();

    ok( callbackCalled );
  });
})();
