$(function(){
   refreshChats();

   $("#btnClosePage").attr('onclick', 'client.pages.notes.show();');

});
function refreshChats()
{
    $("#list").html("");
    var token = $.cookie('apretaste-pizarra');

    if(token !== null)
    {
        var items = client.run('NOTA', '', token);
        var tpl = $("#template").html();
        for (var i in items.contacts)
        {
            var html = tpl;

            for(var prop in items.contacts[i].last_note)
            {
                html = html.replace('{{ last_note.' + prop + ' }}', items.contacts[i].last_note[prop]);
            }

            for(var prop in items.contacts[i])
            {
                html = html.replace('{{ ' + prop + ' }}', items.contacts[i][prop]);
            }

            $("#list").append(html);
        }
    }
}