
// first demo of simple mde
(function($) {
    id = "editable";
    var simplemde = new SimpleMDE({
        element: $("textarea#" + id)[0]
    });
    toolbarInitialTop = $('.editor-toolbar').offset().top;
    toolbarOuterHeight = $('.editor-toolbar').outerHeight();
    toolbarFixedTop = 0;
    cmPaperTop = toolbarFixedTop + toolbarOuterHeight;
    toolbarAffixAt = toolbarInitialTop - toolbarFixedTop;
    $(document).scroll(fnAffix);
    $(document).resize(fnSetWidth);
    function fnAffix() {
        // Fix toolbar at set distance from top
        // and adjust toolbar width
        if ($(document).scrollTop() > toolbarAffixAt) {
            $('.editor-toolbar').addClass('toolbar-fixed');
            $('.editor-toolbar').css({'top': toolbarFixedTop + 'px'});
            $('.CodeMirror.cm-s-paper.CodeMirror-wrap').css({'top': cmPaperTop + 'px'});
            fnSetWidth();
        }
        else {
            $('.editor-toolbar').removeClass('toolbar-fixed');
            $('.CodeMirror.cm-s-paper.CodeMirror-wrap').css({'top': ''});
        }
    }
    function fnSetWidth() {
        // Adjust fixed toolbar width to the width of CodeMirror
        $('.toolbar-fixed').width($('.CodeMirror.cm-s-paper.CodeMirror-wrap').width());
    }
})(jQuery);