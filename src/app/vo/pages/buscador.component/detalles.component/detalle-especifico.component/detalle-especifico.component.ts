import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { FichaDto } from '../../../../interfaces/detalles.interface';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

// Importación de todos los iconos requeridos en la clase
import {
  faListCheck,
  faTruckFront,
  faChevronDown,
  faCheck,
  faXmark,
  faCircleInfo,
  faCouch,
  faTruckMoving,
  faWeightHanging,
  faCircleDot,
  faArrowsUpDown,
  faCircleStop,
  faGasPump,
  faBoxArchive,
  faSliders
} from '@fortawesome/free-solid-svg-icons';

type TipoVehiculoDetalle = 'tractora' | 'rigido' | 'semirremolque' | 'otro';

type TipoCampoDetalle =
  | 'texto'
  | 'boolean'
  | 'numero'
  | 'fechaYear'
  | 'precio'
  | 'medidaInterior'
  | 'ebs'
  | 'abs';

interface CampoDetalle {
  label: string;
  tipo: TipoCampoDetalle;
  campos?: string[];
  sufijo?: string;
  permitirCero?: boolean;
}

interface GrupoDetalle {
  titulo: string;
  icono: string;
  campos: CampoDetalle[];
}

@Component({
  selector: 'app-detalle-especifico',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './detalle-especifico.component.html',
  styleUrl: './detalle-especifico.component.scss'
})
export class DetalleEspecificoComponent {

  // Iconos fijos para el HTML
  faListCheck = faListCheck;
  faTruckFront = faTruckFront;
  faChevronDown = faChevronDown;
  faCheck = faCheck;
  faXmark = faXmark;

  // Mapa para resolver las cadenas de icono definidas en las fichas
  private mapaIconos: Record<string, IconDefinition> = {
    'fa-solid fa-circle-info': faCircleInfo,
    'fa-solid fa-couch': faCouch,
    'fa-solid fa-truck-axle': faTruckMoving,
    'fa-solid fa-weight-hanging': faWeightHanging,
    'fa-solid fa-circle-dot': faCircleDot,
    'fa-solid fa-arrows-up-down': faArrowsUpDown,
    'fa-solid fa-circle-stop': faCircleStop,
    'fa-solid fa-gas-pump': faGasPump,
    'fa-solid fa-box-archive': faBoxArchive,
    'fa-solid fa-sliders': faSliders
  };

  /**
   * Mapea el string almacenado en grupo.icono al objeto IconDefinition de FontAwesome.
   */
  getIconoGrupo(claseIcono: string): IconDefinition {
    return this.mapaIconos[claseIcono] || faCircleInfo;
  }

  vehiculo = input.required<FichaDto>();

  tipoVehiculoDetalle = computed<TipoVehiculoDetalle>(() => {
    const v = this.vehiculo();

    const tipo = this.normalizarTexto(
      v.tipoVeh || v.vhTipVeh || ''
    );

    if (
      tipo.includes('tractora') ||
      tipo.includes('cabeza tractora')
    ) {
      return 'tractora';
    }

    if (
      tipo.includes('rigido') ||
      tipo.includes('camion rigido') ||
      tipo.includes('vehiculo rigido')
    ) {
      return 'rigido';
    }

    if (
      tipo.includes('semirremolque') ||
      tipo.includes('semi remolque') ||
      tipo.includes('semi-remolque') ||
      tipo.includes('semiremolque')
    ) {
      return 'semirremolque';
    }

    return 'otro';
  });

  detallesEspecificos = computed<GrupoDetalle[]>(() => {
    const tipo = this.tipoVehiculoDetalle();

    switch (tipo) {
      case 'tractora':
        return this.detallesTractora();

      case 'rigido':
        return this.detallesRigido();

      case 'semirremolque':
        return this.detallesSemirremolque();

      default:
        return [];
    }
  });

  mostrarDetallesEspecificos = computed<boolean>(() => {
    return this.detallesEspecificos().length > 0;
  });

  tituloTipo = computed<string>(() => {
    const tipo = this.tipoVehiculoDetalle();

    switch (tipo) {
      case 'tractora':
        return 'tractora';

      case 'rigido':
        return 'rígido';

      case 'semirremolque':
        return 'semirremolque';

      default:
        return '';
    }
  });

