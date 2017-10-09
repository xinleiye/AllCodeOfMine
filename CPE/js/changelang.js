var g_langList = '';
function creatLangList() {
    if (jQuery.isArray(LANGUAGE_DATA.supportted_languages)) {
        if (LANGUAGE_DATA.supportted_languages.length > 20) {
            $('#language_list').css({
                'overflow-x': 'hidden',
                'overflow-y': 'scroll'
            });
        }
        $.each(LANGUAGE_DATA.supportted_languages, function(n, value) {
            if (value.replace(/-/, '_') == LANGUAGE_DATA.current_language) {
                $('#lang').val(eval(value.replace(/-/, '_')));
            }
            g_langList += '<option value = ' + value.replace(/-/, '_') + '\>' + eval(value.replace(/-/, '_')) + '</option>';
        });
    }
    else if ('undefined' != typeof(LANGUAGE_DATA.supportted_languages)) {
        var value = LANGUAGE_DATA.supportted_languages;
        $('#lang').val(eval(LANGUAGE_DATA.supportted_languages.replace(/-/, '_')));
        g_langList += '<option value = ' + value.replace(/-/, '_') + '\>' + eval(value.replace(/-/, '_')) + '</option>';
    }
}
$(function() {
    creatLangList();
});