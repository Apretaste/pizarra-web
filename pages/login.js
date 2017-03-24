$("#pass-button").click(function(e) {
    $("#login-div").hide();
    e.preventDefault();
    $("#password-div").fadeIn(500);
});

$('#email-field').keypress(function(e) {
    if(e.which == 13) {
        $('#login-div').hide();
        $('#password-div').fadeIn(500).focus().click();
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
});

$("#submit-form").submit(function(event) {

    event.preventDefault();

    var email = $("#email-field").val();
    var pin = "";

    $(".password-block").each(function(index, input){
       pin = pin + $(input).val();
    });

    var result = sdk.login(email, pin);

    if (result.code == "error")
    {
        alert('Access denied');
        $("#password-div").hide();
        $("#login-div").fadeIn(500);
    } else {
        $.cookie('apretaste-pizarra', result.token);
        client.pages.notes.show();
    }

    return false;
});