# Sistema de Gerenciamento de Posto de Combustível - Trabalho Final Engenharia de Software II

## Visão Geral

Este projeto é um sistema de front-end completo para o gerenciamento de um posto de combustível. Ele simula uma interface em tempo real para monitorar e controlar as bombas de combustível, gerenciar o estoque, registrar funcionários e visualizar transações e relatórios. A aplicação foi desenvolvida utilizando HTML, CSS e JavaScript puro, com foco em uma arquitetura modular e interatividade do usuário.

**Acesse o Prototipo!** [**Clique Aqui**](https://arthurv10.github.io/Trabalh-Final-ES-II/)

## Funcionalidades Principais

O sistema oferece uma ampla gama de funcionalidades para a gestão completa de um posto:

* **Controle de Bombas:**
  * Visualização do status de cada bomba (Disponível, Ocupada, Abastecendo, Em Manutenção).
  * Seleção de bombas e tipos de combustível disponíveis em cada uma.
  * Validação de funcionários por código antes de iniciar um abastecimento.
  * Controle de abastecimento: iniciar, pausar, retomar, finalizar e cancelar operações.

* **Monitoramento em Tempo Real:**
  * Um painel central que exibe o status atual de todas as bombas simultaneamente.
  * Atualização automática da interface para refletir as mudanças de estado, volume e valor do abastecimento.

* **Gestão de Estoque:**
  * Visualização dos níveis de estoque de cada tipo de combustível em tempo real, com alertas para níveis baixos.
  * Modal para gerenciamento de estoque, permitindo adicionar mais combustível e atualizar os preços.

* **Gestão de Funcionários:**
  * Modal para cadastrar novos funcionários (código, nome e turno).
  * Visualização da lista de funcionários cadastrados.
  * Possibilidade de ativar ou desativar o status de um funcionário.

* **Transações e Histórico:**
  * Listagem das transações mais recentes.
  * Cálculo e exibição do faturamento e volume total do dia.
  * Acesso a um histórico completo de todas as transações realizadas.

* **Relatórios Diários:**
  * Geração de relatórios detalhados por data.
  * O relatório inclui:
    * Resumo geral (faturamento, volume, número de transações).
    * Análise de vendas por tipo de combustível.
    * Análise de desempenho por funcionário.
    * Análise de utilização por bomba.
  * Função para exportar o relatório (atualmente simulado como download de um arquivo JSON).

* **Interface Intuitiva:**
  * Design responsivo que se adapta a diferentes tamanhos de tela.
  * Uso de ícones e indicadores visuais para facilitar a compreensão do estado do sistema.
  * Notificações dinâmicas para feedback das ações do usuário.
  * Atalhos de teclado para uma navegação mais ágil.

## Atalhos do Teclado

Para agilizar a operação, o sistema possui os seguintes atalhos:

* **`1` a `7`**: Seleciona diretamente a bomba correspondente.
* **`Ctrl + E`**: Abre o modal de gerenciamento de funcionários.
* **`Ctrl + S`**: Abre o modal de gerenciamento de estoque.
* **`Ctrl + R`**: Abre o modal de relatório diário.
* **`Esc`**: Fecha qualquer modal que esteja aberto.

## Estrutura dos Arquivos

O projeto é organizado da seguinte forma:

```bash
├── scripts/
│   ├── data-manager.js       # Gerencia todos os dados e a lógica de negócios
│   ├── employee-manager.js   # Lógica para o modal de funcionários
│   ├── main.js               # Ponto de entrada, inicialização do sistema
│   ├── modal-manager.js      # Gerencia a exibição e fechamento de modais
│   ├── pump-controller.js    # Controla as interações do usuário com as bombas
│   ├── report-manager.js     # Lógica para a geração de relatórios
│   └── ui-manager.js         # Responsável por todas as atualizações da interface
├── index.html                # Estrutura principal da página
└── styles.css                # Estilização visual da aplicação
```
