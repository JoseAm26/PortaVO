import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComparadorService {
  vehiculosComparador = signal<string[]>([]);
  tipoActual = signal<string | null>(null);

  // --- MÉTODOS DE LECTURA / CONSULTA ---

  // Obtener la lista actual de IDs
  getVehiculos(): string[] {
    return this.vehiculosComparador();
  }

  // Obtener la cantidad de vehículos
  get TotalVehiculos(): number {
    return this.vehiculosComparador().length;
  }

  // Comprobar si un vehículo ya está en el comparador
  isEnComparador(idStoc: string): boolean {
    return this.vehiculosComparador().includes(idStoc);
  }

  // Limpiar toda la lista
  limpiar(): void {
    this.vehiculosComparador.set([]);
    this.tipoActual.set(null);
  }

  // --- MÉTODOS DE MODIFICACIÓN (Tus métodos existentes) ---
  addVehiculo(idStoc: string, tipoVeh: string): 'OK' | 'TIPO' | 'MAXIMO' {

    const listaActual = this.vehiculosComparador();
    const tipo = this.tipoActual();

    if (listaActual.length > 0 && tipo !== tipoVeh) {
      return 'TIPO';
    }


    if (listaActual.includes(idStoc)) {
      return 'OK';
    }

    if (listaActual.length >= 2) {
      return 'MAXIMO';
    }

    this.tipoActual.set(tipoVeh);
    this.vehiculosComparador.set([...listaActual, idStoc]);

    return 'OK';
  }

  removeVehiculo(idStoc: string): void {
    const nuevaLista = this.vehiculosComparador().filter(id => id !== idStoc);
    this.vehiculosComparador.set(nuevaLista);

    // Si quitamos todos los vehículos, liberamos el tipo asignado
    if (nuevaLista.length === 0) {
      this.tipoActual.set(null);
    }
  }

  get ComparadorLleno(): boolean {
    return this.vehiculosComparador().length >= 2;
  }

}
