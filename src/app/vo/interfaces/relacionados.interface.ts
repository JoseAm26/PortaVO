export interface RelacionadoData {
  idioma?: string;
  marca: string;
  tipo: string;
  idStk: string;
  idStksR: string;
}

export interface RelacionadoDto {

  idStoc: number;

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

}
