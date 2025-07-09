// Script principal - inicialização do sistema
document.addEventListener("DOMContentLoaded", () => {
  // Aguardar um pouco para garantir que todas as classes foram carregadas
  setTimeout(() => {
    try {
      // Importar classes necessárias
      const DataManager = window.DataManager
      const PumpController = window.PumpController
      const UIManager = window.UIManager
      const EmployeeManager = window.EmployeeManager
      const ReportManager = window.ReportManager
      const ModalManager = window.ModalManager

      // Criar instâncias na ordem correta
      const dataManager = new DataManager()
      const pumpController = new PumpController(dataManager, null)
      const uiManager = new UIManager(dataManager, pumpController)
      const employeeManager = new EmployeeManager(dataManager, uiManager)
      const reportManager = new ReportManager(uiManager, dataManager)
      const modalManager = new ModalManager(employeeManager, reportManager, dataManager, uiManager, pumpController)

      // Disponibilizar globalmente
      window.dataManager = dataManager
      window.pumpController = pumpController
      window.uiManager = uiManager
      window.employeeManager = employeeManager
      window.reportManager = reportManager
      window.modalManager = modalManager

      // Atualizar referência do uiManager no pumpController
      pumpController.uiManager = uiManager

      // Inicializar o sistema
      uiManager.init()

      // Iniciar simulação de tempo real
      setInterval(() => {
        dataManager.simulateRealTimeData()
      }, 2000)

      // Keyboard shortcuts
      document.addEventListener("keydown", (e) => {
        // Verificar se o usuário está digitando em um input ou textarea
        const activeElement = document.activeElement
        const isTyping =
          activeElement &&
          (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA" || activeElement.isContentEditable)

        // Se estiver digitando, não processar atalhos de números
        if (isTyping && e.key >= "1" && e.key <= "7") {
          return // Deixar o comportamento normal do input
        }

        // Numbers 1-7 for pump selection (apenas se não estiver digitando)
        if (e.key >= "1" && e.key <= "7" && !e.ctrlKey && !e.altKey && !e.shiftKey && !isTyping) {
          const pumpNumber = Number.parseInt(e.key)
          pumpController.selectPump(pumpNumber)
        }

        // Ctrl + E for employees
        if (e.ctrlKey && e.key === "e") {
          e.preventDefault()
          modalManager.showEmployees()
        }

        // Ctrl + S for stock
        if (e.ctrlKey && e.key === "s") {
          e.preventDefault()
          modalManager.showStock()
        }

        // Ctrl + R for report
        if (e.ctrlKey && e.key === "r") {
          e.preventDefault()
          modalManager.showDailyReport()
        }

        // Escape to close modals
        if (e.key === "Escape") {
          const modals = document.querySelectorAll(".modal")
          modals.forEach((modal) => {
            if (modal.style.display === "flex") {
              modalManager.closeModal(modal.id)
            }
          })
        }
      })

      // Enter key handlers for inputs
      const employeeCodeInput = document.getElementById("employee-code")
      if (employeeCodeInput) {
        employeeCodeInput.addEventListener("keypress", (e) => {
          if (e.key === "Enter") {
            pumpController.validateEmployee()
          }
        })
      }

      const fuelAmountInput = document.getElementById("fuel-amount")
      if (fuelAmountInput) {
        fuelAmountInput.addEventListener("keypress", (e) => {
          if (e.key === "Enter") {
            pumpController.startFueling()
          }
        })
      }

      // Auto-focus on employee code input when pump is selected
      const originalSelectPump = pumpController.selectPump
      pumpController.selectPump = function (pumpId) {
        originalSelectPump.call(this, pumpId)

        setTimeout(() => {
          const pump = dataManager.getPump(pumpId)
          if (pump && pump.status === "available" && pump.selectedFuel) {
            const employeeInput = document.getElementById("employee-code")
            if (employeeInput && employeeInput.style.display !== "none") {
              employeeInput.focus()
            }
          }
        }, 100)
      }

      console.log("Sistema de Posto de Combustível inicializado com sucesso!")
      console.log("Atalhos do teclado:")
      console.log("- 1-7: Selecionar bomba")
      console.log("- Ctrl+E: Funcionários")
      console.log("- Ctrl+S: Estoque")
      console.log("- Ctrl+R: Relatório")
      console.log("- ESC: Fechar modais")
    } catch (error) {
      console.error("Erro ao inicializar o sistema:", error)
      // Tentar novamente após um tempo
      setTimeout(() => {
        location.reload()
      }, 2000)
    }
  }, 100)
})

// Event listeners para fechar modais clicando fora
window.onclick = (event) => {
  if (window.modalManager) {
    const modals = document.querySelectorAll(".modal")
    modals.forEach((modal) => {
      if (event.target === modal) {
        window.modalManager.closeModal(modal.id)
      }
    })
  }
}

// Função global para debug (pode ser removida em produção)
window.debugSystem = () => {
  if (window.dataManager) {
    console.log("=== DEBUG SYSTEM ===")
    console.log("Pumps:", window.dataManager.getAllPumps())
    console.log("Fuel Stock:", window.dataManager.getAllFuelStock())
    console.log("Employees:", window.dataManager.getAllEmployees())
    console.log("Transactions:", window.dataManager.getAllTransactions())
    console.log("History:", window.dataManager.getHistory())
  } else {
    console.log("Sistema ainda não foi inicializado")
  }
}
