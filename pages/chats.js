$(function(){
   refreshChats();
});
function refreshChats()
{
    $("#list").html("");
    var token = $.cookie('apretaste-pizarra');

    if(token !== null)
    {
        var items = pizarra.run('NOTA');
        var tpl = $("#template").html();
        for (var i in items.notes)
        {
            var html = tpl;

            for(var prop in items.notes[i].last_note)
            {
                html = str_replace('{{ last_note.' + prop + ' }}', items.notes[i].last_note[prop], html);
            }

            for(var prop in items.notes[i].profile)
            {
                html = str_replace('{{ chat.profile.' + prop + ' }}', items.notes[i].profile[prop], html);
            }

            for(var prop in items.notes[i])
            {
                html = str_replace('{{ ' + prop + ' }}', items.notes[i][prop], html);
            }

            $("#list").append(html);
        }
    }
}