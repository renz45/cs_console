# The MIT License (MIT)

# Copyright (c) 2013 Adam Rensel, Code School LLC

# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:

# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.

# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.
class window.CSConsole
  keyMap:
    'Alt-Delete': "delGroupAfter"
    'Alt-Left': "goGroupLeft"
    'Alt-Right': "goGroupRight"
    'Cmd-Right': "goLineEnd"
    'Ctrl-E': "goLineEnd"
    'Ctrl-Alt-Backspace': "delGroupAfter"
    'Delete': "delCharAfter"
    'End': "goLineEnd"
    'Home': "goLineStartSmart"
    'PageDown': "goPageDown"
    'PageUp': "goPageUp"
    'Right': "goCharRight"
    'Ctrl-F': "goCharRight"

  outputWidgets: []
  currentLine: 0
  submitInProgress: false

  constructor: (el, options)->
    @options = options
    @options.prompt = '> ' unless @options.prompt

    @initCallbacks(options)
    @initializeKeyMap()
    @initConsole(el)
    @submitHistory = new CSConsoleHistory(@options)

  # Sets a value for the console input
  setValue: (value)=>
    @console.setLine(@lineNumber(), "#{@options.prompt}#{value}")

  # Gets all input current un submitted in the console, this includes multiline input
  getValue: =>
    @getAllInput()

  # Sets the prompt
  setPrompt: (prompt)=>
    @console.setLine(@currentLine, @console.getLine(@currentLine).replace(new RegExp(@options.prompt), prompt))
    @options.prompt = prompt

  # Focus the typer input box
  focus: ->
    @console.getInputField().focus()

  # Append the value to the input box
  appendToInput: (value)->
    @console.setLine(@lineNumber(), "#{@console.getLine(@lineNumber())}#{value}")

  # Gets all input, even if it is a multiline paste into the console.
  getAllInput: =>
    startingInput = @currentLine
    input = []

    while startingInput <= @lineNumber()
      if startingInput == @currentLine
        lineInput = @console.getLine(startingInput).substr(@promptLength(), @console.getLine(@currentLine).length)
        input.push(lineInput)
      else
        input.push(@console.getLine(startingInput))
      startingInput++
    input.join("\n")

  # Clear the console of all input and display the welcome message again
  # Pass false to this method to not display the welcome message
  reset: (welcomeMessage=true)=>
    @submitInProgress = false
    @console.setValue('')
    for widget in @outputWidgets
      @console.removeLineWidget(widget)

    @outputWidgets = []

    if @options.welcomeMessage && welcomeMessage
      @showWelcomeMessage()
      @moveInputForward()

    @console.refresh()
    @console.scrollIntoView()

  # Get the inner console object, this is a Codemirror instance
  innerConsole: =>
    @console

  ##############################################################
  #                         Private                            #
  ##############################################################

  # Load the custom keymap into code mirror
  initializeKeyMap: ->
    window.CodeMirror.keyMap.console = @keyMap

  # Instantiate an instance of code mirror with various options
  initConsole: (el)->
    el.className += " cs-console cs-console-height cs-console-width"

    keyActions = new KeyActions(@options)

    @console = window.CodeMirror(el, {
      mode:
        name: @options.syntax
        useCPP: true
      gutter: @options.lineNumbers
      lineNumbers: @options.lineNumbers
      theme: @options.theme || "vibrant-ink"
      indentUnit: 2
      tabSize: 2
      keyMap: 'console'
      lineWrapping: true
      onKeyEvent: @focusInput
      undoDepth: 0 # CodeMirror undo borks the console layout
      autoFocus: @options.autoFocus
      extraKeys:
        "Enter": @submit
        "Ctrl-M": @submit
        "Tab": @noop #autocomplete eventually maybe
        "Left": keyActions.goCharLeft
        "Ctrl-B": keyActions.goCharLeft
        "Backspace": keyActions.delCharBefore
        "Cmd-Up": keyActions.goDocStart
        "Cmd-Down": keyActions.goDocEnd
        "Cmd-Left": keyActions.goLineStart
        "Home": keyActions.goLineStart
        "Ctrl-A": keyActions.goLineStart
        "Alt-Backspace": keyActions.delGroupBefore
        "Ctrl-W": keyActions.delGroupBefore
        "Cmd-Backspace": keyActions.deleteLine
        "Up": @nextHistory
        "Down": @previousHistory
        "Ctrl-P": @nextHistory
        "Ctrl-N": @previousHistory
        # Reseting the keymap doesn't disable these key combos
        # so we set them to an empty function
        "Shift-Cmd-Right": @noop
        "Shift-Cmd-Left": @noop
        "Shift-Right": @noop
        "Shift-Alt-Right": @noop
        "Shift-Alt-Left": @noop
        "Ctrl-Enter": @noop
        "Alt-Enter": @noop
        "Shift-Tab": @noop
        "Cmd-S": @noop
        "Ctrl-Z": @noop # Disable undo since it borks the console interface
        "Cmd-Z": @noop # Disable undo since it borks the console interface
    })

    keyActions.setConsole(@console)

    setTimeout ( =>
      @console.refresh()
    ), 1

    # Add classes the various code mirror elements so we can resize the console easier
    @console.getScrollerElement().className += " cs-console-height"
    @console.getWrapperElement().className += " cs-console-height cs-console-width"

    if @options.welcomeMessage
      @showWelcomeMessage()
    
    # set the initial value if one exists
    if @options.initialValue
      @setValue(@options.initialValue)
      @moveInputForward()

    # Autofocus the input if the autoFocus option is set
    if @options.autoFocus
      setTimeout ( =>
        @console.getInputField().focus()
      ), 10

    @moveInputForward()


  # This method is called whenever a key event is fired within code mirror.
  # This will ensure that the cursor is only typing into the bottom most line
  # no matter where it's located at the start of typing.
  focusInput: (cm, evt)=>
    cursorPos = @console.getCursor()
    if cursorPos.line == @lineNumber()
      @storedCursorPosition = @console.getCursor()
      if cursorPos.ch < @promptLength()
        @console.setCursor({line: cursorPos.line, ch: @promptLength()})
    else
      @console.setCursor(@storedCursorPosition)

    #returning false is required here or the key event gets eaten
    return false

  # pull the next history from the history class
  nextHistory: =>
    @setValue(@submitHistory.nextHistory())

  # pull the previous history from the history class
  previousHistory: =>
    @setValue(@submitHistory.previousHistory())

  # show the welcome message first when the console loads
  showWelcomeMessage: =>
    # Set the initial input to a blank line so we can add a widget above it
    @console.setValue("")
    line = {content: @options.welcomeMessage}
    @buildWidget(1, line, {above: true})


  # Assign callbacks to instance variables
  initCallbacks: (options)=>
    @commandValidate = options.commandValidate
    @commandHandle = options.commandHandle 

  # submit the corrent input, store the input in the command history
  submit: =>
    input = @getAllInput()
    if ( @options.commandValidate == undefined || @options.commandValidate(input) ) && !@submitInProgress
      @submitInProgress = true
      @submitHistory.push(input)
      @submitHistory.resetIndex()
      @commandHandle(input, @responseObject(), @options.prompt)
    else if @submitInProgress
      @nonReactingNewline()
    else
      @moveInputForward()

  # Add a newline to the editor that doesn't include the prompt
  nonReactingNewline: ->
    @currentLine = @lineNumber()
    @console.setLine(@currentLine,  "#{@inputLine()}\n")

  # get length of the prompt as an int
  promptLength: =>
    @options.prompt.length

  # get the content of the single input line
  inputLine: =>
    @console.getLine(@lineNumber())

  # Get the current input line number
  lineNumber: =>
    @console.lineCount() - 1

  # Returns a response object linked to the current line. This object can be used to
  # post responses asyncronously. The format of the response given to this response object is:

  # [
  #   {content: "Blah blah output\noutput", className: 'console-output', type: 'text'}
  #   {content: "Blah blah output\noutput", className: 'console-error', type: 'text'}
  # ]

  # An array of objects or a single object can be passed to the responseObject.
  responseObject: =>
    return (responseLines)=>
      @renderResponse(responseLines)

  # This method is called from the responseObject when a user passes content
  renderResponse: (responseLines)=>
    unless responseLines
      @moveInputForward()
      @submitInProgress = false
      return

    lineNumber = @lineNumber()
    if responseLines.constructor == Array
      for line in responseLines
        @buildWidget(lineNumber, line)
    else
      @buildWidget(lineNumber, responseLines)

    @buildWidget(lineNumber, {content: document.createElement('p'), className: 'cs-console-output-spacer bottom'})
    @moveInputForward()
    @submitInProgress = false

  htmlEscape: (string)->
    (''+string).replace(/&(?!\w+;|#\d+;|#x[\da-f]+;)/gi, '&amp;')
               .replace(/</g, '&lt;')
               .replace(/>/g, '&gt;')
               .replace(/"/g, '&quot;')
               .replace(/'/g, '&#x27;')
               .replace(/\//g,'&#x2F;')

  # Build a line widget containing the output given by the responseObject
  buildWidget: (lineNumber, responseLine, widgetOptions = {})=>
    widgetContent = if responseLine then responseLine.content else ''

    if @isHtmlElement(widgetContent)
      widgetElement = widgetContent
    else
      widgetElement = document.createElement('div')
      widgetElement.innerHTML = @formatWidgetElementText(@htmlEscape(widgetContent))
      widgetElement.className = "cs-console-output-element"
      widgetElement.style.whiteSpace = 'pre-wrap'

    if responseLine?.className
      widgetElement.className += " #{responseLine.className}"

    if Object.keys(widgetOptions).indexOf('coverGutter') < 0
      widgetOptions.coverGutter = false

    if Object.keys(widgetOptions).indexOf('noHScroll') < 0
      widgetOptions.noHScroll = true

    @outputWidgets.push(@console.addLineWidget(lineNumber, widgetElement, widgetOptions))
    
    setTimeout =>
      @console.scrollIntoView({line: @console.lineCount() - 1, ch: 0})
    ,
      100

  # Test if the given object is an HTMLElement
  isHtmlElement: (obj)->
    obj && obj.constructor.toString().search(/HTML.+Element/) > 0

  # Format the content of it is text.
  # Replace \n with <br />
  # Replace ansi terminal color codes with spaces styled for the appropriate colors
  formatWidgetElementText: (message)=>
    # This might be specific to the git executor, but  space is being inserted on the first
    # line, this is a quick fix
    message = message.replace(/^\s/, '')

    message = "<p class='cs-console-output-spacer top'></p>#{message}"

    @addColors(message)

  # Replace ansi terminal color codes with spaces styled for the appropriate colors
  addColors: (message)=>
    filter = new window.ansi_to_html()
    filter.toHtml(message)

  # Move the input forward and lock the previous lines to editing
  moveInputForward: =>
    @currentLine = @lineNumber() + 1
    @console.setLine(@currentLine - 1,  "#{@inputLine()}\n#{@options.prompt}")

    # ensure that the cursor is at the prompt
    @storedCursorPosition = {line: @currentLine, ch: @promptLength()}
    @console.setCursor(@storedCursorPosition)

  # This message is used to prevent some key combinations from doing anything.
  # This is needed since the keymap won't allow you to disable some keys for some reason.
  noop: ->
    #pointing some keys here to disable them

  # This class contains key overrides that replace actions that might:
  #   - Allow the cursor to move back up a line
  #   - Delete characters on previous lines
  #   - Move the cursor off the input line
  class KeyActions
    # default code mirror key commands
    _defaultCommands:
      CodeMirror.commands

    constructor: (options)->
      @options = options

    # set a console object, this is most likely a code mirror instance
    setConsole: (console)=>
      @console = console

    # move the cursor left. Left arror key
    goCharLeft: =>
      if @isCursorAtPrompt()
        @_defaultCommands.goCharLeft(@console)

    # delete the character to the left. Backspace key
    delCharBefore: =>
      if @isCursorAtPrompt()
        @_defaultCommands.delCharBefore(@console)

    # scroll to the very top. Cmd/ctrl Up
    goDocStart: =>
      @console.scrollIntoView({line:0, ch: 0})

    # scroll to the very bottom. Cmd/ctrl Down
    goDocEnd: =>
      @console.scrollIntoView({line: @consoleLineCount(), ch: 0})

    # move the cursor to the start of the line. Cmd/Ctrl Left
    goLineStart: =>
      cursorPos = @console.getCursor()
      @console.setCursor({line: cursorPos.line, ch: @promptLength()})

    # Delete the last group to the left. Alt Backspace
    delGroupBefore: =>
      cursorStartPos = @console.getCursor()

      @console.moveH(-1, "group")
      futurePos = @console.getCursor().ch

      @console.setCursor(cursorStartPos)

      if futurePos >= @promptLength()
        @_defaultCommands.delGroupBefore(@console)

    deleteLine: =>
      @console.setLine(@console.getCursor().line, @options.prompt)

    # utility methods
    consoleLineCount: =>
      @console.lineCount() - 1

    promptLength: =>
      @options.prompt.length

    isCursorAtPrompt: =>
      @console.getCursor().ch > @promptLength()

  # This class contains methods for keeping terminal input history. It also
  # saves commands in local storage so history can be persisted between sessions.
  # A historyLabel option can be used to set a custom entry in local storage.
  class CSConsoleHistory
    storage: {}
    currentIndex: 0
    historyLabel: 'cs-console-history'
    cachedHistory: []
    maxEntries: 25
    constructor: (options)->
      @options = options
      if @options.historyLabel
        @historyLabel = "cs-#{@options.historyLabel}-console-history"
      
      if @options.maxEntries
        @maxEntries = options.maxHistoryEntries

      if @localStorageExists()
        @storage = window.localStorage
        localHistory = @getHistory()
        if localHistory
          @cachedHistory = localHistory
        @currentIndex = @cachedHistory.length - 1

    # Test if local storage exists on the current browser
    localStorageExists: ->
      try
        !!(window['localStorage'] != null && window.localStorage)
      catch e
        return false

    # push a new command into history. If the last command is the same as
    # the new command, it will not be saved.
    push: (item)=>
      return unless item
      currentHistory = @getHistory()
      return if currentHistory[currentHistory.length - 1] == item

      currentHistory.push(item)
      
      # Truncate extra history
      if currentHistory.length >= @maxEntries
        startSlice = currentHistory.length - @maxEntries
        currentHistory = currentHistory.slice(startSlice, currentHistory.length)
      
      @cachedHistory = currentHistory
      @storage[@historyLabel] = JSON.stringify(currentHistory)
      @currentIndex = currentHistory.length - 1

    # Retrieve the history from local storage
    getHistory: =>
      if @storage[@historyLabel] then JSON.parse(@storage[@historyLabel]) else []

    # Get the current history value and decrement the current index pointer
    nextHistory: =>
      if @cachedHistory.length > 0
        history = @cachedHistory[@currentIndex]
      else
        history = ''

      if @currentIndex > 0
        @currentIndex--

      return history

    # Get the current history value and increment the current index pointer
    previousHistory: =>
      if @currentIndex < @cachedHistory.length - 1
        @currentIndex++
        return @cachedHistory[@currentIndex]
      else
        return ''

    # Clear all cached and local storage history
    clearHistory: ->
      @storage[@historyLabel] = "[]"
      @cachedHistory = []

    # Reset the history index back to the most current entry
    resetIndex: ->
      @currentIndex = @cachedHistory.length - 1
