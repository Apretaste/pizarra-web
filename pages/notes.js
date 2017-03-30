$(function(){

    $(".show-edit").click(function(){
        client.pages.edit.show(client.getCurrentProfile());
    });

    $(".show-chats").click(function(){
        client.pages.chats.show();
    });

    $(".show-search-box").click(function(){
        $("#search-box").show();
    });

    $(".show-search").click(function(){
        var q = $("#search-query").val();
        client.pages.search.show({query: q});
    });

    $("#btnSendNote").click(function(){

        var token = client.getToken();

        if(token !== null)
        {
            if (client.run('PIZARRA ' + $("#edtNote").val(), '', token) != false)
                refreshNotes();
        }
    });

    refreshNotes();
});


function refreshNotes()
{
    $("#list-news").html("");
    var token = client.getToken();
    if(token != null)
    {
        var notes = client.run('PIZARRA','',token);
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