// Gerenciador de dados do sistema de posto de combustível
class DataManager {
  constructor() {
    this.pumps = this.initializePumps()
    this.fuelStock = this.initializeFuelStock()
    this.employees = this.initializeEmployees()
    this.transactions = this.initializeTransactions()
    this.history = this.initializeHistory()
    this.currentPump = 1
  }

  initializePumps() {
    return [
      {
        id: 1,
        name: "BOMBA 01",
        status: "available", // available, occupied, dispensing, maintenance
        availableFuels: ["Gasolina Comum", "Etanol"],
        selectedFuel: null,
        currentAmount: 0.0,
        targetAmount: 0.0,
        currentValue: 0.0,
        employeeCode: null,
        employeeName: null,
        isPaused: false,
        startTime: null,
      },
      {
        id: 2,
        name: "BOMBA 02",
        status: "available",
        availableFuels: ["Gasolina Aditivada", "Etanol"],
        selectedFuel: null,
        currentAmount: 0.0,
        targetAmount: 0.0,
        currentValue: 0.0,
        employeeCode: null,
        employeeName: null,
        isPaused: false,
        startTime: null,
      },
      {
        id: 3,
        name: "BOMBA 03",
        status: "available",
        availableFuels: ["Diesel S-10"],
        selectedFuel: null,
        currentAmount: 0.0,
        targetAmount: 0.0,
        currentValue: 0.0,
        employeeCode: null,
        employeeName: null,
        isPaused: false,
        startTime: null,
      },
      {
        id: 4,
        name: "BOMBA 04",
        status: "available",
        availableFuels: ["Gasolina Comum", "Gasolina Aditivada"],
        selectedFuel: null,
        currentAmount: 0.0,
        targetAmount: 0.0,
        currentValue: 0.0,
        employeeCode: null,
        employeeName: null,
        isPaused: false,
        startTime: null,
      },
      {
        id: 5,
        name: "BOMBA 05",
        status: "available",
        availableFuels: ["Etanol", "Diesel S-10"],
        selectedFuel: null,
        currentAmount: 0.0,
        targetAmount: 0.0,
        currentValue: 0.0,
        employeeCode: null,
        employeeName: null,
        isPaused: false,
        startTime: null,
      },
      {
        id: 6,
        name: "BOMBA 06",
        status: "available",
        availableFuels: ["Gasolina Comum", "Etanol", "Diesel S-10"],
        selectedFuel: null,
        currentAmount: 0.0,
        targetAmount: 0.0,
        currentValue: 0.0,
        employeeCode: null,
        employeeName: null,
        isPaused: false,
        startTime: null,
      },
      {
        id: 7,
        name: "BOMBA 07",
        status: "maintenance",
        availableFuels: ["Gasolina Aditivada", "Diesel S-10"],
        selectedFuel: null,
        currentAmount: 0.0,
        targetAmount: 0.0,
        currentValue: 0.0,
        employeeCode: null,
        employeeName: null,
        isPaused: false,
        startTime: null,
      },
    ]
  }

  initializeFuelStock() {
    return [
      {
        type: "Gasolina Comum",
        currentLevel: 8500,
        maxCapacity: 10000,
        price: 5.89,
        lowStockAlert: 2000,
      },
      {
        type: "Gasolina Aditivada",
        currentLevel: 7200,
        maxCapacity: 8000,
        price: 6.15,
        lowStockAlert: 1500,
      },
      {
        type: "Etanol",
        currentLevel: 6800,
        maxCapacity: 8000,
        price: 4.29,
        lowStockAlert: 1500,
      },
      {
        type: "Diesel S-10",
        currentLevel: 1800, // Low stock for demonstration
        maxCapacity: 12000,
        price: 5.45,
        lowStockAlert: 2500,
      },
    ]
  }

  initializeEmployees() {
    return [
      {
        code: "F001",
        name: "João Silva",
        shift: "Manhã",
        status: "active",
      },
      {
        code: "F002",
        name: "Maria Santos",
        shift: "Tarde",
        status: "active",
      },
      {
        code: "F003",
        name: "Pedro Costa",
        shift: "Noite",
        status: "active",
      },
      {
        code: "F004",
        name: "Ana Lima",
        shift: "Manhã",
        status: "inactive",
      },
      {
        code: "F005",
        name: "Carlos Oliveira",
        shift: "Tarde",
        status: "active",
      },
    ]
  }

