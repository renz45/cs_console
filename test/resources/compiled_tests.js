(function() {
  module('Public API: #setValue');

  test('it sets the value of the input line', function() {
    var callbackCalled, cm, commandValidate, cs_console, inputValue;

    callbackCalled = false;
    commandValidate = function() {
      return callbackCalled = true;
    };
    cs_console = createConsole({
      commandValidate: commandValidate
    });
    cm = cs_console.innerConsole();
    inputValue = 'hello worldy';
    cs_console.setValue(inputValue);
    return ok(cm.getLine(cm.lineCount() - 1).match(new RegExp(inputValue)));
  });

  test('it sets the multi-line value of the input line', function() {
    var callbackCalled, cm, commandValidate, cs_console, inputValue;

    callbackCalled = false;
    commandValidate = function() {
      return callbackCalled = true;
    };
    cs_console = createConsole({
      commandValidate: commandValidate
    });
    cm = cs_console.innerConsole();
    inputValue = 'hello worldy\nthis is\nmulti-line';
    cs_console.setValue(inputValue);
    return ok(cm.getValue().match(new RegExp(inputValue)));
  });

  module('Public API: #getValue');

  test('it returns the value of the input line', function() {
    var callbackCalled, cm, commandValidate, cs_console, inputValue;

    callbackCalled = false;
    commandValidate = function() {
      return callbackCalled = true;
    };
    cs_console = createConsole({
      commandValidate: commandValidate
    });
    cm = cs_console.innerConsole();
    inputValue = 'hello worldy';
    cm.setLine(cm.lineCount() - 1, "> " + inputValue);
    return equal(cs_console.getValue(), inputValue);
  });

  test('it returns the multi-line value of the input line', function() {
    var callbackCalled, cm, commandValidate, cs_console, inputValue;

    callbackCalled = false;
    commandValidate = function() {
      return callbackCalled = true;
    };
    cs_console = createConsole({
      commandValidate: commandValidate
    });
    cm = cs_console.innerConsole();
    inputValue = 'hello worldy\nthis is\nmulti-line';
    cm.setLine(cm.lineCount() - 1, "> " + inputValue);
    return equal(cs_console.getValue(), inputValue);
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
    ok( cm.getLine(0).match(new RegExp(welcomeMessage)) );
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