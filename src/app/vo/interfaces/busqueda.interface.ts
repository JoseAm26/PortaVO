export interface BusquedaDto {
  numBusqueda: string;
  nombre: string;
  idioma: string;
  anioDesde: string;
  anioHasta: string;
  potDesde: string;
  potHasta: string;
  kmsDesde: string;
  kmsHasta: string;
  precioDesde: string;
  precioHasta: string;

  tipos: string[];
  marcas: string[];
  modelos: string[];
  emisiones: string[];
  emisionesD: string[];
  cfgEjes: string[];
  cabinas: string[];
  carroceria: string[];
}

export interface BusquedaDData {
  idUsr: string;
  idBusq: string;
}

export interface BusquedaData {
  idUsr: string;
  idioma: string;
  nombreConsulta: string;

  tipos: string[];

  marcas: string[];

  modelos: string[];

  anioDesde: string;

  anioHasta: string;

  potDesde: string;

  potHasta: string;

  emisiones: string[];

  cfgEjes: string[];

  cabinas: string[];

  carroceria: string[];

  kmsDesde: string;

  kmsHasta: string;

  precioDesde: string;

  precioHasta: string;
}
