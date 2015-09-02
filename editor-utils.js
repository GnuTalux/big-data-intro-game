function GetEditor(editorId, options) {
  var editor = ace.edit(editorId);

  if (options) {
    editor.setOptions(options);
  }

  editor.setTheme("ace/theme/github");
  editor.session.setMode("ace/mode/javascript");
  editor.setFontSize(12);

  $("#"+editorId).height(GetEditorContentHeight(editor));
  editor.on("change", function() {
    $("#"+editorId).height(GetEditorContentHeight(editor));
  });

  return editor
}

function GetEditorContentHeight(editor) {
  var countLines = Math.min(editor.getOptions().maxLines, editor.session.getLength());
  // + 1 will prevent horizontal scrollbar from overlapping last line.
  return (countLines + 1) * editor.renderer.lineHeight + editor.renderer.scrollBar.getWidth();
}