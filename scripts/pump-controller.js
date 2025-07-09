// Controlador das bombas
class PumpController {
  constructor(dataManager, uiManager) {
    this.dataManager = dataManager
    this.uiManager = uiManager
    this.currentPump = 1
  }

  selectPump(pumpId) {
    this.currentPump = pumpId
    this.dataManager.currentPump = pumpId
    this.updatePumpDisplay()
    if (this.uiManager) {
      this.uiManager.updateSidebar()
    }
  }

  selectFuel(fuelType) {
    const result = this.dataManager.selectFuel(this.currentPump, fuelType)

    if (result.success) {
      this.uiManager.showNotification(result.message, "success")
      this.updatePumpDisplay()
    } else {
      this.uiManager.showNotification(result.message, "error")
    }
  }

  validateEmployee() {
    const employeeCode = document.getElementById("employee-code").value.trim().toUpperCase()

    if (!employeeCode) {
      this.uiManager.showNotification("Digite o código do funcionário", "error")
      return
    }

    const result = this.dataManager.validateEmployee(this.currentPump, employeeCode)

    if (result.success) {
      this.uiManager.showNotification(result.message, "success")
      this.showEmployeeInfo(result.employee)
      this.showAmountSection()
      document.getElementById("employee-code").value = ""
    } else {
      this.uiManager.showNotification(result.message, "error")
    }
  }

  showEmployeeInfo(employee) {
    const employeeInfo = document.getElementById("employee-info")
    const employeeName = document.getElementById("employee-name")
    const employeeShift = document.getElementById("employee-shift")

    employeeName.textContent = employee.name
    employeeShift.textContent = `Turno: ${employee.shift}`
    employeeInfo.style.display = "block"
  }

  showAmountSection() {
    document.getElementById("amount-section").style.display = "block"
  }

  startFueling() {
    const fuelAmount = Number.parseFloat(document.getElementById("fuel-amount").value)

    if (!fuelAmount || fuelAmount <= 0) {
      this.uiManager.showNotification("Digite uma quantidade válida", "error")
      return
    }

    if (fuelAmount > 999.99) {
      this.uiManager.showNotification("Quantidade máxima é 999.99L", "error")
      return
    }

    const result = this.dataManager.startFueling(this.currentPump, fuelAmount)

    if (result.success) {
      this.uiManager.showNotification(result.message, "success")
      document.getElementById("fuel-amount").value = ""
      this.updatePumpDisplay()
    } else {
      this.uiManager.showNotification(result.message, "error")
    }
  }

  pauseDispensing() {
    const result = this.dataManager.pauseDispensing(this.currentPump)

    if (result.success) {
      this.uiManager.showNotification(result.message, "warning")
      this.updatePumpDisplay()
    } else {
      this.uiManager.showNotification(result.message, "error")
    }
  }

  resumeDispensing() {
    const result = this.dataManager.resumeDispensing(this.currentPump)

    if (result.success) {
      this.uiManager.showNotification(result.message, "success")
      this.updatePumpDisplay()
    } else {
      this.uiManager.showNotification(result.message, "error")
    }
  }

  completeFueling() {
    if (confirm("Finalizar abastecimento?")) {
      const result = this.dataManager.completeFueling(this.currentPump)

      if (result.success) {
        this.uiManager.showNotification(result.message, "success")
        this.resetPumpDisplay()
        this.uiManager.updateTransactions()
        this.uiManager.updateSidebar()
      } else {
        this.uiManager.showNotification(result.message, "error")
      }
    }
  }

  cancelFueling() {
    if (confirm("Cancelar abastecimento?")) {
      const result = this.dataManager.cancelFueling(this.currentPump)

      if (result.success) {
        this.uiManager.showNotification(result.message, "warning")
        this.resetPumpDisplay()
        this.uiManager.updateTransactions()
        this.uiManager.updateSidebar()
      } else {
        this.uiManager.showNotification(result.message, "error")
      }
    }
  }

