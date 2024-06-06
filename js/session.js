(() => {
  const DATA = JSON.parse(localStorage.getItem("users")) || [];
  const Session = {
    // Registrar un nuevo usuario
    register(username, name, lastName, password) {
      const hashedPassword = Session.hashCode(password);
      DATA.push({ username, name, lastName, password: hashedPassword });
      localStorage.setItem("users", JSON.stringify(DATA));
    },
    // Iniciar sesión
    login(username, password) {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const hashedPassword = Session.hashCode(password);
      const user = users.find(item => item.username === username);
      if (!user) {
        return { success: false, message: "El usuario no existe." };
      }
      if (user.password !== hashedPassword) {
        return { success: false, message: "Contraseña incorrecta." };
      }
      localStorage.setItem("username", username);
      return { success: true };
    },
    // Cerrar sesión
    logout() {
      localStorage.removeItem("username");
      window.location.href = "login.html";
    },
    // Redirigir si el usuario no debe estar logueado
    shouldNotBeLoggedIn() {
      if (localStorage.getItem("username")) window.location.href = "dashboard.html";
    },
    // Redirigir si el usuario debe estar logueado
    shouldBeLoggedIn() {
      if (!localStorage.getItem("username")) window.location.href = "login.html";
    },
    // Actualizar perfil de usuario
    updateProfile(username, name, lastName, newPassword) {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const userIndex = users.findIndex(user => user.username === username);
      if (userIndex !== -1) {
        users[userIndex].name = name;
        users[userIndex].lastName = lastName;
        if (newPassword) {
          const hashedPassword = Session.hashCode(newPassword);
          users[userIndex].password = hashedPassword;
        }
        localStorage.setItem("users", JSON.stringify(users));
      }
    },
    // Verificar si un usuario existe
    userExists(username) {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      return users.some(user => user.username === username);
    },
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
  };
  window.Session = Session;
})();
