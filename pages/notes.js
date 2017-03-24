$(function(){
    var token = $.cookie('apretaste-pizarra');
    if(token !== null)
    {
        var notes = sdk.run('PIZARRA','',token);
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
});