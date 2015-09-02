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

    console.log(code);

    eval(code);

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

  loadContent: function(editor, url, section) {
    var div = $("div.helper");
    div.load(url + " ." + section, function(respTxt, statusTxt, xhr) {
      editor.session.setValue(div.text().trim());
    });
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
