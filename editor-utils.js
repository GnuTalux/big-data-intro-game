function GetEditor(editorId, options) {
  var editor = ace.edit(editorId);

  if (options) {
    editor.setOptions(options);
  }

  editor.setTheme("ace/theme/github");
  editor.session.setMode("ace/mode/javascript");
  editor.setFontSize(12);

  AdjustEditorHeight(editorId, editor);
  editor.on("change", function() {
    AdjustEditorHeight(editorId, editor);
  });

  return editor
}

function GetEditorContentHeight(editor) {
  return editor.session.getDocument().getLength() * editor.renderer.lineHeight + editor.renderer.scrollBar.getWidth()
}

function AdjustEditorHeight(editorId, editor, maxLines) {
  var maxLines = editor.getOptions().maxLines;
  var height = (maxLines) ? Math.min(GetEditorContentHeight(editor), maxLines) : GetEditorContentHeight(editor);
  $("#"+editorId).height(height);
}