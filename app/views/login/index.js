$(function(){
    $("#navbar").hide();
    $("#email-field").focus();

    $("#password").on('keydown', function(e)
    {
        if ((e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105) && e.keyCode != 8 && e.keyCode !== 13 && e.keyCode != 9) {
            e.keyCode = 0;
            return false;
        }

        if (e.keyCode == 13){
            login();
        }
    });
})

$("#pass-button").click(function(e) {
    pass();
});

$('#email-field').keypress(function(e) {
    if(e.which == 13)
    {
        var r = pass();
        if (r == true)
        {
            $("#password-div").show();
            $("#login-div").hide();
            $("#password").focus();
        }
    }
});

$('#login-submit').click(function() {
    login();
});

$('#login-back').click(function() {
    $("#password-div").hide();
    $("#login-div").show();
    $("#email-field").focus();
    $("#password").val('');
});

function pass(){
    var email = $("#email-field").val();
    if (is_email(email))
    {
		$("#shadow-layer").show();
        var r = pizarra.action("email/" + email, false, false, true, function(r){
			if (r.code == 'ok' || r.code == 200)
			{
				$("#login-div").hide();
				$("#password-div").fadeIn(500);
				$(".password-block-first").focus();
			}	
			$("#shadow-layer").hide();
		});
        
    } else {
        $("#email-field").notify(wordwrap(html_entity_decode('Direcci&oacute;n email incorrecta'),20,'\n',false));
    }
    return false;
}

function login() {
    var email = $("#email-field").val();
    var pin = $("#password").val();
    
	$("#shadow-layer").show();
	
    var result = pizarra.action("login/" + email + "/" + pin, false, false, true, function(result){
		if (result.code == "error" || result.code == 215)
		{
			pizarra.messageBox('Acceso denegado');
			$("#password").val('');
			$("#password-div").hide();
			$("#login-div").fadeIn(500);
			$("#shadow-layer").hide();
		} else {
			pizarra.setToken(result.message);
			pizarra.redirect("feed");
		}
	});

}
