$(function(){

    $("#btnSendNote").click(function(){ sendNote(); });

    $("#edtNote").on('keydown', function(e)
    {
        if (e.keyCode == 13)
            sendNote();
    });

    setTimeout("refreshChat(false, false);", 1000);
});

function refreshChat(showLoading, force)
{
    var timeout = 10000;

    if (!isset(showLoading))
        showLoading = true;

    if (!isset(force))
        force = true;

    if ( ! force)
    {
        var items = pizarra.run("NOTA UNREAD", null, null, false);

        if (items.total < 1) {
            setTimeout("refreshChat(false, false);", timeout);
            return;
        }
    }

    var tplLeft = $("#chat-left-template").html();
    var tplRight = $("#chat-right-template").html();
    var notes = pizarra.run('NOTA @' + $("#friend-username").val(), null,null,showLoading);
    var friendProfile =  pizarra.getProfile(pizarra.pages.chat.data.friend);

    if (friendProfile.picture != '1')
        friendProfile.picture_public = "/res/images/user.png";

    var allhtml = '';
    for (var i in notes.chats) {
        var tpl = tplLeft;
        var chat = notes.chats[i];
        if (chat.username == pizarra.currentProfile.username)
            tpl = tplRight;

        var html = tpl;

        html = pizarra.replaceTags(html, friendProfile, 'note.profile.');
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