  private detallesTractora(): GrupoDetalle[] {
    return [
      this.grupoEspecificacionesGeneralesCompleta(),
      this.grupoCabina(),
      this.grupoEjesCompleto(),
      this.grupoCargaCompleta(),
      this.grupoNeumaticosCompleto(),
      this.grupoSuspension(),
      this.grupoFrenosCompleto(),
      this.grupoCombustible(),
      this.grupoOtrosTractora()
    ];
  }

  private detallesRigido(): GrupoDetalle[] {
    return [
      this.grupoEspecificacionesGeneralesCompleta(),
      this.grupoCabina(),
      this.grupoEjesCompleto(),
      this.grupoCargaCompleta(),
      this.grupoNeumaticosCompleto(),
      this.grupoSuspension(),
      this.grupoFrenosCompleto(),
      this.grupoCombustible(),
      this.grupoCarroceriaRigido(),
      this.grupoOtrosRigido()
    ];
  }

  private detallesSemirremolque(): GrupoDetalle[] {
    return [
      this.grupoEspecificacionesGeneralesSemi(),
      this.grupoEjesSemi(),
      this.grupoCargaSemi(),
      this.grupoNeumaticosSemi(),
      this.grupoFrenosSemi(),
      this.grupoCarroceriaSemi(),
      this.grupoOtrosSemi()
    ];
  }

  private grupoEspecificacionesGeneralesCompleta(): GrupoDetalle {
    return {
      titulo: 'Especificaciones generales',
      icono: 'fa-solid fa-circle-info',
      campos: [
        { label: 'Marca', tipo: 'texto', campos: ['marca'] },
        { label: 'Modelo', tipo: 'texto', campos: ['modelo'] },
        { label: 'Tipo', tipo: 'texto', campos: ['tipoVeh', 'vhTipVeh'] },
        { label: 'Motor', tipo: 'texto', campos: ['motor'] },
        { label: 'Potencia', tipo: 'texto', campos: ['potMot'], sufijo: 'CV' },
        { label: 'Km', tipo: 'numero', campos: ['kilom'], sufijo: 'km' },
        { label: 'Euronorma', tipo: 'texto', campos: ['euronorma'] },
        { label: 'Año primera matriculación', tipo: 'fechaYear', campos: ['fecMat'] },
        { label: 'ADR', tipo: 'boolean', campos: ['adr'] },
        { label: 'Precio', tipo: 'precio', campos: ['precio'] },
        { label: 'Referencia Veinsur', tipo: 'texto', campos: ['idStoc'] }
      ]
    };
  }

  private grupoEspecificacionesGeneralesSemi(): GrupoDetalle {
    return {
      titulo: 'Especificaciones generales',
      icono: 'fa-solid fa-circle-info',
      campos: [
        { label: 'Marca', tipo: 'texto', campos: ['marca'] },
        { label: 'Modelo', tipo: 'texto', campos: ['modelo'] },
        { label: 'Tipo', tipo: 'texto', campos: ['tipoVeh', 'vhTipVeh'] },
        { label: 'Euronorma', tipo: 'texto', campos: ['euronorma'] },
        { label: 'Año primera matriculación', tipo: 'fechaYear', campos: ['fecMat'] },
        { label: 'ADR', tipo: 'boolean', campos: ['adr'] },
        { label: 'Precio', tipo: 'precio', campos: ['precio'] },
        { label: 'Referencia Veinsur', tipo: 'texto', campos: ['idStoc'] }
      ]
    };
  }

  private grupoCabina(): GrupoDetalle {
    return {
      titulo: 'Cabina',
      icono: 'fa-solid fa-couch',
      campos: [
        { label: 'Cabina', tipo: 'texto', campos: ['cabina'] },
        { label: 'Nº literas', tipo: 'texto', campos: ['literas'], permitirCero: true },
        { label: 'Color', tipo: 'texto', campos: ['color'] },
        { label: 'Spoiler', tipo: 'boolean', campos: ['spoiler'] }
      ]
    };
  }

  private grupoEjesCompleto(): GrupoDetalle {
    return {
      titulo: 'Ejes',
      icono: 'fa-solid fa-truck-axle',
      campos: [
        { label: 'Distancia entre ejes', tipo: 'texto', campos: ['disEje'], sufijo: 'mm' },
        { label: 'Eje elevable', tipo: 'boolean', campos: ['ejeEle'] },
        { label: 'Eje trasero direccional', tipo: 'boolean', campos: ['ejtDir'] }
      ]
    };
  }

