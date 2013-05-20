(function(){

  module('Public API: #setValue');
  test('it sets the value of the input line', function(){
    var callbackCalled = false;

    var commandValidate = function(){callbackCalled = true;}

    var cs_console = createConsole({
      commandValidate: commandValidate
    });

    var cm = cs_console.innerConsole();

    var inputValue = 'hello worldy';
    cs_console.setValue(inputValue);

    ok( cm.getLine(cm.lineCount()-1).match(new RegExp(inputValue)) );
  });

  test('it sets the multi-line value of the input line', function(){
    var callbackCalled = false;

    var commandValidate = function(){callbackCalled = true;}

    var cs_console = createConsole({
      commandValidate: commandValidate
    });

    var cm = cs_console.innerConsole();

    var inputValue = 'hello worldy\nthis is\nmulti-line';
    cs_console.setValue(inputValue);

    ok( cm.getValue().match(new RegExp(inputValue)) );
  });

  module('Public API: #getValue')
  test('it returns the value of the input line', function(){
    var callbackCalled = false;

    var commandValidate = function(){callbackCalled = true;}

    var cs_console = createConsole({
      commandValidate: commandValidate
    });

    var cm = cs_console.innerConsole();

    var inputValue = 'hello worldy';
    cm.setLine(cm.lineCount()-1, "> " + inputValue);

    equal( cs_console.getValue(), inputValue );
  });

  test('it returns the multi-line value of the input line', function(){
    var callbackCalled = false;

    var commandValidate = function(){callbackCalled = true;}

    var cs_console = createConsole({
      commandValidate: commandValidate
    });

    var cm = cs_console.innerConsole();

    var inputValue = 'hello worldy\nthis is\nmulti-line';
    cm.setLine(cm.lineCount()-1, "> " + inputValue);

    equal( cs_console.getValue(), inputValue );
  });

})();