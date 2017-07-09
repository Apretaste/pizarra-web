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

function refreshComments(){
	pizarra.redirect("note/"+$("#edtNoteId").val() );
}

function sendNote(){
	var result = pizarra.action('submitComment/' + $("#edtNoteId").val() + "/" + urlencode($("#edtNote").val()));
	refreshComments();
	$("#edtNote").val('');
}
