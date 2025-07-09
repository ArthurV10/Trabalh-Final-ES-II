// Gerenciador de modais
class ModalManager {
  constructor(employeeManager, reportManager, dataManager, uiManager, pumpController) {
    this.employeeManager = employeeManager
    this.reportManager = reportManager
    this.dataManager = dataManager
    this.uiManager = uiManager
    this.pumpController = pumpController
  }

  showEmployees() {
    this.employeeManager.renderEmployeesTable()
    this.showModal("employees-modal")
  }

  showStock() {
    this.renderStockManagement()
    this.showModal("stock-modal")
  }

  showDailyReport() {
    const today = new Date()
    document.getElementById("report-date").value = today.toISOString().split("T")[0]
    this.reportManager.generateReport()
    this.showModal("daily-report-modal")
  }

  showTransactionHistory() {
    this.renderTransactionHistory()
    this.showModal("history-modal")
  }

  showModal(modalId) {
    const modal = document.getElementById(modalId)
    if (modal) {
      modal.style.display = "flex"
      document.body.style.overflow = "hidden"
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId)
    if (modal) {
      modal.style.display = "none"
      document.body.style.overflow = "auto"
    }
  }

  renderStockManagement() {
    const container = document.getElementById("stock-management")
    const fuelStock = this.dataManager.getAllFuelStock()

    let html = ""

    fuelStock.forEach((stock) => {
      const percentage = (stock.currentLevel / stock.maxCapacity) * 100
      const isLowStock = stock.currentLevel <= stock.lowStockAlert

      html += `
        <div class="stock-item-management">
          <div class="stock-item-header">
            <div class="stock-item-title">
              ${stock.type}
              ${isLowStock ? '<span style="color: #f56565; font-size: 12px; margin-left: 8px;">ESTOQUE BAIXO</span>' : ""}
            </div>
            <div style="font-size: 14px; color: #718096;">
              ${stock.currentLevel.toFixed(0)}L / ${stock.maxCapacity}L (${percentage.toFixed(1)}%)
            </div>
          </div>
          <div class="stock-controls">
            <input type="number" id="add-${stock.type.replace(/\s+/g, "-")}" placeholder="Adicionar (L)" min="0" step="100">
            <input type="number" id="price-${stock.type.replace(/\s+/g, "-")}" value="${stock.price.toFixed(2)}" min="0" step="0.01">
            <button class="btn btn-success" onclick="if(window.modalManager) window.modalManager.addStock('${stock.type}')">
              <i class="fas fa-plus"></i> Adicionar
            </button>
            <button class="btn btn-primary" onclick="if(window.modalManager) window.modalManager.updatePrice('${stock.type}')">
              <i class="fas fa-edit"></i> Preço
            </button>
          </div>
        </div>
      `
    })

    container.innerHTML = html
  }

  addStock(fuelType) {
    const inputId = `add-${fuelType.replace(/\s+/g, "-")}`
    const amount = Number.parseFloat(document.getElementById(inputId).value)

    if (!amount || amount <= 0) {
      this.uiManager.showNotification("Digite uma quantidade válida", "error")
      return
    }

    if (this.dataManager.addFuelStock(fuelType, amount)) {
      this.uiManager.showNotification(`${amount}L adicionados ao estoque de ${fuelType}`, "success")
      document.getElementById(inputId).value = ""
      this.renderStockManagement()
      this.uiManager.updateSidebar()
    } else {
      this.uiManager.showNotification("Erro ao adicionar estoque", "error")
    }
  }

  updatePrice(fuelType) {
    const inputId = `price-${fuelType.replace(/\s+/g, "-")}`
    const newPrice = Number.parseFloat(document.getElementById(inputId).value)

    if (!newPrice || newPrice <= 0) {
      this.uiManager.showNotification("Digite um preço válido", "error")
      return
    }

    if (this.dataManager.updateFuelPrice(fuelType, newPrice)) {
      this.uiManager.showNotification(`Preço do ${fuelType} atualizado para R$ ${newPrice.toFixed(2)}`, "success")
      this.renderStockManagement()
      this.uiManager.updateSidebar()
      this.pumpController.updatePumpDisplay()
    } else {
      this.uiManager.showNotification("Erro ao atualizar preço", "error")
    }
  }

  renderTransactionHistory() {
    const container = document.getElementById("transaction-history")
    const transactions = this.dataManager.getAllTransactions()

    if (transactions.length === 0) {
      container.innerHTML = '<div class="text-center" style="padding: 40px;">Nenhuma transação encontrada</div>'
      return
    }

    let html = `
      <table class="report-table">
        <thead>
          <tr>
            <th>Data/Hora</th>
            <th>Bomba</th>
            <th>Funcionário</th>
            <th>Combustível</th>
            <th>Volume</th>
            <th>Valor</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
    `

    transactions.forEach((transaction) => {
      html += `
        <tr>
          <td>${transaction.timestamp.toLocaleString("pt-BR")}</td>
          <td>BOMBA ${transaction.pumpId.toString().padStart(2, "0")}</td>
          <td>${transaction.employeeName}</td>
          <td>${transaction.fuelType}</td>
          <td>${transaction.amount.toFixed(2)}L</td>
          <td style="color: ${transaction.status === "completed" ? "#48bb78" : "#f56565"}">
            R$ ${transaction.value.toFixed(2)}
          </td>
          <td>
            <span style="color: ${transaction.status === "completed" ? "#48bb78" : "#f56565"}">
              ${transaction.status === "completed" ? "Concluída" : "Cancelada"}
            </span>
          </td>
        </tr>
      `
    })

    html += "</tbody></table>"
    container.innerHTML = html
  }
}

// Disponibilizar globalmente
window.ModalManager = ModalManager
