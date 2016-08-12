/* 
 * components.js: home of the concat'd JS strings that build components.E
 * @TODO: needs fixing
 */

var emailView = Vue.extend({
  template: '<div>' +
            '<div class="input-group">' +
            '<span class="input-group-addon"><i class="fa fa-envelope fa-fw" aria-hidden="true"></i></span>' +
            '<input class="input-form form-control" id="email-field" type="email" name="email" data-name="email" required="required" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" placeholder="Ingresa tu email">' +
            '</div>' +
            '<button type="button" class="btn btn-default w100" id="login-button" @click.prevent="this.\$root.currentView=\'pass-view\'"><i class="fa fa-arrow-circle-right"></i> Siguiente</button>' +
            '</div>'
}) 

// register email-view as a global component
Vue.component('email-view', { template: emailView, props: ['currentView']})

var passView= Vue.extend({
  template: '<div>' +
            '<div class="input-group">' +
            '<span class="input-group-addon"><i class="fa fa-lock fa-fw" aria-hidden="true"></i></span>' +
            '<input class="input-form form-control" id="password-field" type="password" name="password" data-name="pass" required="required" placeholder="Ingresa tu contraseña">' +
            '</div>' +
            '<button type="submit" class="btn btn-default w100" id="login-button"><i class="fa fa-check-circle"></i> Ingresar</button>' +
            '</div>'
})

// register pass-view as a global component
Vue.component('pass-view', { template: passView })