  private grupoEjesSemi(): GrupoDetalle {
    return {
      titulo: 'Ejes',
      icono: 'fa-solid fa-truck-axle',
      campos: [
        { label: 'Eje elevable', tipo: 'boolean', campos: ['ejeEle'] },
        { label: 'Eje trasero direccional', tipo: 'boolean', campos: ['ejtDir'] }
      ]
    };
  }

  private grupoCargaCompleta(): GrupoDetalle {
    return {
      titulo: 'Carga',
      icono: 'fa-solid fa-weight-hanging',
      campos: [
        { label: 'Masa máxima autorizada', tipo: 'numero', campos: ['mma'], sufijo: 'kg' },
        { label: 'MMA eje D', tipo: 'numero', campos: ['mmaEjd'], sufijo: 'kg' },
        { label: 'Tara', tipo: 'numero', campos: ['tara'], sufijo: 'kg' }
      ]
    };
  }

  private grupoCargaSemi(): GrupoDetalle {
    return {
      titulo: 'Carga',
      icono: 'fa-solid fa-weight-hanging',
      campos: [
        { label: 'Masa máxima autorizada', tipo: 'numero', campos: ['mma'], sufijo: 'kg' },
        { label: 'Tara', tipo: 'numero', campos: ['tara'], sufijo: 'kg' }
      ]
    };
  }

  private grupoNeumaticosCompleto(): GrupoDetalle {
    return {
      titulo: 'Neumáticos',
      icono: 'fa-solid fa-circle-dot',
      campos: [
        {
          label: 'Marca de neumáticos',
          tipo: 'texto',
          campos: [
            'marcaNeu',
            'marcaNeumatico',
            'marcaNeumaticos',
            'neuMarca',
            'marNeu',
            'llantas'
          ]
        },
        {
          label: 'Modelo de neumáticos',
          tipo: 'texto',
          campos: [
            'modeloNeu',
            'modeloNeumatico',
            'modeloNeumaticos',
            'neuModelo',
            'modNeu'
          ]
        },
        {
          label: 'Medida de neumáticos',
          tipo: 'texto',
          campos: [
            'medidaNeu',
            'medidaNeumatico',
            'medidaNeumaticos',
            'neuMedida',
            'medNeu',
            'neumaticos'
          ]
        }
      ]
    };
  }

  private grupoNeumaticosSemi(): GrupoDetalle {
    return {
      titulo: 'Neumáticos',
      icono: 'fa-solid fa-circle-dot',
      campos: [
        {
          label: 'Modelo de neumáticos',
          tipo: 'texto',
          campos: [
            'modeloNeu',
            'modeloNeumatico',
            'modeloNeumaticos',
            'neuModelo',
            'modNeu',
            'llantas'
          ]
        }
      ]
    };
  }

  private grupoSuspension(): GrupoDetalle {
    return {
      titulo: 'Suspensión',
      icono: 'fa-solid fa-arrows-up-down',
      campos: [
        { label: 'Tipo de suspensión', tipo: 'texto', campos: ['susDel'] },
        { label: 'Tipo de suspensión trasera', tipo: 'texto', campos: ['susTra'] }
      ]
    };
  }

  private grupoFrenosCompleto(): GrupoDetalle {
    return {
      titulo: 'Frenos',
      icono: 'fa-solid fa-circle-stop',
      campos: [
        { label: 'Freno auxiliar', tipo: 'texto', campos: ['frenoAux'] },
        { label: 'Tipo de freno principal', tipo: 'texto', campos: ['frenoPri'] },
        { label: 'EBS', tipo: 'ebs', campos: ['ebs'] },
        { label: 'ABS', tipo: 'abs', campos: ['ebs'] }
      ]
    };
  }

  private grupoFrenosSemi(): GrupoDetalle {
    return {
      titulo: 'Frenos',
      icono: 'fa-solid fa-circle-stop',
      campos: [
        { label: 'Tipo de freno principal', tipo: 'texto', campos: ['frenoPri'] },
        { label: 'EBS', tipo: 'ebs', campos: ['ebs'] },
        { label: 'ABS', tipo: 'abs', campos: ['ebs'] }
      ]
    };
  }

