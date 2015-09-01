$(document).ready(function() {
    var editor_start = GetEditor("editor-start", {highlightActiveLine: false, readOnly: true});

    var editor_input = GetEditor("editor-input", {
                firstLineNumber: editor_start.session.getLength() + 1,
                maxLines: 150
            }
    );
    var editor_solution = GetEditor("editor-solution", {
                highlightActiveLine: false,
                readOnly: true,
                firstLineNumber: editor_start.session.getLength() + 1,
                maxLines: 150
            }
    );

    var tries = 0;

    $("#btn-eval").on("click", function() {
        if (editor_input.session.getAnnotations().some(function(anno) { return anno.type == "error" }))  {
            window.alert("Es befinden sich Syntaxfehler im Code.");
        }
        else {
            window.alert("Führe Code aus.");
        }

        if (++tries > 0) {
            $("#btn-solve").show();
        }
    });

    $("#btn-solve").on("click", function() {
        $("#editor-solution").show();

    });
});