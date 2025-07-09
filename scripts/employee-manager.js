// Gerenciador de funcionários
class EmployeeManager {
  constructor(dataManager, uiManager) {
    this.dataManager = dataManager
    this.uiManager = uiManager
  }

  addEmployee() {
    const code = document.getElementById("new-employee-code").value.trim().toUpperCase()
    const name = document.getElementById("new-employee-name").value.trim()
    const shift = document.getElementById("new-employee-shift").value

    if (!code || !name) {
      this.uiManager.showNotification("Preencha todos os campos", "error")
      return
    }

    if (code.length < 3 || code.length > 10) {
      this.uiManager.showNotification("Código deve ter entre 3 e 10 caracteres", "error")
      return
    }

    const result = this.dataManager.addEmployee(code, name, shift)

    if (result.success) {
      this.uiManager.showNotification(result.message, "success")
      this.clearForm()
      this.renderEmployeesTable()
    } else {
      this.uiManager.showNotification(result.message, "error")
    }
  }

  toggleEmployeeStatus(code) {
    if (this.dataManager.toggleEmployeeStatus(code)) {
      this.renderEmployeesTable()
      this.uiManager.showNotification("Status do funcionário alterado", "success")
    } else {
      this.uiManager.showNotification("Erro ao alterar status", "error")
    }
  }

  clearForm() {
    document.getElementById("new-employee-code").value = ""
    document.getElementById("new-employee-name").value = ""
    document.getElementById("new-employee-shift").value = "Manhã"
  }

  renderEmployeesTable() {
    const container = document.getElementById("employees-table")
    const employees = this.dataManager.getAllEmployees()

    if (employees.length === 0) {
      container.innerHTML = '<div class="text-center">Nenhum funcionário cadastrado</div>'
      return
    }

    let html = '<div class="employees-table">'

    employees.forEach((employee) => {
      html += `
        <div class="employee-row">
          <div class="employee-code">${employee.code}</div>
          <div>${employee.name}</div>
          <div>${employee.shift}</div>
          <div>
            <span class="employee-status ${employee.status}">${employee.status === "active" ? "Ativo" : "Inativo"}</span>
            <button class="btn btn-secondary" onclick="if(window.employeeManager) window.employeeManager.toggleEmployeeStatus('${employee.code}')" style="margin-left: 8px; padding: 4px 8px; font-size: 10px;">
              ${employee.status === "active" ? "Desativar" : "Ativar"}
            </button>
          </div>
        </div>
      `
    })

    html += "</div>"
    container.innerHTML = html
  }
}

// Disponibilizar globalmente
window.EmployeeManager = EmployeeManager
