createConsole = function(options){
  // var el = document.createElement('div')
  var el = document.getElementById('console');
  el.className = 'console'

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
  var prompt = "> ";
  var console = createConsole({
    prompt: prompt
  })
  var cm = console.innerConsole();

  ok( cm.getLine(cm.lineCount() - 1).match(new RegExp(prompt)) );
});