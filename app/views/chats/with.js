$(function(){

    $("#btnSendNote").click(function(){ sendNote(); });

    $("#edtNote").on('keydown', function(e)
    {
        if (e.keyCode == 13)
            sendNote();
    });

    setTimeout("refreshChat(false, false);", 1000);
    setTimeout('$(".body").slimscroll({scrollTo: "999px"})', 500);
});

function refreshChat(showLoading, force)
{
    var timeout = 1000;

    if (!isset(showLoading))
        showLoading = true;

    if (!isset(force))
        force = true;

    if ( ! force)
    {
        pizarra.action("unread", null, false, true, function(result){
            items = result.payload;
            if (items.total < 1) {
                setTimeout("refreshChat(false, false);", timeout);
            }
        });
        return;
    }

    var tplLeft = $("#chat-left-template").html();
    var tplRight = $("#chat-right-template").html();
    var notes = pizarra.action('chats/' + $("#friend-username").val(), null, showLoading);

    var allhtml = '';
    for (var i in notes.chats) {
        var tpl = tplLeft;
        var chat = notes.chats[i];
        if (chat.username != $("#friend-username").val())
            tpl = tplRight;

        var html = tpl;

        html = pizarra.replaceTags(html, chat.profile, 'note.profile.');
        html = pizarra.replaceTags(html, chat, 'note.');

        allhtml = html + allhtml; // inverse order of notes

    }

    $("#chat-list").html(allhtml);
    //setTimeout('window.scrollTo(0, window.scrollMaxY)', 500);
    setTimeout('$(".body").slimscroll({scrollTo: "999px"})', 500);

    setTimeout("refreshChat(false, false);", timeout);
}

function sendNote(){
    if (pizarra.action('submitChat/' + $("#friend-username").val() + "/" + $("#edtNote").val(), null, false) != false)
    {
        $("#edtNote").val('');
        refreshChat(false, true);
    }
}