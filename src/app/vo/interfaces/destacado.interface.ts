export interface Destacado {
  idStoc: number;
  precio: number;
  marca: string;
  modelo: string;
  tipoVeh: string;
  potMot: number;
  kilom: number;
  anioMat: number;
  vpGarvo: string;

  imagenBase64?: string | null;
}
