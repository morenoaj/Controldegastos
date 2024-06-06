document.addEventListener('DOMContentLoaded', () => {
  ((Session) => {
    const App = {
      // Referencias a los elementos HTML
      htmlElements: {
        username: document.getElementById("username"),
        form: document.getElementById("form"),
        dataTable: document.getElementById("data-table").getElementsByTagName('tbody')[0],
        logoutButton: document.getElementById("logout"),
        chartContainer: document.getElementById("chart-container"),
        totalContainer: document.getElementById("total-container"),
        message: document.getElementById("message"),
      },
      // Inicialización de la aplicación
      init() {
        App.bindEvents();
        App.initialValidations();
        App.populateUsername();
        App.loadData();
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
      // Mostrar nombre de usuario en la interfaz
      populateUsername() {
        const username = localStorage.getItem("username");
        App.htmlElements.username.textContent = `Holaa! ${username} registra tus ingresos y gastos para que mantengas el control de tu dinero`;
      },
      // Cargar datos desde localStorage y renderizarlos
      loadData() {
        const data = App.methods.getData();
        data.forEach(App.renderRow);
        App.renderTotals(data);
        App.renderChart(data);
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
          const { description, amount, type } = event.target.elements;
          const row = {
            description: description.value,
            amount: parseFloat(amount.value),
            type: type.value,
          };
          App.methods.saveData(row);
          App.renderRow(row);
          App.renderTotals(App.methods.getData());
          App.renderChart(App.methods.getData());
          App.showMessage('Registro agregado exitosamente', 'success');

          // Resetea el formulario después de enviar los datos
          event.target.reset();
        },
        handleLogout() {
          Session.logout();
        },
      },
      // Métodos de la aplicación
      methods: {
        // Guardar datos en localStorage
        saveData(row) {
          const username = localStorage.getItem("username");
          const data = App.methods.getData();
          data.push(row);
          localStorage.setItem(`data_${username}`, JSON.stringify(data));
        },
        // Obtener datos de localStorage
        getData() {
          const username = localStorage.getItem("username");
          return JSON.parse(localStorage.getItem(`data_${username}`)) || [];
        },
      },
      // Renderizar una fila en la tabla
      renderRow(row) {
        const tr = document.createElement("tr");
        const typeDisplay = row.type === "income" ? "Ingreso" : "Gasto";
        tr.innerHTML = `
          <td>${row.description}</td>
          <td>${row.amount.toLocaleString('es-ES', { style: 'currency', currency: 'USD' })}</td>
          <td>${typeDisplay}</td>
        `;
        App.htmlElements.dataTable.appendChild(tr);
      },
      // Renderizar totales de ingresos y gastos
      renderTotals(data) {
        const income = data.filter(item => item.type === "income").reduce((sum, item) => sum + item.amount, 0);
        const expense = data.filter(item => item.type === "expense").reduce((sum, item) => sum + item.amount, 0);

        const totalsRow = document.createElement("tr");
        totalsRow.innerHTML = `
          <td colspan="3" class="totals">
            <p>Total Ingresos: ${income.toLocaleString('es-ES', { style: 'currency', currency: 'USD' })}</p>
            <p>Total Gastos: ${expense.toLocaleString('es-ES', { style: 'currency', currency: 'USD' })}</p>
          </td>
        `;

        // Eliminar cualquier fila de totales anterior
        const oldTotals = App.htmlElements.dataTable.querySelectorAll(".totals");
        oldTotals.forEach(totalRow => totalRow.remove());

        // Añadir la nueva fila de totales
        App.htmlElements.dataTable.appendChild(totalsRow);
      },
      // Renderizar gráfica de ingresos y gastos
      renderChart(data) {
        if (!App.htmlElements.chartContainer) {
          console.error('chartContainer es null');
          return;
        }
        const income = data.filter(item => item.type === "income").reduce((sum, item) => sum + item.amount, 0);
        const expense = data.filter(item => item.type === "expense").reduce((sum, item) => sum + item.amount, 0);
        const maxAmount = Math.max(income, expense);
        const chartHeight = 200; // Altura fija del contenedor de la gráfica

        const incomeHeight = (income / maxAmount) * chartHeight;
        const expenseHeight = (expense / maxAmount) * chartHeight;

        App.htmlElements.chartContainer.innerHTML = `
          <div class="bar-chart-container">
            <div class="bar-chart">
              <div class="bar income" style="height: ${incomeHeight}px;">
                <span class="bar-label">${income.toLocaleString('es-ES', { style: 'currency', currency: 'USD' })}</span>
              </div>
              <div class="bar expense" style="height: ${expenseHeight}px;">
                <span class="bar-label">${expense.toLocaleString('es-ES', { style: 'currency', currency: 'USD' })}</span>
              </div>
            </div>
            <div class="chart-legend">
              <span class="legend-item"><span class="legend-color income"></span> Ingresos</span>
              <span class="legend-item"><span class="legend-color expense"></span> Gastos</span>
            </div>
          </div>
        `;

        if (App.htmlElements.totalContainer) {
          App.htmlElements.totalContainer.innerHTML = `
            <div class="total">
              <p>Total Ingresos: ${income.toLocaleString('es-ES', { style: 'currency', currency: 'USD' })}</p>
              <p>Total Gastos: ${expense.toLocaleString('es-ES', { style: 'currency', currency: 'USD' })}</p>
            </div>
          `;
        }
      },
    };
    App.init();
  })(window.Session);
});
