export interface FavoritoCData {
  idioma?: string;
  idUsr: string;
}

export interface FavoritoDto {
  idStoc: number;
  precio: number;
  marca: string;
  modelo: string;
  tipoVeh: string;
  vendido: string;
  potMot: number;
  kilom: number;
  vpGarVo: string;
  imagenBase64?: string | null;
}
export interface FavoritoDataAdd {
  idUsr: string;
  idStoc: string;
}
