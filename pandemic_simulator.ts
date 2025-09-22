export interface EstrategiaMitigacao {
    id: string;
    nome: string;
    descricao: string;
    multiplicador: number; // fator multiplicativo aplicado à taxa (ex: 0.9 reduz 10%)
}

export interface MitigacaoConfig {
    habilitada: boolean;
    semanaInicio: number;
    duracaoTransicao: number; // semanas para chegar ao efeito pleno
    estrategiasSelecionadas: string[]; // ids das estratégias
}

export interface SimulacaoParams {
    casosIniciais: number;
    semanasTotais: number;
    taxaInicial: number; // taxa sem mitigação
    mitigacao?: MitigacaoConfig;
    catalogoEstrategias?: EstrategiaMitigacao[]; // opcional (default interno)
}

export interface PontoSemana {
    semana: number;
    casos: number;
    taxa: number;
}

export interface ResultadoSimulacao {
    serieMitigada: PontoSemana[]; // com mitigação
    serieSemMitigacao: PontoSemana[]; // puramente exponencial
    totalCasosMitigado: number;
    totalCasosSemMitigacao: number;
    reducaoPercentual: number;
    taxaEquivalenteFinal?: number; // taxa que resulta após mitigação plena
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

const ESTRATEGIAS_DEFAULT: EstrategiaMitigacao[] = [
    { id: "distanciamento", nome: "Distanciamento Social", descricao: "Redução de contatos em ambientes públicos.", multiplicador: 0.9 },
    { id: "mascaras", nome: "Uso de Máscaras", descricao: "Barreira física reduzindo transmissão respiratória.", multiplicador: 0.95 },
    { id: "testagem", nome: "Testagem em Massa", descricao: "Isolamento rápido de casos positivos.", multiplicador: 0.85 },
    { id: "homeoffice", nome: "Home Office", descricao: "Menos deslocamentos e aglomerações.", multiplicador: 0.92 },
    { id: "eventos", nome: "Restrição de Eventos", descricao: "Evita super-spreading.", multiplicador: 0.9 },
    { id: "vacinas", nome: "Vacinação", descricao: "Imunidade reduzindo reprodução efetiva.", multiplicador: 0.8 },
];

export function calcularMultiplicadorEstrategias(ids: string[], catalogo: EstrategiaMitigacao[]): number {
    if (!ids.length) return 1;
    return ids.reduce((acc, id) => {
        const est = catalogo.find(e => e.id === id);
        return acc * (est ? est.multiplicador : 1);
    }, 1);
}

export function simularPandemia(params: SimulacaoParams): ResultadoSimulacao {
    const { casosIniciais, semanasTotais, taxaInicial } = params;
    const mitigacao = params.mitigacao;
    const catalogo = params.catalogoEstrategias ?? ESTRATEGIAS_DEFAULT;
    const serieSemMitigacao = simulaSerieSemMitigacao(casosIniciais, semanasTotais, taxaInicial);

    if (!mitigacao || !mitigacao.habilitada || mitigacao.estrategiasSelecionadas.length === 0) {
        const totalSem = serieSemMitigacao[serieSemMitigacao.length - 1].casos;
        return {
            serieMitigada: [...serieSemMitigacao],
            serieSemMitigacao,
            totalCasosMitigado: totalSem,
            totalCasosSemMitigacao: totalSem,
            reducaoPercentual: 0,
            taxaEquivalenteFinal: taxaInicial
        };
    }

    const { semanaInicio, duracaoTransicao, estrategiasSelecionadas } = mitigacao;
    const multiplicadorPleno = calcularMultiplicadorEstrategias(estrategiasSelecionadas, catalogo);
    const taxaFinalPlena = taxaInicial * multiplicadorPleno;

    const serieMitigada: PontoSemana[] = [];
    let casos = casosIniciais;
    for (let s = 1; s <= semanasTotais; s++) {
        let taxaSemana = taxaInicial;
        if (s >= semanaInicio) {
            if (duracaoTransicao <= 0) {
                taxaSemana = taxaFinalPlena;
            } else {
                const progresso = Math.min(1, (s - semanaInicio) / duracaoTransicao);
                // interpolação linear entre taxaInicial e taxaFinalPlena
                taxaSemana = taxaInicial - (taxaInicial - taxaFinalPlena) * progresso;
            }
        }
        serieMitigada.push({ semana: s, casos, taxa: taxaSemana });
        casos *= taxaSemana;
    }

    const totalMit = serieMitigada[serieMitigada.length - 1].casos;
    const totalSem = serieSemMitigacao[serieSemMitigacao.length - 1].casos;
    const reducaoPercentual = totalSem > 0 ? (1 - totalMit / totalSem) * 100 : 0;

    return {
        serieMitigada,
        serieSemMitigacao,
        totalCasosMitigado: totalMit,
        totalCasosSemMitigacao: totalSem,
        reducaoPercentual,
        taxaEquivalenteFinal: taxaFinalPlena
    };
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
