cm = null
csConsole = null
inputValue = ''
consoleOptions =
  commandHandle: commandHandle = ->
  commandValidate: commandValidate = (line)->
    return true
  prompt: '> '

setup = ->
  csConsole = createConsole(consoleOptions)
  csConsole.reset()
  cm = csConsole.innerConsole()
  inputValue = 'hello Worldy'

currentLine = ->
  cm.getLine(cm.lineCount()-1)


module('Public API: #setValue', {setup: setup})
test 'it sets the value of the input line', ->
  csConsole.setValue(inputValue)
  ok( currentLine().match(new RegExp(inputValue)) )

test 'it sets the multi-line value of the input line', ->
  inputValue = 'hello worldy\nthis is\nmulti-line'
  csConsole.setValue(inputValue)
  ok( cm.getValue().match(new RegExp(inputValue)) )

module('Public API: #getValue', {setup: setup})
test 'it returns the value of the input line', ->
  cm.setLine(cm.lineCount()-1, "> " + inputValue)
  equal( csConsole.getValue(), inputValue )

test 'it returns the multi-line value of the input line', ->
  inputValue = 'hello worldy\nthis is\nmulti-line'
  cm.setLine(cm.lineCount()-1, "> " + inputValue)
  equal( csConsole.getValue(), inputValue )

module('Public API: #setPrompt', {setup: setup})
test 'it sets the prompt of the editor', ->
  newPrompt = "<< "
  csConsole.setValue(inputValue)
  ok currentLine().match(new RegExp("^" + consoleOptions.prompt + inputValue))
  csConsole.setPrompt(newPrompt)
  ok currentLine().match(new RegExp("^" + newPrompt + inputValue))

module('Public API: #reset', {setup: setup})
test 'it should clear the console', ->
  csConsole.commandHandle = (line, responder,prompt)->
    responder({content: line})
  csConsole.setValue(inputValue)
  csConsole.submit()
  csConsole.setValue(inputValue)
  ok csConsole.outputWidgets.length > 0
  csConsole.reset()
  ok csConsole.outputWidgets.length == 0
  ok csConsole.getValue().length == 0

test 'it should clear the console and show the welcome message if available', ->
  csConsole.commandHandle = (line, responder,prompt)->
    responder({content: line})
  csConsole.options.welcomeMessage = "I welcome you"
  csConsole.setValue(inputValue)
  csConsole.submit()
  csConsole.setValue(inputValue)
  ok csConsole.outputWidgets.length > 0
  csConsole.reset()

  ok csConsole.outputWidgets.length == 1
  ok csConsole.getValue().length == 0
  ok csConsole.outputWidgets[0].node.innerText.match(new RegExp(csConsole.options.welcomeMessage))

test 'it should clear the console and not show the welcome message if false is passed to reset(false)', ->
  csConsole.commandHandle = (line, responder,prompt)->
    responder({content: line})
  csConsole.options.welcomeMessage = "I welcome you"
  csConsole.setValue(inputValue)
  csConsole.submit()
  csConsole.setValue(inputValue)
  ok csConsole.outputWidgets.length > 0
  csConsole.reset(false)
  ok csConsole.outputWidgets.length == 0
  ok csConsole.getValue().length == 0
  ok !cm.getValue().match(new RegExp(csConsole.options.welcomeMessage))

module('Public API: #buildWidget', {setup: setup})
test 'it creates the specified widget', ->
  csConsole.commandHandle = (line, responder,prompt)->
    responder(false)

  widgetContent = 'Widget content!'
  widgetClass = 'widget-class-yo'

  csConsole.setValue(inputValue)
  csConsole.submit()
  csConsole.buildWidget(0, {content: widgetContent, className: widgetClass})
  ok csConsole.outputWidgets[0].node.className.match(new RegExp(widgetClass))
  ok csConsole.outputWidgets[0].node.innerText.match(new RegExp(widgetContent))
  ok csConsole.outputWidgets.length > 0

module('Public API: #appendToInput', {setup: setup})
test 'it appends to the input field', ->
  appendedInput = 'APPENDTOYOU'
  csConsole.setValue(inputValue)
  csConsole.appendToInput(appendedInput)
  ok currentLine().match(new RegExp(inputValue + appendedInput))
