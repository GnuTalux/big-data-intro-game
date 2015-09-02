function execJS(editor1, editor2) {
  var code = editor1.session.getValue() + "\n" + ((editor2) ? editor2.getValue() : "") + "\n";

  var funcDef = "function __CALL_THIS_FUNC__(){\nvar __RESULTS__ = []; var console = {log: function(msg) {__RESULTS__.push(msg)}};  \n" +
      code + "\nreturn __RESULTS__;};\n";
  eval(funcDef);
  return __CALL_THIS_FUNC__();
}

function hasCodeLines(editor) {
  var code = editor.session.getValue();
  return !(/^\s*$/.test(code.replace(/\/*.+?\/|\/\/.*(?=[nr])/g, "")));
}

function hasSyntaxErrors(editor) {
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
  /* editor for starting code */
  var editorStartCode = GetEditor("editor-start-code", {
      mode: "ace/mode/javascript",
      theme: "ace/theme/github",
      highlightActiveLine: false,
      readOnly: true
    }
  );

  /* editor for code */
  var editorUserInput = GetEditor("editor-user-input", {
      mode: "ace/mode/javascript",
      theme: "ace/theme/github",
      firstLineNumber: editorStartCode.session.getLength() + 1,
      maxLines: 150
    }
  );

  var editorSolutionCode = GetEditor("editor-solution-code", {
      mode: "ace/mode/javascript",
      theme: "ace/theme/github",
      highlightActiveLine: false,
      readOnly: true,
      firstLineNumber: editorStartCode.session.getLength() + 1,
      maxLines: 150
    }
  );

  /* editor for output */
  var editorUserOutput = GetEditor("editor-user-output", {
      mode: "ace/mode/text",
      theme: "ace/theme/tomorrow_night_blue",
      highlightActiveLine: false,
      readOnly: true,
      maxLines: 50
    }
  );

  var editorSolutionOutput = GetEditor("editor-solution-output", {
      mode: "ace/mode/text",
      theme: "ace/theme/tomorrow_night_blue",
      highlightActiveLine: false,
      readOnly: true,
      maxLines: 50
    }
  );

  var tries = 0;

  $("#btn-eval").on("click", function () {
    var isDisplaySolution = false;

    if (!hasCodeLines(editorUserInput))
      return;

    $(this).prop("disabled", true);

    if (hasSyntaxErrors(editorUserInput)) {
      editorUserOutput.session.setValue("Dein Code enthält Syntax-Fehler!");
    }
    else {
        var resultUserInput = execJS(editorStartCode, editorUserInput);
        var resultSolutionCode = execJS(editorStartCode, editorSolutionCode);

        var outputHeader;
        if (compareArray(resultUserInput, resultSolutionCode)) {
          isDisplaySolution = true;
          outputHeader = "Du hast es geschafft!";
        }
        else {
          outputHeader = "Deine Programmausgabe ist nicht richtig!";
        }

        if (resultUserInput)
          editorUserOutput.session.setValue([outputHeader].concat(resultUserInput).join("\n"));

        if (resultSolutionCode)
          editorSolutionOutput.session.setValue(["Lösung:"].concat(resultSolutionCode).join("\n"));
    }

    $("#editor-user-output").fadeIn("slow");

    if (++tries > 0) isDisplaySolution = true;
    if (isDisplaySolution) $("#btn-solve").fadeIn("slow");

    $(this).prop("disabled", false);
  });

  $("#btn-solve").on("click", function () {
    $(this).fadeOut("slow");
    $("pre.editor.solution").fadeIn("slow");
  });
});