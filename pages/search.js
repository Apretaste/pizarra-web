$(function(){
    refreshNotes();
});
function refreshNotes()
{
    $("#list-news").html("");
    var token = client.getToken();
    if(token != null)
    {
        var notes = client.run('PIZARRA BUSCAR '+$("#query").val(),'',token);
        var tpl = $("#news-template").html();

        for(var item in notes.notes)
        {
            var html = tpl;
            for(var prop in notes.notes[item])
            {
                html = html.replace('{{ ' + prop + ' }}', notes.notes[item][prop]);
            }

            $("#list-news").append(html);
        }
    }
}