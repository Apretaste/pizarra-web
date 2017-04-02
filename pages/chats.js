$(function(){
   refreshChats();
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
                html = str_replace('{{ last_note.' + prop + ' }}', items.contacts[i].last_note[prop], html);
            }

            for(var prop in items.contacts[i].profile)
            {
                html = str_replace('{{ profile.' + prop + ' }}', items.contacts[i].profile[prop], html);
            }

            for(var prop in items.contacts[i])
            {
                html = str_replace('{{ ' + prop + ' }}', items.contacts[i][prop], html);
            }

            $("#list").append(html);
        }
    }
}