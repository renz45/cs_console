createConsole = function(options){
  var el = document.getElementById('console');
  el.className = 'console'
  el.innerHTML = ''

  options = options ? options : {}

  return new CSConsole(el,{
    prompt: options.prompt,
    historyLabel: options.historyLabel,
    syntax: options.syntax,
    welcomeMessage: options.welcomeMessage,
    autoFocus: options.autoFocus,
    commandValidate: options.commandValidate,
    commandHandle: options.commandHandle,
    commandCancel: options.commandCancel
  });
}

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
  var historyLabel = 'test-console'
  var prompt = '>> '
  var cs_console = createConsole({
    historyLabel: historyLabel,
    prompt: prompt,
    commandHandle: function(line, report, prompt){report(false)}, 
  });

  var cm = cs_console.innerConsole();
  cm.setLine(cm.lineCount() - 1, prompt + "blah blah and more blah")
  cs_console.submit()

  ok( Object.keys(localStorage).join().match(new RegExp(historyLabel)) );
});

test('setting a welcome message displays a welcome message', function(){
  var welcomeMessage = 'Hello, this is the console'
  var cs_console = createConsole({welcomeMessage: welcomeMessage});
  var cm = cs_console.innerConsole();
  ok( cm.getLine(0).match(new RegExp(welcomeMessage)) );
});

test('setting autoFocus to true starts the console with focus', function(){
  var welcomeMessage = 'Hello, this is the console'
  var cs_console = createConsole({
    autoFocus: true
  });
  var cm = cs_console.innerConsole();
  ok( cm.options.autoFocus);
});