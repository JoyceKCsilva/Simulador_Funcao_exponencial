# Simulador de Pandemia

Interface interativa para comparar crescimento exponencial de casos com e sem mitigação usando combinações de estratégias (mitigação em camadas) em React + Vite.

## Rodando

Instale dependências e inicie:

```
npm install
npm run dev
```

Acesse http://localhost:5173

## Fluxo
1. Tela inicial: escolha um preset rápido (sem, leve, forte) ou selecione manualmente estratégias.
2. Tela principal: ajuste parâmetros, marque/desmarque estratégias e observe a evolução das curvas.

## Parâmetros
- Casos iniciais (default 100)
- Semanas totais (default 20 / limite 260)
- Taxa inicial R (default 1.2)
- Mitigação (opcional):
  - Semana de início (default 12)
  - Duração da transição (default 6) – semanas até efeito pleno
  - Estratégias múltiplas (checkbox) com efeito multiplicativo

Exemplo de cálculo: R_efetivo = R_inicial * m1 * m2 * ... * mn (após transição)

## Presets
- Sem Mitigação: nenhuma medida aplicada
- Mitigação Leve: Distanciamento + Máscaras
- Mitigação Forte: Distanciamento + Máscaras + Testagem + Vacinação

## Estratégias incluídas (multiplicadores)
- Distanciamento Social (×0.90)
- Uso de Máscaras (×0.95)
- Testagem em Massa (×0.85)
- Home Office (×0.92)
- Restrição de Eventos (×0.90)
- Vacinação (×0.80)

Combinar medidas reduz a taxa efetiva gradualmente após a semana de início (interpolação linear durante a transição).

## Ideias de extensões futuras
- Variação estocástica da taxa (ruído gaussiano)
- Capacidade hospitalar limitando crescimento a partir de um limiar
- Vacinação progressiva com crescimento cumulativo da cobertura
- Reaplicação automática de medidas se R subir
- Exportar CSV/JSON das séries
- Escala log no eixo Y
- Modo Monte Carlo (intervalo de confiança)

## Licença
Uso livre educacional.
