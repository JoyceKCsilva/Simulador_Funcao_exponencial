import { EstrategiaMitigacao } from '../../pandemic_simulator';

export const ESTRATEGIAS: EstrategiaMitigacao[] = [
  { id: 'distanciamento', nome: 'Distanciamento Social', descricao: 'Reduz contatos em ambientes públicos.', multiplicador: 0.9 },
  { id: 'mascaras', nome: 'Uso de Máscaras', descricao: 'Barreira física a gotículas/aerossóis.', multiplicador: 0.95 },
  { id: 'testagem', nome: 'Testagem em Massa', descricao: 'Isola rapidamente infectados.', multiplicador: 0.85 },
  { id: 'homeoffice', nome: 'Home Office', descricao: 'Menos deslocamentos e escritórios lotados.', multiplicador: 0.92 },
  { id: 'eventos', nome: 'Restrição de Eventos', descricao: 'Evita super spreaders.', multiplicador: 0.9 },
  { id: 'vacinas', nome: 'Vacinação', descricao: 'Imunidade reduz transmissão efetiva.', multiplicador: 0.8 },
];
