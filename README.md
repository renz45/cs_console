#Code School Console
This console was designed to take advantage of code mirrors excellent key input
and code highlight ability. The idea is that we should let code mirror handle all
the hard key input stuff while we focus on the console ui. We can also use any
code mirror addon/plugin out there.

This is a console interface, there is no inbuilt ability to eval javascript, or
run shell commands. Likely such a console would use this as the ui for these
types of functionality.

The demo.html file implements a very simple javascript eval to show console
functionality. You can also visit the [demo page](http://renz45.github.io/cs_console/)
to try out a very basic javascript implementation.


##Dependencies:
This console uses the Code Mirror 3 editor internally, so it and it's associated
files are needed to make the console work. There are different build options that
allow you to compile a version of the console without code mirror if you are already
loading it as part of the larger project.

* CodeMirror:
    - vibrant-ink theme
    - Code Mirror 2 Editor

##Usage:
  You can Instantiate CSConsole and pass a variety of options to customize the console
  functionality.

###Options:
* **prompt** - Sets the console prompt, this can be anything
* **initialValue** - Sets the initialValue of the console input field
* **historyLabel** - Sets a label for the localStorage history. This should be set if you don't want consoles from different applications to share history
* **welcomeMessage** - An initial message at the top of the console when it first loads
* **autoFocus** - Whether or not the console should be focused on page load.
* **syntax** - set the syntax of the console, useful for ruby irb or javascript consoles.
* **commandValidate** - Callback function for validating a command before it's submitted. This callback should return a boolean
* **maxHistoryEntries** - Limits the amount of history stored for the current history label
* **commandHandle** - Callback function for handling a command. This callback is passed the following arguments:
    - ***inputContent*** - This is the content of the input
    - ***responder*** - The responder is used to send some sort of a response to the console. This can be an asyncronous response. The className sets a class name on the html element of the output widget. The content can be either a string, or a valid HTMLElement. *Note, this is not a jQuery object*.

        Also, the console will not enter a state where it is ready for another command unless this responder has been called. If you want to implement a command that does not have any output Something like 'next' for progressing through course levels, then make sure to call the responder passing a falsy value(or nothing) The format of this response can be either an array of objects or a single object.

        **Example:**

        ```javascript
        [
            {content: "Blah blah output\noutput", className: 'console-output'},
            {content: "Blah blah output\noutput", className: 'console-error'}
        ]
        ```




* **prompt** - This is the value of the prompt set in the editor.
* **theme** - Set the code mirror theme, defaults to 'vibrant-ink'
* **lineNumbers** - Enables line numbers, defaults to false

##API Methods
* **setValue(string)** - Set the value of the input line
* **getValue** - Get the value of the input, this includes multiline input
* **setPrompt(string)** - Set the prompt
* **reset(prompt)** - Clear the console, pass false to this method to not display the welcome message.
* **buildWidget(lineNumber, responseObject)** - Manually create a output widget. This requires a lineNumber and a response object like the one used in the commandHandle callback Method above.
* **innerConsole** - Return the CodeMirror instance used within the console, useful for low level interface functionality.
* **focus** - Focus the input typer box
* **appendToInput** - Append a value to the typer box


##Misc tips and troubles
If you find that the console gets stuck in a state where the prompt isn't being displayed
and it's not responding to input, make sure that responder is called in your 'commandHandle'
callback at some point. If you don't want to display any output just call the responder with
an empty or falsy argument to force the console to ready itself for more input.

##Building cs_console
The cs_console uses thor and rake-pipeline to compile all the javascript and css into single files to make
it more portable. At code school we almost never need to include code mirror with the console
since most courses are already using it. You can rebuild the console files to only include
the console javascript and nothing from code mirror if needed.

You can also build the console with code mirror and only include the code highlighting
modes and theme that you need. This way you don't load a bunch of extra stuff that just
takes up space.

You can run the build script by typing: `./bin/cs_console build`

You can get a list of available options by typing: ` ./bin/cs_console`

The single javascript file `cs_console.js` and css `cs_console.css` will be placed in the
`/compiled` directory.

Currently there are two recipes available:
* **all** - Builds the console with all code mirror javascript. This option will prompt you do enter a list of modes and a theme.
* **no_cm** - Builds the console with only console javascript.

Example usage: `./bin/cs_console build -t no_cm`


##cs_console Development
If you want to do development on cs_console, you will need to start a simple
rackup server that compiles assets on page reload so the coffeescript files can
be tested.

Open a terminal and type `rackup` and visit: `http://localhost:9292/test/test.html`
You can also visit `http://localhost:9292/demo_app/demo.html` to run the demo app, running
the demo in this manner recompiles all the files every time the page is loaded, which
is useful for development.
*The config.ru file holds the server code.*