  private grupoCombustible(): GrupoDetalle {
    return {
      titulo: 'Combustible',
      icono: 'fa-solid fa-gas-pump',
      campos: [
        { label: 'Nº depósitos de combustible', tipo: 'texto', campos: ['numDep'] },
        { label: 'Capacidad combustible', tipo: 'texto', campos: ['depCom'], sufijo: 'L' },
        { label: 'Capacidad AdBlue', tipo: 'texto', campos: ['adblue'], sufijo: 'L' }
      ]
    };
  }

  private grupoCarroceriaRigido(): GrupoDetalle {
    return {
      titulo: 'Carrocería',
      icono: 'fa-solid fa-box-archive',
      campos: [
        { label: 'Carrocería', tipo: 'texto', campos: ['tipoCarro', 'carroceria'] },
        { label: 'Volumen', tipo: 'texto', campos: ['volume'], sufijo: 'm³' },
        { label: 'Medida interior', tipo: 'medidaInterior' }
      ]
    };
  }

  private grupoCarroceriaSemi(): GrupoDetalle {
    return {
      titulo: 'Carrocería',
      icono: 'fa-solid fa-box-archive',
      campos: [
        { label: 'Carrocería', tipo: 'texto', campos: ['tipoCarro', 'carroceria'] },
        { label: 'Tipo de piso', tipo: 'texto', campos: ['tipoPiso'] },
        { label: 'Volumen', tipo: 'texto', campos: ['volume'], sufijo: 'm³' },
        { label: 'Marca de carrocería', tipo: 'texto', campos: ['marcaCarro'] },
        { label: 'Medida interior', tipo: 'medidaInterior' },
        { label: 'Techo corredero', tipo: 'boolean', campos: ['tecCor'] }
      ]
    };
  }

  private grupoOtrosTractora(): GrupoDetalle {
    return {
      titulo: 'Otros datos',
      icono: 'fa-solid fa-sliders',
      campos: [
        { label: 'Tipo de tacógrafo', tipo: 'texto', campos: ['tacografo'] },
        { label: 'EBS', tipo: 'ebs', campos: ['ebs'] },
        { label: 'ABS', tipo: 'abs', campos: ['ebs'] },
        { label: 'Programador de velocidad', tipo: 'boolean', campos: ['conVel'] },
        { label: 'Aire acondicionado', tipo: 'boolean', campos: ['airAco'] },
        { label: 'Calefacción autónoma', tipo: 'boolean', campos: ['calefa'] },
        { label: 'Climatizador techo / I-Park Cool', tipo: 'boolean', campos: ['cliTec'] },
        { label: 'Radio', tipo: 'boolean', campos: ['radio'] },
        { label: 'Emisora', tipo: 'boolean', campos: ['emisora'] },
        { label: 'Nevera', tipo: 'boolean', campos: ['nevera'] },
        { label: 'Xenón', tipo: 'boolean', campos: ['xenon'] },
        { label: 'Hidráulico', tipo: 'boolean', campos: ['hidraulica'] }
      ]
    };
  }

  private grupoOtrosRigido(): GrupoDetalle {
    return {
      titulo: 'Otros datos',
      icono: 'fa-solid fa-sliders',
      campos: [
        { label: 'Tipo de tacógrafo', tipo: 'texto', campos: ['tacografo'] },
        { label: 'EBS', tipo: 'ebs', campos: ['ebs'] },
        { label: 'ABS', tipo: 'abs', campos: ['ebs'] },
        { label: 'Programador de velocidad', tipo: 'boolean', campos: ['conVel'] },
        { label: 'Aire acondicionado', tipo: 'boolean', campos: ['airAco'] },
        { label: 'Calefacción autónoma', tipo: 'boolean', campos: ['calefa'] },
        { label: 'Climatizador techo / I-Park Cool', tipo: 'boolean', campos: ['cliTec'] },
        { label: 'Radio', tipo: 'boolean', campos: ['radio'] },
        { label: 'Emisora', tipo: 'boolean', campos: ['emisora'] },
        { label: 'Nevera', tipo: 'boolean', campos: ['nevera'] },
        { label: 'Xenón', tipo: 'boolean', campos: ['xenon'] }
      ]
    };
  }

