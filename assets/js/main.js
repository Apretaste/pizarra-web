new Vue({
  components: {
    alert: VueStrap.alert,
    'email-view': emailView,
    'pass-view': passView
  },

  el: '#app',

  data: {
    showRight: false,
    showTop: false,
    logged: true,
    currentView: 'email-view' 
  },

  methods: {
  },

  computed: {
  },

})
