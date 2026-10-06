import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VoService } from '../../services/vo.service';
import { Destacado } from '../../interfaces/destacado.interface';
import { DestacadasComponent } from '../../components/destacadas.component/destacadas.component';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// 2. Importa los iconos necesarios
import {
  faMagnifyingGlass,
  faShieldHalved,
  faTruckFast,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';

interface ModeloItem {
  codigo: string;
  nombre: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, DestacadasComponent, TranslatePipe, FontAwesomeModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export default class HomeComponent implements OnInit {

  faMagnifyingGlass = faMagnifyingGlass;
  faShieldHalved = faShieldHalved;
  faTruckFast = faTruckFast;
  faArrowRight = faArrowRight;

  private voService = inject(VoService);
  private router = inject(Router);

  filtros = signal({
    marca: '', // Guardará el código de la marca seleccionada (ej: "01", "26")
    modelo: '',
    anio: '',
    km: '',
    precio: '',
    ubicacion: ''
  });

  marcas = signal<{ codigo: string; nombre: string }[]>([]);
  tiposVehiculo = signal<{ nombre: string }[]>([]);

  // Almacenamos todos los modelos con su código
  private modelosCompletos = signal<ModeloItem[]>([]);

  // Computed que se recalcula automáticamente según si hay una marca seleccionada en el filtro
  modelos = computed<string[]>(() => {
    const marcaSeleccionada = this.filtros().marca;
    const todos = this.modelosCompletos();

    if (!marcaSeleccionada) {
      return todos.map(m => m.nombre);
    }

    // Filtramos los modelos cuyo código comience por el código de la marca
    return todos
      .filter(m => m.codigo.startsWith(marcaSeleccionada))
      .map(m => m.nombre);
  });

  ngOnInit(): void {
    this.cargarFiltros();
  }

  actualizarFiltro(propiedad: string, valor: any) {
    this.filtros.update(estado => {
      const nuevoEstado = {
        ...estado,
        [propiedad]: valor
      };

      // Si se cambia la marca, se resetea la selección de modelo previa
      if (propiedad === 'marca') {
        nuevoEstado.modelo = '';
      }

      return nuevoEstado;
    });
  }

  buscar() {
    // Si la marca tiene un código, buscamos el nombre equivalente para pasar a la ruta o pasamos directamente los filtros
    const marcaObj = this.marcas().find(m => m.codigo === this.filtros().marca);

    this.router.navigate(['/buscador'], {
      queryParams: {
        marca: marcaObj ? marcaObj.nombre : '',
        modelo: this.filtros().modelo,
        anio: this.filtros().anio,
        km: this.filtros().km
      }
    });
  }

  private cargarFiltros(): void {
    this.voService.getFiltros().subscribe({
      next: (filtros) => {
        this.marcas.set(
          filtros.desMarca.map((nombre, index) => ({
            codigo: filtros.codMarca[index],
            nombre
          }))
        );

        this.tiposVehiculo.set(
          filtros.tipoVeh.map(tipo => ({
            nombre: tipo
          }))
        );

        // Guardamos los modelos cruzando codModelo con desModelo
        this.modelosCompletos.set(
          filtros.desModelo.map((nombre, index) => ({
            codigo: filtros.codModelo[index],
            nombre
          }))
        );
      },
      error: err => {
        console.error(err);
      }
    });
  }
}