  updatePumpDisplay() {
    const pump = this.dataManager.getPump(this.currentPump)
    if (!pump) return

    // Update title
    document.getElementById("pump-title").textContent = pump.name

    // Update fuel selection
    this.renderFuelOptions(pump)

    // Update employee section visibility
    const employeeSection = document.getElementById("employee-section")
    const amountSection = document.getElementById("amount-section")
    const employeeInfo = document.getElementById("employee-info")

    if (pump.status === "available") {
      employeeSection.style.display = pump.selectedFuel ? "block" : "none"
      amountSection.style.display = "none"
      employeeInfo.style.display = "none"
    } else if (pump.status === "occupied") {
      employeeSection.style.display = "none"
      amountSection.style.display = "block"
      employeeInfo.style.display = "block"
      this.showEmployeeInfo({
        name: pump.employeeName,
        shift: this.dataManager.getEmployee(pump.employeeCode)?.shift || "N/A",
      })
    } else {
      employeeSection.style.display = "none"
      amountSection.style.display = "none"
      employeeInfo.style.display = pump.employeeName ? "block" : "none"
      if (pump.employeeName) {
        this.showEmployeeInfo({
          name: pump.employeeName,
          shift: this.dataManager.getEmployee(pump.employeeCode)?.shift || "N/A",
        })
      }
    }

    // Update display values
    document.getElementById("current-amount").textContent = pump.currentAmount.toFixed(2)
    document.getElementById("current-value").textContent = `R$ ${pump.currentValue.toFixed(2)}`

    // Update progress
    const progressSection = document.getElementById("progress-section")
    if (pump.targetAmount > 0) {
      progressSection.style.display = "block"
      const progressText = document.getElementById("progress-text")
      const progressFill = document.getElementById("progress-fill")

      progressText.textContent = `${pump.currentAmount.toFixed(2)}L / ${pump.targetAmount.toFixed(2)}L`
      const percentage = (pump.currentAmount / pump.targetAmount) * 100
      progressFill.style.width = `${Math.min(percentage, 100)}%`

      if (pump.status === "dispensing") {
        progressFill.classList.add("dispensing")
      } else {
        progressFill.classList.remove("dispensing")
      }
    } else {
      progressSection.style.display = "none"
    }

    // Update status badge
    const statusBadge = document.getElementById("pump-status")
    const statusText = {
      available: "Disponível",
      occupied: "Ocupada",
      dispensing: "Abastecendo",
      maintenance: "Manutenção",
    }

    statusBadge.textContent = statusText[pump.status] || pump.status
    statusBadge.className = `status-badge ${pump.status}`

    // Update control buttons
    this.renderControlButtons(pump)
  }

  renderFuelOptions(pump) {
    const container = document.getElementById("fuel-options")
    const fuelStock = this.dataManager.getAllFuelStock()

    let html = ""

    pump.availableFuels.forEach((fuelType) => {
      const stock = fuelStock.find((s) => s.type === fuelType)
      const isSelected = pump.selectedFuel === fuelType
      const isAvailable = stock && stock.currentLevel > 0
      const isDisabled = pump.status !== "available"

      html += `
        <div class="fuel-option ${isSelected ? "selected" : ""} ${!isAvailable || isDisabled ? "unavailable" : ""}" 
             onclick="${!isDisabled && isAvailable ? `if(window.pumpController) window.pumpController.selectFuel('${fuelType}')` : ""}">
          <div class="fuel-name">${fuelType}</div>
          <div class="fuel-price">R$ ${stock ? stock.price.toFixed(2) : "0.00"}</div>
          <div class="fuel-stock">${stock ? stock.currentLevel.toFixed(0) : "0"}L</div>
        </div>
      `
    })

    container.innerHTML = html
  }

  renderControlButtons(pump) {
    const container = document.getElementById("control-actions")
    let html = ""

    if (pump.status === "maintenance") {
      html = `
        <button class="btn btn-danger" disabled>
          <i class="fas fa-wrench"></i>
          Em Manutenção
        </button>
      `
    } else if (pump.status === "available") {
      if (!pump.selectedFuel) {
        html = `
          <button class="btn btn-primary" disabled>
            <i class="fas fa-droplet"></i>
            Selecione o combustível
          </button>
        `
      } else {
        html = `
          <button class="btn btn-primary" disabled>
            <i class="fas fa-user"></i>
            Digite o código do funcionário
          </button>
        `
      }
    } else if (pump.status === "occupied") {
      html = `
        <button class="btn btn-success" onclick="if(window.pumpController) window.pumpController.startFueling()">
          <i class="fas fa-play"></i>
          Iniciar Abastecimento
        </button>
        <button class="btn btn-danger" onclick="if(window.pumpController) window.pumpController.cancelFueling()">
          <i class="fas fa-times"></i>
          Cancelar
        </button>
      `
    } else if (pump.status === "dispensing") {
      if (pump.isPaused) {
        html = `
          <button class="btn btn-success" onclick="if(window.pumpController) window.pumpController.resumeDispensing()">
            <i class="fas fa-play"></i>
            Retomar
          </button>
          <button class="btn btn-primary" onclick="if(window.pumpController) window.pumpController.completeFueling()">
            <i class="fas fa-check"></i>
            Finalizar
          </button>
          <button class="btn btn-danger" onclick="if(window.pumpController) window.pumpController.cancelFueling()">
            <i class="fas fa-times"></i>
            Cancelar
          </button>
        `
      } else {
        html = `
          <button class="btn btn-warning" onclick="if(window.pumpController) window.pumpController.pauseDispensing()">
            <i class="fas fa-pause"></i>
            Pausar
          </button>
          <button class="btn btn-primary" onclick="if(window.pumpController) window.pumpController.completeFueling()">
            <i class="fas fa-check"></i>
            Finalizar
          </button>
          <button class="btn btn-danger" onclick="if(window.pumpController) window.pumpController.cancelFueling()">
            <i class="fas fa-times"></i>
            Cancelar
          </button>
        `
      }
    }

    container.innerHTML = html
  }

  resetPumpDisplay() {
    document.getElementById("employee-info").style.display = "none"
    document.getElementById("amount-section").style.display = "none"
    document.getElementById("progress-section").style.display = "none"
    document.getElementById("employee-code").value = ""
    document.getElementById("fuel-amount").value = ""
    this.updatePumpDisplay()
  }
}

// Disponibilizar globalmente
window.PumpController = PumpController
