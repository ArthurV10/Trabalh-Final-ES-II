// Gerenciador de relatórios
class ReportManager {
  constructor(uiManager, dataManager) {
    this.uiManager = uiManager
    this.dataManager = dataManager
  }

  generateReport() {
    const dateInput = document.getElementById("report-date")
    const selectedDate = new Date(dateInput.value + "T00:00:00")

    if (isNaN(selectedDate.getTime())) {
      this.uiManager.showNotification("Data inválida", "error")
      return
    }

    const report = this.dataManager.generateDailyReport(selectedDate)
    this.renderReport(report)
  }

  renderReport(report) {
    const container = document.getElementById("daily-report-content")

    let html = `
      <div class="report-section">
        <h4>Resumo do Dia - ${report.date.toLocaleDateString("pt-BR")}</h4>
        <div class="report-grid">
          <div class="report-card revenue">
            <div class="report-value">R$ ${report.summary.totalRevenue.toFixed(2)}</div>
            <div class="report-label">Faturamento Total</div>
          </div>
          <div class="report-card volume">
            <div class="report-value">${report.summary.totalVolume.toFixed(1)}L</div>
            <div class="report-label">Volume Total</div>
          </div>
          <div class="report-card transactions">
            <div class="report-value">${report.summary.completedTransactions}</div>
            <div class="report-label">Transações Concluídas</div>
          </div>
          <div class="report-card">
            <div class="report-value">${report.summary.cancelledTransactions}</div>
            <div class="report-label">Transações Canceladas</div>
          </div>
        </div>
      </div>

      <div class="report-section">
        <h4>Vendas por Combustível</h4>
        <table class="report-table">
          <thead>
            <tr>
              <th>Combustível</th>
              <th>Volume (L)</th>
              <th>Faturamento (R$)</th>
              <th>Transações</th>
              <th>Preço Médio</th>
            </tr>
          </thead>
          <tbody>
    `

    Object.entries(report.fuelBreakdown).forEach(([fuelType, data]) => {
      const avgPrice = data.revenue / data.volume
      html += `
        <tr>
          <td>${fuelType}</td>
          <td>${data.volume.toFixed(2)}</td>
          <td>R$ ${data.revenue.toFixed(2)}</td>
          <td>${data.transactions}</td>
          <td>R$ ${avgPrice.toFixed(2)}</td>
        </tr>
      `
    })

    html += `
          </tbody>
        </table>
      </div>

      <div class="report-section">
        <h4>Performance por Funcionário</h4>
        <table class="report-table">
          <thead>
            <tr>
              <th>Funcionário</th>
              <th>Volume (L)</th>
              <th>Faturamento (R$)</th>
              <th>Transações</th>
            </tr>
          </thead>
          <tbody>
    `

    Object.entries(report.employeeBreakdown).forEach(([code, data]) => {
      html += `
        <tr>
          <td>${data.name} (${code})</td>
          <td>${data.volume.toFixed(2)}</td>
          <td>R$ ${data.revenue.toFixed(2)}</td>
          <td>${data.transactions}</td>
        </tr>
      `
    })

    html += `
          </tbody>
        </table>
      </div>

      <div class="report-section">
        <h4>Utilização por Bomba</h4>
        <table class="report-table">
          <thead>
            <tr>
              <th>Bomba</th>
              <th>Volume (L)</th>
              <th>Faturamento (R$)</th>
              <th>Transações</th>
            </tr>
          </thead>
          <tbody>
    `

    Object.entries(report.pumpBreakdown).forEach(([pumpId, data]) => {
      html += `
        <tr>
          <td>BOMBA ${pumpId.toString().padStart(2, "0")}</td>
          <td>${data.volume.toFixed(2)}</td>
          <td>R$ ${data.revenue.toFixed(2)}</td>
          <td>${data.transactions}</td>
        </tr>
      `
    })

    html += `
          </tbody>
        </table>
      </div>
    `

    container.innerHTML = html
  }

  exportReport() {
    const dateInput = document.getElementById("report-date")
    const selectedDate = new Date(dateInput.value + "T00:00:00")

    if (isNaN(selectedDate.getTime())) {
      this.uiManager.showNotification("Selecione uma data válida", "error")
      return
    }

    const report = this.dataManager.generateDailyReport(selectedDate)

    // Simular exportação (em um sistema real, geraria PDF ou Excel)
    const reportData = {
      date: selectedDate.toLocaleDateString("pt-BR"),
      summary: report.summary,
      fuelBreakdown: report.fuelBreakdown,
      employeeBreakdown: report.employeeBreakdown,
      pumpBreakdown: report.pumpBreakdown,
    }

    // Criar um blob com os dados JSON (simulação)
    const dataStr = JSON.stringify(reportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })

    // Criar link de download
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `relatorio-${selectedDate.toISOString().split("T")[0]}.json`

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)

    this.uiManager.showNotification("Relatório exportado com sucesso", "success")
  }
}

// Disponibilizar globalmente
window.ReportManager = ReportManager
