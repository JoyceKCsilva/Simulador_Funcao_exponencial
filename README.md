# Simulador de Pandemia

Interface interativa para comparar crescimento exponencial de casos com e sem mitigação (lockdown suave) usando React + Vite.

## Rodando

Instale dependências e inicie:

```
npm install
npm run dev
```

Acesse http://localhost:5173

## Parâmetros
- Casos iniciais
- Semanas totais (1 a 260)
- Taxa inicial R (0.1 a 5)
- Mitigação opcional:
  - Semana de início
  - Taxa final (<= taxa inicial)
  - Duração da transição

## Ideias de filtros / extensões futuras
- Variação estocástica da taxa (ruído gaussiano)
- Capacidade hospitalar limitando crescimento a partir de um limiar
- Vacinação reduzindo R em % semanal
- Re-lockdown quando R voltar a subir
- Exportar CSV dos dados
- Slider para velocidade da animação

## Licença
Uso livre educacional.
