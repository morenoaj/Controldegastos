((Session) => {
  const App = {
    // Referencias a los elementos HTML
    htmlElements: {
      form: document.getElementById("form"),
      message: document.getElementById("message"),
    },
    // Inicialización de la aplicación
    init() {
      App.bindEvents();
      App.initialValidations();
    },
    // Validaciones iniciales
    initialValidations() {
      Session.shouldNotBeLoggedIn();
    },
    // Enlazar eventos a elementos HTML
    bindEvents() {
      App.htmlElements.form.addEventListener("submit", App.handlers.onSubmit);
    },
    // Mostrar mensajes de información
    showMessage(message, type = 'info') {
      App.htmlElements.message.textContent = message;
      App.htmlElements.message.className = `message ${type}`;
      setTimeout(() => {
        App.htmlElements.message.textContent = '';
        App.htmlElements.message.className = 'message';
      }, 3000);
    },
    // Manejadores de eventos
    handlers: {
      onSubmit(event) {
        event.preventDefault();
        const { username, password } = event.target.elements;
        const hashedPassword = App.methods.hashCode(password.value);
        const result = Session.login(username.value, password.value);
        if (!result.success) {
          App.showMessage(result.message, 'error');
        } else {
          window.location.href = "index.html";
        }
      },
    },
    // Métodos de la aplicación
    methods: {
      // Generar un hash para la contraseña
      hashCode(str) {
        let hash = 0;
        for (let i = 0, len = str.length; i < len; i++) {
          let chr = str.charCodeAt(i);
          hash = (hash << 5) - hash + chr;
          hash |= 0;
        }
        return hash;
      },
    },
  };
  App.init();
})(window.Session);
