function execJS(editor1, editor2) {
  var code = editor1.session.getValue() + "\n" + ((editor2) ? editor2.getValue() : "") + "\n";

  var funcDef = "function __CALL_THIS_FUNC__(){\nvar __RESULTS__ = []; var console = {log: function(msg) {__RESULTS__.push(msg)}};  \n" +
      code + "\nreturn __RESULTS__;};\n";
  eval(funcDef);
  return __CALL_THIS_FUNC__();
}

function containsJS(editor) {
  var code = editor.session.getValue();
  return !(/^\s*$/.test(code.replace(/\/*.+?\/|\/\/.*(?=[nr])/g, "")));
}

function isValidJS(editor) {
  return editor.session.getAnnotations().some(function (anno) {return anno.type == "error"})
}

function compareArray(lhs, rhs) {
  if (lhs.length != rhs.length)
    return false;

  for (var i = 0; i < lhs.length; i++) {
    if (lhs[i] != rhs[i]) return false;
  }

  return true;
}

$(document).ready(function () {
  var editorStart = GetEditor("editor-start", {highlightActiveLine: false, readOnly: true});

  var editorInput = GetEditor("editor-input", {
      firstLineNumber: editorStart.session.getLength() + 1,
      maxLines: 10
    }
  );
  var editorSolution = GetEditor("editor-solution", {
      highlightActiveLine: false,
      readOnly: true,
      firstLineNumber: editorStart.session.getLength() + 1,
      maxLines: 150
    }
  );

  var tries = 0;

  $("#btn-eval").on("click", function () {
    var isCountTry = true;
    var isDisplaySolution = false;

    if (isValidJS(editorInput)) {
      window.alert("Es befinden sich Syntaxfehler im Code.");
    }
    else {
      console.log(containsJS(editorInput));
      if (containsJS(editorInput)) {
        var resultInput = execJS(editorStart, editorInput);
        var resultSolution = execJS(editorStart, editorSolution);

        console.log('INPUT');
        console.log(resultInput);
        console.log('SOLUTION');
        console.log(resultSolution);

        if (compareArray(resultInput, resultSolution)) {
          window.alert("Super! Du hast es gelöst!");
          isDisplaySolution = true;
        }
        else {
          window.alert("Leider falsch.")
        }
      }
      else {
        isCountTry = false;
      }
    }

    if (isCountTry) if (++tries > 0) isDisplaySolution = true;
    if (isDisplaySolution)  $("#btn-solve").fadeIn("slow");
  });

  $("#btn-solve").on("click", function () {
    $(this).fadeOut("slow");
    $("#editor-solution").fadeIn("slow");
  });
});