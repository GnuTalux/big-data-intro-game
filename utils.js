/* util functions for AceEditor */

Editor = {
  get: function (editorId, options) {
    var editor = ace.edit(editorId);

    if (options) {
      editor.setOptions(options);
    }

    editor.setFontSize(12);

    var editorQuery = $("#" + editorId);

    editor.on("input", function () {
      editorQuery.height(Editor.getContentHeight(editor));
    });

    return editor
  },

  getContentHeight: function (editor) {
    var countLines = Math.max(3, Math.min(editor.getOptions().maxLines, editor.session.getLength()));
    // + 1 will prevent horizontal scroll bar from overlapping last line.
    return (countLines) * editor.renderer.lineHeight + editor.renderer.scrollBar.getWidth();
  },

  execJS: function (editor1, editor2) {
    var code = editor1.session.getValue() + "\n" + ((editor2) ? editor2.getValue() : "") + "\n";

    var funcDef = "function __CALL_THIS_FUNC__(){\nvar __RESULTS__ = []; var console = {log: function(msg) {__RESULTS__.push(msg)}};  \n" +
      code + "\nreturn __RESULTS__;};\n";

    console.log(funcDef);

    eval(funcDef);

    return __CALL_THIS_FUNC__();
  },

  hasCodeLines: function (editor) {
    var code = editor.session.getValue();
    return !(/^\s*$/.test(code.replace(/\/*.+?\/|\/\/.*(?=[nr])/g, "")));
  },

  hasSyntaxErrors: function (editor) {
    return editor.session.getAnnotations().some(function (anno) {
      return anno.type == "error"
    })
  },

  loadContent: function(editor, url, section, callback) {
    var div = $("div.helper");
    div.load(url + " ." + section, function(respTxt, statusTxt, xhr) {
      if (statusTxt == 'success') {
        editor.session.setValue(div.text().trim());
        if (callback) callback();
      }
    });
  },

  loadLevel: function(levelNo, editorInstructionCode, editorUserInput, editorSolutionCode, editorStartCode) {
    var levelFile = "level/level" + levelNo + ".html";
    console.log('LOAD ' + levelFile);
    Editor.loadContent(editorInstructionCode, levelFile, "editor-instruction-code", function () {
      /* editor for code */
      editorUserInput.session.setOption("firstLineNumber", editorInstructionCode.session.getLength() + 1);
      editorSolutionCode.session.setOption("firstLineNumber", editorInstructionCode.session.getLength() + 1);
      Editor.loadContent(editorSolutionCode, levelFile, "editor-solution-code");
      console.log('loadContent')
    });
    editorUserInput.session.doc.setValue("");

    Editor.loadContent(editorStartCode, levelFile, "editor-start-code");
    $("h1").load(levelFile + " .level-title");
    $("div.instruction").load(levelFile + " .level-instruction");
  }
};

compareArray = function (lhs, rhs) {
  if (lhs.length != rhs.length)
    return false;

  for (var i = 0; i < lhs.length; i++) {
    if (lhs[i] != rhs[i]) return false;
  }

  return true;
};
