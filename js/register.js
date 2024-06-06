((Session) => {
  const App = {
    // Referencias a los elementos HTML
    htmlElements: {
      form: document.getElementById("form-register"),
      message: document.getElementById("message-register"),
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
      }, 2000);
    },
    // Manejadores de eventos
    handlers: {
      onSubmit(event) {
        event.preventDefault();
        const formElements = event.target.elements;
        const username = formElements.username ? formElements.username.value : '';
        const name = formElements.name ? formElements.name.value : '';
        const lastName = formElements.lastname ? formElements.lastname.value : '';
        const password = formElements.password ? formElements.password.value : '';

        if (!username || !name || !lastName || !password) {
          App.showMessage('Todos los campos son obligatorios.', 'error');
          return;
        }

        if (Session.userExists(username)) {
          App.showMessage('El nombre de usuario ya está en uso.', 'error');
          return;
        }
        
        Session.register(username, name, lastName, password);
        App.showMessage('Usuario registrado exitosamente', 'success');
        setTimeout(() => {
          window.location.href = "login.html";
        }, 2000); // Redirige después de 2 segundos
      },
    },
  };
  App.init();
})(window.Session);
