export interface LockdownConfig {
    habilitado: boolean;
    semanaInicio: number; // semana em que inicia a mitigação
    taxaFinal: number;    // taxa pós-lockdown (R efetivo)
    duracaoTransicao: number; // semanas para transição suave
}

export interface SimulacaoParams {
    casosIniciais: number;
    semanasTotais: number;
    taxaInicial: number; // taxa sem mitigação
    lockdown?: LockdownConfig;
}

export interface PontoSemana {
    semana: number;
    casos: number;
    taxa: number;
}

export interface ResultadoSimulacao {
    serieMitigada: PontoSemana[]; // com lockdown (se habilitado) ou igual à sem mitigação
    serieSemMitigacao: PontoSemana[]; // puramente exponencial com taxaInicial
    totalCasosMitigado: number;
    totalCasosSemMitigacao: number;
    reducaoPercentual: number; // (1 - mitigado/sem)*100
}

function simulaSerieSemMitigacao(casosIniciais: number, semanas: number, taxa: number): PontoSemana[] {
    const serie: PontoSemana[] = [];
    let casos = casosIniciais;
    for (let s = 1; s <= semanas; s++) {
        serie.push({ semana: s, casos, taxa });
        casos *= taxa;
    }
    return serie;
}

export function simularPandemia(params: SimulacaoParams): ResultadoSimulacao {
    const { casosIniciais, semanasTotais, taxaInicial, lockdown } = params;
    const serieSemMitigacao = simulaSerieSemMitigacao(casosIniciais, semanasTotais, taxaInicial);

    // Se não há lockdown habilitado, resultado mitigado = sem mitigação
    if (!lockdown || !lockdown.habilitado) {
        const totalSem = serieSemMitigacao[serieSemMitigacao.length - 1].casos;
        return {
            serieMitigada: [...serieSemMitigacao],
            serieSemMitigacao,
            totalCasosMitigado: totalSem,
            totalCasosSemMitigacao: totalSem,
            reducaoPercentual: 0
        };
    }

    const { semanaInicio, taxaFinal, duracaoTransicao } = lockdown;
    const serieMitigada: PontoSemana[] = [];
    let casos = casosIniciais;
    for (let s = 1; s <= semanasTotais; s++) {
        // calcular taxa da semana
        let taxaSemana = taxaInicial;
        if (s >= semanaInicio) {
            if (duracaoTransicao <= 0) {
                taxaSemana = taxaFinal;
            } else {
                const progresso = Math.min(1, (s - semanaInicio) / duracaoTransicao);
                taxaSemana = taxaInicial - (taxaInicial - taxaFinal) * progresso;
            }
        }
        serieMitigada.push({ semana: s, casos, taxa: taxaSemana });
        casos *= taxaSemana;
    }

    const totalMit = serieMitigada[serieMitigada.length - 1].casos;
    const totalSem = serieSemMitigacao[serieSemMitigacao.length - 1].casos;
    const reducaoPercentual = totalSem > 0 ? (1 - totalMit / totalSem) * 100 : 0;

    return { serieMitigada, serieSemMitigacao, totalCasosMitigado: totalMit, totalCasosSemMitigacao: totalSem, reducaoPercentual };
}

// Pequeno helper para validar entradas (poderá ser usado na UI)
export function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
}

// Exemplo de uso (comentado para não executar automaticamente)
/*
const resultado = simularPandemia({
    casosIniciais: 1000,
    semanasTotais: 52,
    taxaInicial: 1.2,
    lockdown: {
        habilitado: true,
        semanaInicio: 20,
        taxaFinal: 0.8,
        duracaoTransicao: 20
    }
});
console.log(resultado);
*/
