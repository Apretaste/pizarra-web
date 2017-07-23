$(function(){
	$("#edtNote").on('keydown', function(e)
	{
		if (e.keyCode == 13) sendNote();
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

	// open the popup to subscribe, in case you are not subscribed
	// @NOTE added by Salvi
	$(document).ready(function(){
		window._pcq.push(['triggerOptIn']);
	});

	// registers callback function to be called when user gets successfully subscribed
	// @NOTE added by Salvi
	window._pcq = window._pcq || [];
	_pcq.push(['subscriptionSuccessCallback', function (subscriberId, values) {
		pizarra.action('updateAppId/', {appid:subscriberId});
		console.log('Successfully subscribed');
	}]);
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
	var tpl = base64_decode(trim($("#news-template").html()));

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
	//refreshNotes();
	$("#edtNote").val('');

	var currentProfile = pizarra.currentProfile;
	var note = {
		id: 0,
		country: currentProfile.country,
		username: currentProfile.username,
		gender: currentProfile.gender,
		text: $("#edtNote").val(),
		likes: 0,
		unlikes: 0,
		isliked: false,
		comments: [],
		source: "",
		email: pizarra.currentProfile.email,
		friend: false
	};
    var tpl = base64_decode(trim($("#news-template").html()));
    tpl = pizarra.replaceTags(tpl, pizarra.currentProfile, 'note.profile.');
    tpl = pizarra.replaceTags(tpl, note, '');
    $("#list-news").html(tpl + $("#list-news").html());
}
