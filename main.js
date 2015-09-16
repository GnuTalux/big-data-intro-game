var gameLevel = "1";

$(document).ready(function () {
  /* editor for instruction code */
  var editorInstructionCode = Editor.get("editor-instruction-code", {
      mode: "ace/mode/javascript",
      theme: "ace/theme/github",
      highlightActiveLine: false,
      readOnly: true,
      maxLines: 150
    }
  );

  var editorStartCode = Editor.get("editor-start-code", {
      highlightActiveLine: false,
      readOnly: true,
      maxLines: 0
    }
  );

  /* editor for output */
  var editorUserOutput = Editor.get("editor-user-output", {
      mode: "ace/mode/text",
      theme: "ace/theme/tomorrow_night_blue",
      highlightActiveLine: false,
      readOnly: true,
      maxLines: 50
    }
  );

  var editorSolutionOutput = Editor.get("editor-solution-output", {
      mode: "ace/mode/text",
      theme: "ace/theme/tomorrow_night_blue",
      highlightActiveLine: false,
      readOnly: true,
      maxLines: 50
    }
  );

  /* editor for code */
  var editorUserInput = Editor.get("editor-user-input", {
      mode: "ace/mode/javascript",
      theme: "ace/theme/github",
      maxLines: 150
    }
  );
  var editorSolutionCode = Editor.get("editor-solution-code", {
      mode: "ace/mode/javascript",
      theme: "ace/theme/github",
      highlightActiveLine: false,
      readOnly: true,
      maxLines: 150
    }
  );


  /* dynamically load content */
  Editor.loadLevel(1, editorInstructionCode, editorUserInput, editorSolutionCode, editorStartCode);

  var tries = 0;

  $("#btn-eval").on("click", function () {
    var isDisplaySolution = false;

    if (!Editor.hasCodeLines(editorUserInput))
      return;

    $(this).prop("disabled", true);

    if (Editor.hasSyntaxErrors(editorUserInput)) {
      editorUserOutput.session.setValue("Dein Code enthält Syntax-Fehler!");
    }
    else {
        var resultUserInput = Editor.execJS(editorStartCode, editorUserInput);
        var resultSolutionCode = Editor.execJS(editorStartCode, editorSolutionCode);

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
    if (isDisplaySolution) $("#btn-solve-show").fadeIn("slow");

    $(this).prop("disabled", false);
  });

  $("#btn-solve-show").on("click", function () {
    $(this).hide();
    $("#btn-solve-hide").show();
    $("pre.editor.solution").fadeIn("slow");
  });

  $("#btn-solve-hide").on("click", function () {
    $(this).hide();
    $("#btn-solve-show").show();
    $("pre.editor.solution").fadeOut("slow");
  });

  $("button.level-nav").on("click", function () {
    if ($(this).hasClass('selected')) {
    }
    else {
      $("button.level-nav.selected").first().removeClass("selected");
      $(this).addClass("selected");
      Editor.loadLevel(this.id, editorInstructionCode, editorUserInput, editorSolutionCode, editorStartCode);
      $("pre.editor.solution, #editor-user-output, #btn-solve-show, #btn-solve-hide").hide();
    }
  });
});
