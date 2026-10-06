export interface VehiculoData {

  idioma?: string;

  marca?: string[];
  modelo?: string[];
  tipo?: string[];

  potDesde?: number;
  potHasta?: number;

  anioDesde?: number;
  anioHasta?: number;

  precioDesde?: number;
  precioHasta?: number;

  cabina?: string[];
  confEjes?: string[];

  sucursal?: string;

  kmsDesde?: number;
  kmsHasta?: number;

  euronorma?: string[];
  carroceria?: string[];

  orden?: string;
}

export interface VehiculoDto {

  idStoc: string;

  marca: string;
  modelo: string;
  tipoVeh: string;

  chasis: string;

  potMot: number;
  kilom: number;

  euronorma: string;
  fechaMat: string;

  precio: number;

  cabina: string;
  confEjes: string;

  garantia: string;
  adr: string;
  frenoAux: string;

  imagenBase64?: string | null;
  esFavorito?: boolean;
}

export interface VehiculoComparativa {
  idStock: string;
  marca?: string;
  modelo?: string;
  kilometros?: number;
  adr?: boolean;
  precio?: number;
  tipoCaja?: string;
  numVelocidades?: number;
  equipoFrio?: boolean;
  termografo?: boolean | null;
  imagenUrl?: string;
}
