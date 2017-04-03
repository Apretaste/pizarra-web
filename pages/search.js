$(function(){
    refreshNotes();
});
function refreshNotes()
{
    $("#list-news").html("");

    var notes = pizarra.lastSearchResults;
    var tpl = $("#news-template").html();

    if (isset(notes.notes))
        for(var item in notes.notes)
        {
            var html = tpl;

            for(var prop in notes.notes[item].profile)
            {
                html = str_replace('{{ note.profile.' + prop + ' }}', notes.notes[item].profile[prop], html);
            }

            for(var prop in notes.notes[item])
            {
                html = html.replace('{{ ' + prop + ' }}', notes.notes[item][prop]);
            }

            $("#list-news").append(html);
        }

}