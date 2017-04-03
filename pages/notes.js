$(function(){

    $(".show-edit").click(function(){
        pizarra.pages.edit.show(pizarra.getCurrentProfile(false));
    });

    $(".show-chats").click(function(){
        pizarra.pages.chats.show();
    });

    $(".show-search-box").click(function(){
        $("#search-box").fadeIn();
        $(".top-buttons").hide();
    });

    $(".show-search").click(function(){
        var token = pizarra.getToken();
        if(token != null) {
            var notes = pizarra.run('PIZARRA BUSCAR ' + $("#search-query").val(), null,null, false);
            if (strtoupper(notes.code) == 'OK')
                if (!isset(notes.notes)) {
                    $("#search-query").notify(wordwrap(html_entity_decode(notes.text),20,'\n',false));
                } else {
                    pizarra.lastSearchResults = notes;
                    var q = $("#search-query").val();
                    pizarra.pages.search.show({query: q});
                }
        }
    });

    $("#btnSendNote").click(function(){

        var token = pizarra.getToken();

        if(token !== null)
        {
            if (pizarra.run('PIZARRA ' + $("#edtNote").val()) != false)
                refreshNotes();
        }
    });

    $('body').keypress(function(a){
        if (a.keyCode == 27)
        {
            $("#search-box").hide();
            $(".top-buttons").show();
        }
    });

    $("#btnCloseSearchBox").click(function(){
        $("#search-box").hide();
        $(".top-buttons").show();
    });

    $.notify.addStyle('happyblue', {
        html: "<div><span data-notify-text/></div>",
        classes: {
            base: {
                "white-space": "nowrap",
                "background-color": "lightblue",
                "padding": "5px"
            },
            superblue: {
                "color": "white",
                "background-color": "blue"
            }
        }
    });

    refreshNotes();
});

function refreshNotes()
{
    $("#list-news").html("");
    var token = pizarra.getToken();
    if(token != null)
    {
        var notes = pizarra.run('PIZARRA');
        var tpl = $("#news-template").html();

        for(var item in notes.notes)
        {
            var html = tpl;

            for(var prop in notes.notes[item].profile)
            {
                html = str_replace('{{ note.profile.' + prop + ' }}', notes.notes[item].profile[prop], html);
            }

            for(var prop in notes.notes[item])
            {
                html = str_replace('{{ ' + prop + ' }}', notes.notes[item][prop], html);
            }

            $("#list-news").append(html);
        }
    }
}