//modelos
export interface Prestador {
  especialidadNom: string;
  prestadorCod: number;
  prestadorNom: string;
}

export interface Especialidades {
  codigo: number;
  nombre: string;
}

export interface Usuario {
  usuario: string;
  password: string;
  token: string;
  codigo: number;
  especialidadNom: string;
  nombreCompleto: string;
  nombreUsuario: string;
  prestadorCod: number;
  prestadorNom: string;
  prestadores: Prestador[];
  rol?: string;
}

export interface Turno {
  codigo: number;
  fecha: string;
  hora: string;
  paciente: number;
  equipoCod: number;
  equipoNom: string;
  prestadorCod: number;
  prestadorNom: string;
  estudio: number;
  estudioNom: string;
  dioTurno: number;
  mutual: number;
  mutualNom: string;
  aCancelar: boolean;
  especialidad: number;
  especialidadNom: string;
  libre: boolean;
  pacienteNom: string;
  pacienteDocumento: number;
  asistio: number;
  atendido: boolean;
  atendioFecha: string;
  atendioHora: string;
  atendidoHora: string;
  observaciones: string;
}

//Peticiones
export type usePeticion<AxiosResponse> = {
  cargando: boolean;
  error: ErrorCallback | null;
  response: AxiosResponse | null;
};

//Funcionalidades
export interface DesplegableModel {
  codigo: number;
  text: string;
  nota?: string;
}

export interface Notificacion {
  mostrar: boolean;
  mensaje: string;
  color: string;
}
