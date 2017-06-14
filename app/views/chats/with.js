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
    var timeout = 2000;

    if (!isset(showLoading))
        showLoading = true;

    if (!isset(force))
        force = true;

    if ( ! force)
    {
        pizarra.action("unread", null, false, true, function(result){
            items = result.payload;
            if (items.total > 0) {
                setTimeout("refreshChat(false, true);", timeout);
            }
        });
        setTimeout("refreshChat(false, false);", timeout);
        return;
    }

    pizarra.currentChat = pizarra.action('chats/' + $("#friend-username").val(), null, showLoading);

    paintNotes(pizarra.currentChat);

    setTimeout("refreshChat(false, false);", timeout);
}

function paintNotes(notes)
{
    var allhtml = '';
    var tplLeft = base64_decode(trim($("#chat-left-template").html()));
    var tplRight = base64_decode(trim($("#chat-right-template").html()));

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
    setTimeout('$(".body").slimscroll({scrollTo: "9999px"})', 500);
}

function sendNote(){
    var note = $("#edtNote").val();

    array_unshift(pizarra.currentChat.chats, {
        profile: pizarra.currentProfile,
        id: -1,
        username: pizarra.currentProfile.username,
        text: strip_tags(note),
        sent: date("d/m/Y h:i:s a")
    });

    paintNotes(pizarra.currentChat);

    $("#edtNote").val('');

    pizarra.action('submitChat/' + $("#friend-username").val() + "/" + note, null, false, true, function(){
        //refreshChat(false, true);
    });
}