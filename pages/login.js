$(function(){
    $("#navbar").hide();
    $("#email-field").focus();
    $.notify.addStyle('happyblue', {
        html: "<div><span data-notify-text/></div>",
        classes: {
            base: {
                "white-space": "nowrap",
                "background-color": "lightblue",
                "padding": "5px"
            },
            superblue: {
                "color": "white",
                "background-color": "blue"
            }
        }
    });

    $("#password").on('keydown', function(e)
    {
        if ((e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105) && e.keyCode != 8 && e.keyCode !== 13 && e.keyCode != 9) {
            e.keyCode = 0;
            return false;
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

$(".password-block").keyup(function() {
    if($(this).val().length >= 1) {
        var input_flds = $(this).closest('form').find(':input');
        input_flds.eq(input_flds.index(this) + 1).focus();
    }
});

$('[type="submit"]').on('click', function () {
    $(this)
        .closest('form')
        .find('[required]')
        .addClass('required');

    login();
});

function pass(){
    var email = $("#email-field").val();
    if (is_email(email))
    {
        var r = sdk.start(email);

        if (r.code == 'ok')
        {
            $("#login-div").hide();
            $("#password-div").fadeIn(500);
            $(".password-block-first").focus();
            return true;
        }
    } else {
        $("#email-field").notify(wordwrap(html_entity_decode('Direcci&oacute;n email incorrecta'),20,'\n',false));
    }
    return false;
}

function login() {
    var email = $("#email-field").val();
    var pin = $("#password").val();

    var result = sdk.login(email, pin);

    if (result.code == "error")
    {
        alert('Access denied');
        $("#password-div").hide();
        $("#login-div").fadeIn(500);
    } else {
        pizarra.setToken(result.token);
        pizarra.pages.notes.show();
    }
}
