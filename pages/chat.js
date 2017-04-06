$(function(){

    refreshChat();

    $("#btnSendNote").click(function(){

        var token = pizarra.getToken();

        if(token !== null)
        {
            if (pizarra.run('NOTA @' + pizarra.pages.chat.data.friend + " " + $("#edtNote").val()) != false)

                refreshChat(false);
        }
    });

});

function refreshChat(showLoading)
{
	$("#chat-list").html('');
	
    if (!isset(showLoading))
        showLoading = true;

    var tplLeft = $("#chat-left-template").html();
    var tplRight = $("#chat-right-template").html();
    var notes = pizarra.run('NOTA @' + pizarra.pages.chat.data.friend, null,null,showLoading);
    var friendProfile =  pizarra.getProfile(pizarra.pages.chat.data.friend);

    friendProfile.picture_public = pizarra.checkImage(friendProfile.picture_public);

    for (var i in notes.chats) {
        var tpl = tplLeft;
        var chat = notes.chats[i];
        if (chat.username == pizarra.currentProfile.username)
            tpl = tplRight;

        var html = tpl;

        html = pizarra.replaceTags(html, friendProfile, 'note.profile.');
        html = pizarra.replaceTags(html, chat, 'note.');

        $("#chat-list").append(html);
    }
	
	setTimeout("refreshChat();", 10000);
}