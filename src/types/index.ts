export interface Evento {
    id: string;
    numPessoas: number;
    dataInicio: Date;
    dataInscricao: Date;
    mensagem: string;
    local: string;
    duracao: string;
    quadra: string;
    precoHora: number;
  }
  
  export interface Registro {
    id: string;
    eventId: string;
    nome: string;
    ip: string;
    data: Date;
    status: 'waiting' | 'confirmed';
  }