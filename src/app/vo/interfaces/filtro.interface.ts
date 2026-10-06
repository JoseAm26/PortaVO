export interface FiltroData {
  idioma: string;
}

export interface FiltroDto {
  maxPot: number[];
  minAnio: number[];

  tipoVeh: string[];

  codMarca: string[];
  desMarca: string[];

  codModelo: string[];
  desModelo: string[];

  codCabina: string[];
  desCabina: string[];

  codEje: string[];
  desEje: string[];

  codEuroNorma: string[];
  desEuroNorma: string[];

  codCarro: string[];
  desCarro: string[];
}
