$(function(){
    $(".show-edit").click(function(){
        pizarra.pages.edit.show(pizarra.getCurrentProfile(false));
    });

    $(".show-chats").click(function(){
        pizarra.pages.chats.show();
    });

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
        //$("#search-box").fadeIn();
        //$(".top-buttons").hide();
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

    refreshNotes();
});

function refreshNotes(showLoading)
{
    if (!isset(showLoading))
        showLoading = true;

    var timeout = 120000;

    if (pizarra.pages.current.name != 'notes')
        return;

    var token = pizarra.getToken();
    var htmlNotes = '';
    if(token != null)
    {
        var notes = pizarra.run('PIZARRA',null,null,showLoading);
        notes = notes.notes;
        var tpl = $("#news-template").html();

        for(var item in notes)
        {
            var html = tpl;
            var profile = notes[item].profile;

            if (profile.picture != '1')
                profile.picture_public = "images/user.png";

            //profile.picture_public = pizarra.checkImage(profile.picture_public);

            notes[item].followcolor = 'black';
            if (notes[item].friend == true)
                notes[item].followcolor = 'red';

            html = pizarra.replaceTags(html, profile, 'note.profile.');
            html = pizarra.replaceTags(html, notes[item], '');
            notes[item].text = notes[item].text.linkify();
            htmlNotes += html;
        }

        $("#list-news").html(htmlNotes);

        $("a").each(function(){
            var href = $(this).attr('href');

            if (strpos(href,'mailto:') !== false)
            {
                $(this).attr('href',"#");
                var username = substr($(this).html(),1);
                $(this).attr('onclick',"pizarra.pages.profile.show(pizarra.getProfile('" + username + "'));");
            }

        });
    }

    //setTimeout('$(".body").slimscroll({scrollTo: "999px"})', 500);

    setTimeout("refreshNotes(false);", timeout);
}

function sendNote(){
    var token = pizarra.getToken();

    if(token !== null)
    {
        if (pizarra.run('PIZARRA ' + $("#edtNote").val()) != false)
            refreshNotes();

        $("#edtNote").val('');
    }
}