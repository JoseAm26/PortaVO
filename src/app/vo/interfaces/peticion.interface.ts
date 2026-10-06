export interface PeticionData {
  id: number;
  idUsr: number;
  fecha?: Date | null;
  tipoVehiculo: string;
  marca: string;
  modelo: string;
  cabina?: string;
  carroceria: string;
}
