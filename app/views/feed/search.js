$(function() {

	$(".show-search-box").click(function () {
		$("#search-box").dialog({
			title: null,
			modal: true,
			buttons: [
				{
					text: "Buscar",
					click: function () {
						searchFeed();
					}
				},
				{
					text: "Cerrar",
					class: "btn-close-dialog",
					click: function () {
						$(this).dialog('close');
					}
				}
			]
		});

		$("#search-query").on('keypress', function (e) {
			if (e.which == 13) {
				searchFeed();
			}
		});
	});

	highlight();
	pizarra.reEvents();
});


function searchFeed()
{
	var query = $("#search-query").val();
	query = trim(query);
	if (query != '')
	{
		$("#search-box").dialog( "close" );
		pizarra.redirect("feed/search/" + query);
	}
}


function highlight()
{
	$("p.note").each(function(e){
		$(this).html($(this).html().linkify());
	});

	$("a").each(function(){
		var href = $(this).attr('href');

		if (strpos(href, 'mailto:') !== false)
		{
			var username = substr($(this).html(),1);
			$(this).attr('href',"/profile/of/" + username);
		}
	});
}
