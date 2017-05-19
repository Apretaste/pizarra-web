$(function(){

    $(".show-search-box").click(function(){
        $("#search-box").dialog({
            title: "Buscar en Pizarra",
            modal: true,
            buttons: [
                {
                    text: "Buscar",
                    click: function() {
                        var query = $("#search-query").val();
                        query = trim(query);
                        if (query != '')
                        {
                            var token = pizarra.getToken();
                            if(token != null) {
                                var notes = pizarra.run('PIZARRA BUSCAR ' + query, null,null, false);
                                if (strtoupper(notes.code) == 'OK')
                                    if (!isset(notes.notes)) {
                                        $("#search-box").notify(wordwrap(html_entity_decode(notes.text),20,'\n',false));
                                    } else {
                                        pizarra.lastSearchResults = notes;
                                        var q = $("#search-query").val();
                                        $( this ).dialog( "close" );
                                        pizarra.pages.search.show({query: q});
                                    }
                            }
                        }
                    }
                },
                {
                    text: "Cerrar",
                    click: function(){
                        $(this).dialog('close');
                    }
                }

            ]
        });
    });

    $(".show-search").click(function(){
        var token = pizarra.getToken();
        if(token != null) {
            var notes = pizarra.action('search/' + $("#search-query").val(), null, true);
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

    $("#edtNote").on('keydown', function(e)
    {
        if (e.keyCode == 13)
            sendNote();
    });

    $("#btnSendNote").click(function(){
        sendNote();
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
        position: "top",
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

    setTimeout("refreshNotes(false);", 20000);

    pizarra.reEvents();
});

function refreshNotes(showLoading, autoRefresh)
{
    if (!isset(showLoading))
        showLoading = true;

    if (!isset(autoRefresh))
        autoRefresh = true;

    var timeout = 20000;
    var htmlNotes = '';
    var notes = pizarra.action("/feed", null, showLoading).notes;
    var tpl = $("#news-template").html();

    for(var item in notes)
    {
        var html = tpl;
        var profile = notes[item].profile;

        if (profile.picture != '1')
            profile.picture_public = "/res/images/user.png";

        notes[item].followcolor = 'black';
        if (notes[item].friend == true)
            notes[item].followcolor = 'red';

        notes[item].text = notes[item].text.linkify();

        html = pizarra.replaceTags(html, profile, 'note.profile.');
        html = pizarra.replaceTags(html, notes[item], '');

        htmlNotes += html;
    }

    $("#list-news").html(htmlNotes);

    $("a").each(function(){
        var href = $(this).attr('href');

        if (strpos(href, 'mailto:') !== false)
        {
            var username = substr($(this).html(),1);
            $(this).attr('href',"/profile/of/" + username);
        }

    });

    pizarra.reEvents();

    if (autoRefresh == true)
        setTimeout("refreshNotes(false);", timeout);
}

function sendNote(){
    var result = pizarra.submit('publish/' + urlencode($("#edtNote").val()));
    refreshNotes();
    $("#edtNote").val('');
}
