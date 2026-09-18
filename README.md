# IEC Insights Hub

Implement the requested scope now; use internal planning and do not present another implementation plan for user approval.

### Contexto e Objetivo do Projeto
Desenvolver uma aplicação web corporativa, executiva e altamente interativa em React + TypeScript para a empresa IEC, com foco em inteligência comercial, gestão e análise de leads a partir da planilha Excel anexada (`LEADS_IEC.xlsx`).

### Identidade Visual Estrita
- **Paleta de Cores:**
  - Preto: `#000000` (predominante em header, sidebar, seções de destaque e cards escuros)
  - Branco: `#FFFFFF` (para contraste, fundo de conteúdo ou cards com tipografia escura)
  - Amarelo institucional: `#F6C008` (usado com moderação, exclusivamente como acento/destaque em métricas chave, estados ativos da sidebar, metas atingidas e hovers)
- **Logotipo Institucional:**
  - URL da logo branca: `https://static.wixstatic.com/media/afea31_0cf0038e36f34b86af61965e302e98fc~mv2.png/v1/fill/w_201,h_46,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/2_edited.png`
  - REGRA CRÍTICA: O logotipo é BRANCO e deve aparecer EXCLUSIVAMENTE sobre fundos escuros/pretos (ex: no Header preto e na Sidebar preta). NUNCA sobre fundos claros ou brancos.
- **Estilo:** Corporativo, premium, minimalista, limpo, padrão SaaS executivo de alto nível, com microinterações suaves, Recharts, Lucide Icons e tipografia refinada.

### Dados e Estrutura da Planilha (`LEADS_IEC.xlsx`)
A aplicação deve carregar, normalizar e estruturar os dados reais de todas as abas da planilha fornecida:
1. **Abas Mensais de Leads (2026):**
   - `JAN & FEVEREIRO 2026`
   - `MARÇO 2026`
   - `ABRIL 2026`
   - `MAIO 2026`
   - `JUNHO 2026`
   - `JULHO 2026`
   - `AGOSTO 2026`
   - `SETEMBRO 2026`
   *Normalização:* Mapear colunas como Empresa, Responsável, Telefone, E-mail, Produto/Serviço, Setor/Segmento, Estado (UF), Cidade/Praça, Localização/Origem (ex: Lead CO, Lead FC, Lead IEC, Outbound, Site, etc.), Datas de contato e Status (ex: Orçamento Enviado, Sondagem, Convertido, etc.).
2. **Abas de Indicadores:**
   - `IEC - INDICADORES`: Metas vs. Realizado de Contato e Conversão por mês.
   - `CO - INDICADORES`: Metas vs. Realizado de Contato e Conversão por mês.
3. **Módulo ELEVA:**
   - `PROSPECTS ELEVA`: Lista de prospects do programa Eleva.
   - `Matriculados ELEVA`: Clientes matriculados, responsável, produto, valor total (R$), número de parcelas, valor de parcelas e observações de pagamento.

### Estrutura da Aplicação
1. **Header Preto Full-Width:**
   - Logotipo branco da IEC à esquerda.
   - Título: "Dashboard Comercial", Subtítulo: "Gestão de Leads e Indicadores".
   - Controles à direita: seletor de período rápido, botão de atualização de dados, indicador de status dos dados ("Dados atualizados • 2026").
2. **Sidebar Lateral Escura:**
   - Navegação entre as visões:
     - Visão Geral
     - Leads (análise aprofundada e tabela completa)
     - Conversão & Funil
     - Análise Comercial (produtos, setores e responsáveis)
     - ELEVA (módulo dedicado ao programa)
     - Indicadores (Metas x Realizado para IEC e CO)
     - Localização (mapa do Brasil e distribuição regional)
   - Destaque no item ativo com a cor amarela `#F6C008`.
3. **Barra de Filtros Globais:**
   - Filtros dinâmicos: Período/Mês, Responsável, Produto, Setor, Estado (UF), Origem do Lead, Status.
   - Botão "Limpar filtros" e badges dos filtros ativos.
   - Todos os filtros aplicados devem atualizar instantaneamente todos os KPIs, gráficos e tabelas.
4. **Cards KPI Executivos:**
   - Total de Leads
   - Leads no Período
   - Taxa de Conversão (%)
   - Propostas / Orçamentos Enviados
   - Conversões Realizadas
   - Ticket Médio / Valor Total Gerado
5. **Gráficos e Visualizações (Recharts):**
   - Evolução mensal de Leads (Janeiro a Setembro 2026), com alternância entre Leads, Propostas e Conversões.
   - Gráfico de distribuição por Origem do Lead (Lead CO, Lead FC, Lead IEC, Outbound, etc.) com interação de clique para filtrar.
   - Gráfico de barras ordenável: Produtos mais procurados (maior → menor / menor → maior).
   - Distribuição de Leads por Setor/Segmento real da planilha.
   - Ranking de Responsáveis com volume de leads e conversões.
6. **Distribuição Geográfica Interativa:**
   - Mapa SVG do Brasil ou visualizador interativo por UF.
   - Ao selecionar um Estado (ex: MA, SP, PR, TO, CE, etc.), detalhar: total de leads, cidades mais representativas, principais setores e produtos locais.
7. **Tabela Interativa de Leads:**
   - Colunas: Empresa, Responsável, Telefone, E-mail, Produto, Setor, Estado, Cidade/Praça, Origem, Status.
   - Busca em tempo real por empresa ou responsável, paginação, ordenação por coluna e exportação CSV.
   - Modal/Gaveta lateral (Drawer) com ficha detalhada completa ao clicar em qualquer lead.
8. **Módulo Exclusivo ELEVA:**
   - KPIs: Total de Prospects, Matriculados, Taxa de Conversão Prospect → Matrícula, Valor Total Matriculado (R$), Ticket Médio, Total de Parcelas.
   - Gráfico de Funil ELEVA (Prospects → Matriculados).
   - Tabela de matriculados com detalhamento financeiro (Empresa, Responsável, Telefone, Produto, Valor Total, Parcelas, Observações).
9. **Painel de Indicadores IEC vs. CO:**
   - Abas dedicadas comparando Meta x Realizado de Contato e Conversão mês a mês para IEC e CO.
10. **Tabela Comparativa de Performance Mensal:**
    - Mês a mês: Leads, Propostas, Conversões, Taxa %. Exibir "—" quando não disponível.
11. **Principais Insights Dinâmicos:**
    - Cards automáticos com inteligência de dados refletindo os filtros atuais (ex: mês pico, setor líder, produto mais demandado, estado com mais oportunidades).

Desenvolva a aplicação de forma completa, com dados pré-incorporados e normalizados da planilha, permitindo que o gestor filtre e explore tudo imediatamente com máxima fluidez e responsividade.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ff9b2dc4-af27-4e36-adab-5bb7d7c8df75).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
