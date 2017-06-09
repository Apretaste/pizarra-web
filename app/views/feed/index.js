$(function(){

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

    highlight();

    //setTimeout("refreshNotes(false);", 20000);

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

    highlight();
    pizarra.reEvents();

   /* if (autoRefresh == true)
        setTimeout("refreshNotes(false);", timeout);*/
}

function sendNote(){
    var result = pizarra.action('submitPublish/' + urlencode($("#edtNote").val()));
    refreshNotes();
    $("#edtNote").val('');
}
