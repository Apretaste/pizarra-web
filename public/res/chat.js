$(function(){

    refreshChat(false, true);

    $("#btnSendNote").click(function(){ sendNote(); });

    $("#edtNote").on('keydown', function(e)
    {
        if (e.keyCode == 13)
        sendNote();
    });
});

function refreshChat(showLoading, force)
{
    var timeout = 10000;

    if (pizarra.pages.current.name != 'chat')
        return;

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
    var notes = pizarra.run('NOTA @' + pizarra.pages.chat.data.friend, null,null,showLoading);
    var friendProfile =  pizarra.getProfile(pizarra.pages.chat.data.friend);

    if (friendProfile.picture != '1')
        friendProfile.picture_public = "images/user.png";

    //friendProfile.picture_public = pizarra.checkImage(friendProfile.picture_public);

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
    if (pizarra.run('NOTA @' + pizarra.pages.chat.data.friend + " " + $("#edtNote").val(), null, null, false) != false)
    {
        $("#edtNote").val('');
        refreshChat(false, true);
    }
}