  initializeTransactions() {
    // Simular algumas transações do dia
    const today = new Date()
    return [
      {
        id: "T" + Date.now() + "001",
        timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 30),
        pumpId: 1,
        employeeCode: "F001",
        employeeName: "João Silva",
        fuelType: "Gasolina Comum",
        amount: 45.5,
        value: 268.0,
        status: "completed",
      },
      {
        id: "T" + Date.now() + "002",
        timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 15),
        pumpId: 2,
        employeeCode: "F001",
        employeeName: "João Silva",
        fuelType: "Etanol",
        amount: 32.0,
        value: 137.28,
        status: "completed",
      },
      {
        id: "T" + Date.now() + "003",
        timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 45),
        pumpId: 3,
        employeeCode: "F002",
        employeeName: "Maria Santos",
        fuelType: "Diesel S-10",
        amount: 60.0,
        value: 327.0,
        status: "completed",
      },
      {
        id: "T" + Date.now() + "004",
        timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 20),
        pumpId: 1,
        employeeCode: "F002",
        employeeName: "Maria Santos",
        fuelType: "Gasolina Comum",
        amount: 25.0,
        value: 147.25,
        status: "cancelled",
      },
    ]
  }

  initializeHistory() {
    return [
      {
        timestamp: new Date(),
        event: "Sistema Iniciado",
        detail: "Sistema de gerenciamento do posto inicializado",
        device: "Sistema",
      },
    ]
  }

  // Métodos para gerenciar bombas
  getPump(pumpId) {
    return this.pumps.find((pump) => pump.id === pumpId)
  }

  getAllPumps() {
    return this.pumps
  }

  // Métodos para gerenciar estoque
  getFuelStock(fuelType) {
    return this.fuelStock.find((stock) => stock.type === fuelType)
  }

  getAllFuelStock() {
    return this.fuelStock
  }

  updateFuelStock(fuelType, amount) {
    const stock = this.getFuelStock(fuelType)
    if (stock) {
      stock.currentLevel -= amount
      if (stock.currentLevel < 0) stock.currentLevel = 0
      return true
    }
    return false
  }

  addFuelStock(fuelType, amount) {
    const stock = this.getFuelStock(fuelType)
    if (stock) {
      stock.currentLevel += amount
      if (stock.currentLevel > stock.maxCapacity) {
        stock.currentLevel = stock.maxCapacity
      }
      return true
    }
    return false
  }

  updateFuelPrice(fuelType, newPrice) {
    const stock = this.getFuelStock(fuelType)
    if (stock) {
      stock.price = newPrice
      return true
    }
    return false
  }

  // Métodos para gerenciar funcionários
  getEmployee(code) {
    return this.employees.find((emp) => emp.code === code)
  }

  getAllEmployees() {
    return this.employees
  }

  addEmployee(code, name, shift) {
    if (this.getEmployee(code)) {
      return { success: false, message: "Código já existe" }
    }

    this.employees.push({
      code: code,
      name: name,
      shift: shift,
      status: "active",
    })

    this.addToHistory("Funcionário Adicionado", `${name} (${code}) adicionado ao sistema`, "Sistema")
    return { success: true, message: "Funcionário adicionado com sucesso" }
  }

  toggleEmployeeStatus(code) {
    const employee = this.getEmployee(code)
    if (employee) {
      employee.status = employee.status === "active" ? "inactive" : "active"
      this.addToHistory(
        "Status Alterado",
        `${employee.name} (${code}) ${employee.status === "active" ? "ativado" : "desativado"}`,
        "Sistema",
      )
      return true
    }
    return false
  }

  // Métodos para controle de abastecimento
  selectFuel(pumpId, fuelType) {
    const pump = this.getPump(pumpId)
    const stock = this.getFuelStock(fuelType)

    if (!pump) {
      return { success: false, message: "Bomba não encontrada" }
    }

    if (pump.status !== "available") {
      return { success: false, message: "Bomba não está disponível" }
    }

    if (!pump.availableFuels.includes(fuelType)) {
      return { success: false, message: "Combustível não disponível nesta bomba" }
    }

    if (!stock || stock.currentLevel <= 0) {
      return { success: false, message: "Combustível em falta no estoque" }
    }

    pump.selectedFuel = fuelType
    this.addToHistory("Combustível Selecionado", `${fuelType} selecionado na ${pump.name}`, pump.name)
    return { success: true, message: "Combustível selecionado com sucesso" }
  }

  validateEmployee(pumpId, employeeCode) {
    const pump = this.getPump(pumpId)
    const employee = this.getEmployee(employeeCode)

    if (!pump) {
      return { success: false, message: "Bomba não encontrada" }
    }

    if (!employee) {
      return { success: false, message: "Funcionário não encontrado" }
    }

    if (employee.status !== "active") {
      return { success: false, message: "Funcionário inativo" }
    }

    pump.employeeCode = employeeCode
    pump.employeeName = employee.name
    pump.status = "occupied"

    this.addToHistory("Funcionário Vinculado", `${employee.name} (${employeeCode}) vinculado à ${pump.name}`, pump.name)
    return { success: true, message: "Funcionário validado com sucesso", employee: employee }
  }

  startFueling(pumpId, targetAmount) {
    const pump = this.getPump(pumpId)

    if (!pump) {
      return { success: false, message: "Bomba não encontrada" }
    }

    if (pump.status !== "occupied") {
      return { success: false, message: "Bomba não está ocupada por funcionário" }
    }

    if (!pump.selectedFuel) {
      return { success: false, message: "Nenhum combustível selecionado" }
    }

    if (!pump.employeeCode) {
      return { success: false, message: "Nenhum funcionário vinculado" }
    }

    const stock = this.getFuelStock(pump.selectedFuel)
    if (!stock || stock.currentLevel < targetAmount) {
      return { success: false, message: "Estoque insuficiente" }
    }

    pump.targetAmount = targetAmount
    pump.currentAmount = 0.0
    pump.currentValue = 0.0
    pump.status = "dispensing"
    pump.isPaused = false
    pump.startTime = new Date()

    this.addToHistory(
      "Abastecimento Iniciado",
      `Iniciado abastecimento de ${targetAmount}L de ${pump.selectedFuel} por ${pump.employeeName}`,
      pump.name,
    )
    return { success: true, message: "Abastecimento iniciado com sucesso" }
  }

  pauseDispensing(pumpId) {
    const pump = this.getPump(pumpId)

    if (!pump || pump.status !== "dispensing") {
      return { success: false, message: "Bomba não está dispensando" }
    }

    pump.isPaused = true
    this.addToHistory(
      "Abastecimento Pausado",
      `Pausado em ${pump.currentAmount.toFixed(2)}L de ${pump.targetAmount}L`,
      pump.name,
    )
    return { success: true, message: "Abastecimento pausado" }
  }

  resumeDispensing(pumpId) {
    const pump = this.getPump(pumpId)

    if (!pump || pump.status !== "dispensing" || !pump.isPaused) {
      return { success: false, message: "Bomba não está pausada" }
    }

    pump.isPaused = false
    this.addToHistory(
      "Abastecimento Retomado",
      `Retomado de ${pump.currentAmount.toFixed(2)}L para ${pump.targetAmount}L`,
      pump.name,
    )
    return { success: true, message: "Abastecimento retomado" }
  }

  completeFueling(pumpId) {
    const pump = this.getPump(pumpId)

    if (!pump) {
      return { success: false, message: "Bomba não encontrada" }
    }

    if (pump.status !== "dispensing" && pump.status !== "occupied") {
      return { success: false, message: "Nenhum abastecimento ativo" }
    }

    // Finalizar com a quantidade atual
    const finalAmount = pump.currentAmount
    const finalValue = pump.currentValue

    // Atualizar estoque
    this.updateFuelStock(pump.selectedFuel, finalAmount)

    // Criar transação
    const transaction = {
      id: "T" + Date.now(),
      timestamp: new Date(),
      pumpId: pump.id,
      employeeCode: pump.employeeCode,
      employeeName: pump.employeeName,
      fuelType: pump.selectedFuel,
      amount: finalAmount,
      value: finalValue,
      status: "completed",
    }

    this.transactions.unshift(transaction)

    // Reset da bomba
    this.resetPump(pumpId)

    this.addToHistory(
      "Abastecimento Concluído",
      `Concluído: ${finalAmount.toFixed(2)}L de ${transaction.fuelType} - R$ ${finalValue.toFixed(2)}`,
      pump.name,
    )

    return { success: true, message: "Abastecimento concluído com sucesso", transaction: transaction }
  }

  cancelFueling(pumpId) {
    const pump = this.getPump(pumpId)

    if (!pump) {
      return { success: false, message: "Bomba não encontrada" }
    }

    if (pump.status !== "dispensing" && pump.status !== "occupied") {
      return { success: false, message: "Nenhum abastecimento ativo" }
    }

    // Se já dispensou algo, criar transação cancelada
    if (pump.currentAmount > 0) {
      this.updateFuelStock(pump.selectedFuel, pump.currentAmount)

      const transaction = {
        id: "T" + Date.now(),
        timestamp: new Date(),
        pumpId: pump.id,
        employeeCode: pump.employeeCode,
        employeeName: pump.employeeName,
        fuelType: pump.selectedFuel,
        amount: pump.currentAmount,
        value: pump.currentValue,
        status: "cancelled",
      }

      this.transactions.unshift(transaction)
    }

    this.addToHistory(
      "Abastecimento Cancelado",
      `Cancelado: ${pump.currentAmount.toFixed(2)}L de ${pump.selectedFuel || "N/A"}`,
      pump.name,
    )

    // Reset da bomba
    this.resetPump(pumpId)

    return { success: true, message: "Abastecimento cancelado" }
  }

  resetPump(pumpId) {
    const pump = this.getPump(pumpId)
    if (pump) {
      pump.status = "available"
      pump.selectedFuel = null
      pump.currentAmount = 0.0
      pump.targetAmount = 0.0
      pump.currentValue = 0.0
      pump.employeeCode = null
      pump.employeeName = null
      pump.isPaused = false
      pump.startTime = null
    }
  }

  // Métodos para transações
  getAllTransactions() {
    return this.transactions
  }

  getTransactionsByDate(date) {
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)

    return this.transactions.filter((t) => t.timestamp >= startOfDay && t.timestamp < endOfDay)
  }

  getDailyTotals(date = new Date()) {
    const dayTransactions = this.getTransactionsByDate(date)
    const completed = dayTransactions.filter((t) => t.status === "completed")

    return {
      totalValue: completed.reduce((sum, t) => sum + t.value, 0),
      totalVolume: completed.reduce((sum, t) => sum + t.amount, 0),
      totalTransactions: completed.length,
      cancelledTransactions: dayTransactions.filter((t) => t.status === "cancelled").length,
    }
  }

  // Métodos para histórico
  addToHistory(event, detail, device) {
    this.history.unshift({
      timestamp: new Date(),
      event: event,
      detail: detail,
      device: device,
    })

    // Manter apenas os últimos 1000 registros
    if (this.history.length > 1000) {
      this.history = this.history.slice(0, 1000)
    }
  }

  getHistory() {
    return this.history
  }

  // Simulação de tempo real
  simulateRealTimeData() {
    this.pumps.forEach((pump) => {
      if (pump.status === "dispensing" && !pump.isPaused && pump.targetAmount > 0) {
        if (pump.currentAmount < pump.targetAmount) {
          // Simular velocidade de dispensação (0.1 a 0.3 L/s)
          const dispensingSpeed = 0.1 + Math.random() * 0.2
          const newAmount = Math.min(pump.currentAmount + dispensingSpeed, pump.targetAmount)

          pump.currentAmount = newAmount

          // Calcular valor baseado no preço atual
          const stock = this.getFuelStock(pump.selectedFuel)
          if (stock) {
            pump.currentValue = pump.currentAmount * stock.price
          }

          // Se atingiu a meta, completar automaticamente
          if (pump.currentAmount >= pump.targetAmount) {
            setTimeout(() => {
              this.completeFueling(pump.id)
            }, 1000)
          }
        }
      }
    })
  }

  // Métodos para relatórios
  generateDailyReport(date = new Date()) {
    const transactions = this.getTransactionsByDate(date)
    const completed = transactions.filter((t) => t.status === "completed")
    const cancelled = transactions.filter((t) => t.status === "cancelled")

    // Totais gerais
    const totalRevenue = completed.reduce((sum, t) => sum + t.value, 0)
    const totalVolume = completed.reduce((sum, t) => sum + t.amount, 0)

    // Por tipo de combustível
    const fuelBreakdown = {}
    completed.forEach((t) => {
      if (!fuelBreakdown[t.fuelType]) {
        fuelBreakdown[t.fuelType] = { volume: 0, revenue: 0, transactions: 0 }
      }
      fuelBreakdown[t.fuelType].volume += t.amount
      fuelBreakdown[t.fuelType].revenue += t.value
      fuelBreakdown[t.fuelType].transactions += 1
    })

    // Por funcionário
    const employeeBreakdown = {}
    completed.forEach((t) => {
      if (!employeeBreakdown[t.employeeCode]) {
        employeeBreakdown[t.employeeCode] = {
          name: t.employeeName,
          volume: 0,
          revenue: 0,
          transactions: 0,
        }
      }
      employeeBreakdown[t.employeeCode].volume += t.amount
      employeeBreakdown[t.employeeCode].revenue += t.value
      employeeBreakdown[t.employeeCode].transactions += 1
    })

    // Por bomba
    const pumpBreakdown = {}
    completed.forEach((t) => {
      if (!pumpBreakdown[t.pumpId]) {
        pumpBreakdown[t.pumpId] = { volume: 0, revenue: 0, transactions: 0 }
      }
      pumpBreakdown[t.pumpId].volume += t.amount
      pumpBreakdown[t.pumpId].revenue += t.value
      pumpBreakdown[t.pumpId].transactions += 1
    })

    return {
      date: date,
      summary: {
        totalRevenue,
        totalVolume,
        completedTransactions: completed.length,
        cancelledTransactions: cancelled.length,
        totalTransactions: transactions.length,
      },
      fuelBreakdown,
      employeeBreakdown,
      pumpBreakdown,
      transactions: transactions,
    }
  }
}

// Disponibilizar globalmente
window.DataManager = DataManager
