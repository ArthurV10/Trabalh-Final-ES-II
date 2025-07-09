// Gerenciador da interface do usuário
class UIManager {
  constructor(dataManager, pumpController) {
    this.dataManager = dataManager
    this.pumpController = pumpController
    this.notificationId = 0
  }

  init() {
    this.updateTime()
    this.updateSidebar()
    this.updateMonitor()
    this.updateTransactions()
    this.pumpController.updatePumpDisplay()

    // Update time every second
    setInterval(() => this.updateTime(), 1000)

    // Update UI every 2 seconds
    setInterval(() => {
      this.updateSidebar()
      this.updateMonitor()
      this.updateTransactions()
      this.pumpController.updatePumpDisplay()
    }, 2000)
  }

  updateTime() {
    const now = new Date()
    const formatted = now.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
    document.getElementById("current-time").textContent = formatted
  }

  updateSidebar() {
    this.renderFuelStock()
    this.renderPumpsList()
  }

  renderFuelStock() {
    const container = document.getElementById("fuel-stock-list")
    const fuelStock = this.dataManager.getAllFuelStock()

    let html = ""

    fuelStock.forEach((stock) => {
      const percentage = (stock.currentLevel / stock.maxCapacity) * 100
      const isLowStock = stock.currentLevel <= stock.lowStockAlert

      html += `
        <div class="stock-item ${isLowStock ? "low-stock" : ""}">
          <div class="stock-info">
            <div class="stock-type">
              ${stock.type}
              ${isLowStock ? '<span class="stock-alert">BAIXO</span>' : ""}
            </div>
            <div class="stock-level-display">
              <div class="level-number">${percentage.toFixed(0)}%</div>
              <div class="level-bar">
                <div class="level-fill" style="width: ${percentage}%"></div>
              </div>
            </div>
            <div class="stock-price">R$ ${stock.price.toFixed(2)}/L</div>
          </div>
        </div>
      `
    })

    container.innerHTML = html
  }

  renderPumpsList() {
    const container = document.getElementById("pumps-list")
    const pumps = this.dataManager.getAllPumps()
    const currentPump = this.dataManager.currentPump

    let html = ""

    pumps.forEach((pump) => {
      const statusText = {
        available: "Disponível",
        occupied: "Ocupada",
        dispensing: "Abastecendo",
        maintenance: "Manutenção",
      }

      html += `
        <button class="pump-item ${currentPump === pump.id ? "active" : ""}" 
                onclick="if(window.pumpController) window.pumpController.selectPump(${pump.id})">
          <div class="pump-number">${pump.id.toString().padStart(2, "0")}</div>
          <div class="pump-details">
            <div class="pump-name">${pump.name}</div>
            <div class="pump-fuel-types">${pump.availableFuels.join(", ")}</div>
            <div class="pump-status-text">${statusText[pump.status]}</div>
            ${pump.employeeName ? `<div class="pump-employee">${pump.employeeName}</div>` : ""}
          </div>
          <div class="status-indicator-pump ${pump.status}"></div>
        </button>
      `
    })

    container.innerHTML = html
  }

  updateMonitor() {
    const container = document.getElementById("monitor-list")
    const pumps = this.dataManager.getAllPumps()

    let html = ""

    pumps.forEach((pump) => {
      const statusText = {
        available: "Disponível",
        occupied: "Ocupada",
        dispensing: "Abastecendo",
        maintenance: "Manutenção",
      }

      html += `
        <div class="monitor-item">
          <div class="monitor-header">
            <div class="monitor-pump-name">
              <div class="status-indicator-pump ${pump.status}"></div>
              ${pump.name}
            </div>
            <div class="monitor-status ${pump.status}">${statusText[pump.status]}</div>
          </div>
          
          ${
            pump.employeeName
              ? `
            <div class="monitor-employee">
              <i class="fas fa-user"></i>
              ${pump.employeeName} (${pump.employeeCode})
            </div>
          `
              : ""
          }
          
          ${
            pump.selectedFuel
              ? `
            <div class="monitor-fuel-info">
              <i class="fas fa-droplet"></i>
              ${pump.selectedFuel}
            </div>
          `
              : ""
          }
          
          ${
            pump.targetAmount > 0
              ? `
            <div class="monitor-progress">
              <div class="progress-info">
                <span>Meta: ${pump.targetAmount.toFixed(2)}L</span>
                <span>${((pump.currentAmount / pump.targetAmount) * 100).toFixed(1)}%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill ${pump.status}" style="width: ${Math.min((pump.currentAmount / pump.targetAmount) * 100, 100)}%"></div>
              </div>
            </div>
          `
              : ""
          }
          
          <div class="monitor-amount">
            <div class="monitor-amount-value ${pump.status}">
              ${pump.currentAmount.toFixed(2)}L - R$ ${pump.currentValue.toFixed(2)}
            </div>
          </div>
        </div>
      `
    })

    container.innerHTML = html
  }

  updateTransactions() {
    const container = document.getElementById("transactions-list")
    const transactions = this.dataManager.getAllTransactions().slice(0, 8) // Últimas 8
    const dailyTotals = this.dataManager.getDailyTotals()

    // Update summary
    document.getElementById("daily-total").textContent = `R$ ${dailyTotals.totalValue.toFixed(2)}`
    document.getElementById("daily-liters").textContent = `${dailyTotals.totalVolume.toFixed(1)}L`

    // Update transactions list
    let html = ""

    if (transactions.length === 0) {
      html = '<div class="text-center" style="padding: 20px; color: #718096;">Nenhuma transação hoje</div>'
    } else {
      transactions.forEach((transaction) => {
        html += `
          <div class="transaction-item ${transaction.status}">
            <div class="transaction-header">
              <div class="transaction-pump">BOMBA ${transaction.pumpId.toString().padStart(2, "0")}</div>
              <div class="transaction-time">${transaction.timestamp.toLocaleTimeString("pt-BR")}</div>
            </div>
            <div class="transaction-info">
              <div><strong>Funcionário:</strong> ${transaction.employeeName}</div>
              <div><strong>Combustível:</strong> ${transaction.fuelType}</div>
              <div>
                <strong>Volume:</strong> ${transaction.amount.toFixed(2)}L
                <span class="transaction-value ${transaction.status}">R$ ${transaction.value.toFixed(2)}</span>
              </div>
              ${transaction.status === "cancelled" ? '<div style="color: #f56565; font-weight: 600;">CANCELADA</div>' : ""}
            </div>
          </div>
        `
      })
    }

    container.innerHTML = html
  }

  showNotification(message, type = "success") {
    const container = document.getElementById("notification-container")
    const id = ++this.notificationId

    const notification = document.createElement("div")
    notification.className = `notification notification-${type}`
    notification.id = `notification-${id}`

    const icons = {
      success: "✅",
      warning: "⚠️",
      error: "❌",
    }

    notification.innerHTML = `
      <div class="notification-content">
        <div class="notification-icon">${icons[type] || "ℹ️"}</div>
        <div class="notification-message">${message}</div>
        <button class="notification-close" onclick="if(window.uiManager) window.uiManager.closeNotification(${id})">&times;</button>
      </div>
    `

    container.appendChild(notification)

    // Auto remove after 5 seconds
    setTimeout(() => {
      this.closeNotification(id)
    }, 5000)
  }

  closeNotification(id) {
    const notification = document.getElementById(`notification-${id}`)
    if (notification) {
      notification.remove()
    }
  }
}

// Disponibilizar globalmente
window.UIManager = UIManager