  private grupoOtrosSemi(): GrupoDetalle {
    return {
      titulo: 'Otros datos',
      icono: 'fa-solid fa-sliders',
      campos: [
        { label: 'EBS', tipo: 'ebs', campos: ['ebs'] },
        { label: 'ABS', tipo: 'abs', campos: ['ebs'] }
      ]
    };
  }

  valorCampo(v: FichaDto, campo: CampoDetalle): string {
    if (campo.tipo === 'precio') {
      const precio = this.obtenerValor(v, campo.campos || []);

      if (Number(precio) > 0) {
        return new Intl.NumberFormat('es-ES', {
          style: 'currency',
          currency: 'EUR',
          maximumFractionDigits: 0
        }).format(Number(precio));
      }

      return 'Precio a consultar';
    }

    if (campo.tipo === 'fechaYear') {
      const valor = this.obtenerValor(v, campo.campos || []);

      if (!this.esCheck(valor)) {
        return 'N/D';
      }

      const fecha = new Date(valor);

      if (isNaN(fecha.getTime())) {
        return 'N/D';
      }

      return fecha.getFullYear().toString();
    }

    if (campo.tipo === 'numero') {
      const valor = this.obtenerValor(v, campo.campos || []);

      if (!this.esCheck(valor)) {
        return 'N/D';
      }

      const numero = Number(valor);

      if (isNaN(numero)) {
        return `${valor}${campo.sufijo ? ' ' + campo.sufijo : ''}`;
      }

      return `${new Intl.NumberFormat('es-ES').format(numero)}${campo.sufijo ? ' ' + campo.sufijo : ''}`;
    }

    if (campo.tipo === 'medidaInterior') {
      return this.obtenerMedidaInterior(v);
    }

    const valor = this.obtenerValor(v, campo.campos || [], campo.permitirCero);

    if (!this.esCheck(valor) && !(campo.permitirCero && Number(valor) === 0)) {
      return 'N/D';
    }

    return `${valor}${campo.sufijo ? ' ' + campo.sufijo : ''}`;
  }

  campoBoolean(v: FichaDto, campo: CampoDetalle): boolean {
    if (campo.tipo === 'ebs') {
      return this.esEbs(v);
    }

    if (campo.tipo === 'abs') {
      return this.esAbs(v);
    }

    const valor = this.obtenerValor(v, campo.campos || []);
    return this.esCheck(valor);
  }

  esEbs(v: FichaDto): boolean {
    const val = String(v?.ebs ?? '').trim().toUpperCase();
    return val === 'N' || val === 'NO' || val === '0' || val === 'FALSE';
  }

  esAbs(v: FichaDto): boolean {
    const val = String(v?.ebs ?? '').trim().toUpperCase();
    return val === 'S' || val === 'SI' || val === '1' || val === 'TRUE';
  }

  private obtenerValor(v: FichaDto, campos: string[], permitirCero: boolean = false): any {
    const vehiculoAny = v as Record<string, any>;

    for (const campo of campos) {
      const valor = vehiculoAny[campo];

      if (permitirCero && Number(valor) === 0) {
        return valor;
      }

      if (this.esCheck(valor)) {
        return valor;
      }
    }

    return null;
  }

  private obtenerMedidaInterior(v: FichaDto): string {
    const largo = this.obtenerValor(v, ['intLar']);
    const ancho = this.obtenerValor(v, ['intAnc']);
    const alto = this.obtenerValor(v, ['intAlt']);

    const partes: string[] = [];

    if (this.esCheck(largo)) {
      partes.push(`${largo}`);
    }

    if (this.esCheck(ancho)) {
      partes.push(`${ancho}`);
    }

    if (this.esCheck(alto)) {
      partes.push(`${alto}`);
    }

    if (!partes.length) {
      return 'N/D';
    }

    return `${partes.join(' x ')} mm`;
  }

  private esCheck(valor: any): boolean {
    if (valor === null || valor === undefined) return false;

    if (typeof valor === 'number') return valor > 0;

    const vStr = String(valor).trim().toUpperCase();

    if (
      vStr === '' ||
      vStr === 'N' ||
      vStr === 'NO' ||
      vStr === '0' ||
      vStr === 'N/D' ||
      vStr === 'FALSE' ||
      vStr.startsWith('0001-01-01')
    ) {
      return false;
    }

    return true;
  }

  private normalizarTexto(valor: any): string {
    return String(valor ?? '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

}
