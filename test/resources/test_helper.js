/*
This file contains any helper methods used in tests. Any external test files
should be loaded after this file and be self executing functions
*/

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
    commandHandle: options.commandHandle
  });
}

