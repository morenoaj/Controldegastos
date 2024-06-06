((Session) => {
  const App = {
    // Referencias a los elementos HTML
    htmlElements: {
      form: document.getElementById("form"),
      logoutButton: document.getElementById("logout"),
      message: document.getElementById("message"),
    },
    // Inicialización de la aplicación
    init() {
      App.bindEvents();
      App.initialValidations();
      App.populateForm();
    },
    // Validaciones iniciales
    initialValidations() {
      Session.shouldBeLoggedIn();
    },
    // Enlazar eventos a elementos HTML
    bindEvents() {
      App.htmlElements.form.addEventListener("submit", App.handlers.onSubmit);
      App.htmlElements.logoutButton.addEventListener("click", App.handlers.handleLogout);
    },
    // Llenar el formulario con los datos del usuario
    populateForm() {
      const username = localStorage.getItem("username");
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find(user => user.username === username);
      if (user) {
        App.htmlElements.form.username.value = user.username;
        App.htmlElements.form.name.value = user.name;
        App.htmlElements.form.lastName.value = user.lastName;
      }
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
        const { username, name, lastName, newPassword, confirmPassword } = event.target.elements;
        if (newPassword.value !== confirmPassword.value) {
          App.showMessage("Las contraseñas no coinciden.", 'error');
          return;
        }
        const hashedPassword = newPassword.value ? App.methods.hashCode(newPassword.value) : null;
        Session.updateProfile(username.value, name.value, lastName.value, hashedPassword);
        App.showMessage("Perfil actualizado exitosamente", 'success');
      },
      handleLogout() {
        Session.logout();
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
