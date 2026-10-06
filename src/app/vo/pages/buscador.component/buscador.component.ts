import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VoService } from '../../services/vo.service';
import { VehiculoData, VehiculoDto } from '../../interfaces/vehiculos.interface';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { BusquedaData } from '../../interfaces/busqueda.interface';
import { LoginModalComponent } from '../../components/login-modal.component/login-modal.component';
import { ComparadorService } from '../../services/comparador.service';
import { TranslatePipe } from '@ngx-translate/core';
import { IdiomaService } from '../../services/idioma.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// 2. Importa los iconos sólidos
import {
  faMagnifyingGlass,
  faXmark,
  faScaleUnbalanced,
  faBookmark,
  faSliders,
  faTruck,
  faCalendar,
  faRoad,
  faGaugeHigh,
  faLeaf,
  faGauge,
  faStar as faStarSolid,
  faCheck,
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';

export interface FilterOption {
  id: string;
  codigo: string;
  name: string;
  isChecked: boolean;
}

type CategoriaFiltro = 'tipos' | 'marcas' | 'modelos' | 'cabinas' | 'ejes' | 'euroNormas' | 'carrocerias';

@Component({
  selector: 'app-buscador.component',
  imports: [
     TranslatePipe, FormsModule, RouterModule, RouterLink,
    LoginModalComponent, FontAwesomeModule
  ],
  templateUrl: './buscador.component.html',
  styleUrl: './buscador.component.scss',
})
export default class BuscadorComponent implements OnInit {

  faMagnifyingGlass = faMagnifyingGlass;
  faXmark = faXmark;
  faScaleUnbalanced = faScaleUnbalanced;
  faBookmark = faBookmark;
  faSliders = faSliders;
  faTruck = faTruck;
  faCalendar = faCalendar;
  faRoad = faRoad;
  faGaugeHigh = faGaugeHigh;
  faLeaf = faLeaf;
  faGauge = faGauge;
  faStarSolid = faStarSolid;
  faStarRegular = faStarRegular;
  faCheck = faCheck;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;

  private voService = inject(VoService);
  private route = inject(ActivatedRoute);
  private comparadorService = inject(ComparadorService);
  private idiomaService = inject(IdiomaService);

  constructor() {

    effect(() => {

      const idioma = this.idiomaService.idioma().codigo;


      this.cargarFiltros();

      if (this.voService.usuarioActual) {
        this.cargarFavoritosUsuario();
      }

      this.cargarTodosLosVehiculos();

    });

    // Scroll al cambiar página o filtros
    effect(() => {
      this.paginaActual();
      this.vehiculosFiltrados();

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    // Carga progresiva imágenes
    effect(() => {
      const vehiculosVisibles = this.vehiculosPaginaBase();

      if (!vehiculosVisibles.length) {
        return;
      }

      queueMicrotask(() => {
        this.cargarImagenesPagina(vehiculosVisibles);
      });
    });
  }

  usuarioLogado = computed(() => !!this.voService.usuarioActual);

  // Control de interfaz
  mostrarFiltros = signal<boolean>(false);

  expandidoModelos = signal<boolean>(false);
  expandidoCabinas = signal<boolean>(false);
  expandidoCarrocerias = signal<boolean>(false);

  // Array base cargado desde la API
  vehiculosSinFiltrar = signal<VehiculoDto[]>([]);

  favoritosUsuario = signal<string[]>([]);
  imagenesVehiculo = signal<Record<string, string | null>>({});
  imagenesCargando = signal<Record<string, boolean>>({});
  imagenesSolicitadas = signal<Set<string>>(new Set());


  // Paginación
  paginaActual = signal(1);
  elementosPorPagina = signal(12);

  // Checkboxes
  tipos = signal<FilterOption[]>([]);
  marcas = signal<FilterOption[]>([]);
  modelos = signal<FilterOption[]>([]);
  cabinas = signal<FilterOption[]>([]);
  ejes = signal<FilterOption[]>([]);
  euroNormas = signal<FilterOption[]>([]);
  carrocerias = signal<FilterOption[]>([]);

  // Opciones para las listas desplegables
  aniosDisponibles = signal<number[]>([]);
  potenciasDisponibles = signal<number[]>([]);
  mostrarLoginModal = signal(false);

  private accionPendiente:
    | 'guardarBusqueda'
    | 'favorito'
    | null = null;

  private vehiculoPendiente: VehiculoDto | null = null;

  // CONSTANTES LÍMITE POR DEFECTO (Para saber cuándo un filtro está sin modificar)
  readonly ANIO_MIN_DEFAULT = 1900;
  readonly ANIO_MAX_DEFAULT = 2100;
  readonly POT_MIN_DEFAULT = 0;
  readonly POT_MAX_DEFAULT = 9999;

  // Signals para los valores seleccionados por el usuario
  anioDesde = signal<number>(this.ANIO_MIN_DEFAULT);
  anioHasta = signal<number>(this.ANIO_MAX_DEFAULT);
  potDesde = signal<number>(this.POT_MIN_DEFAULT);
  potHasta = signal<number>(this.POT_MAX_DEFAULT);
  kmDesde = signal<number | null>(null);
  kmHasta = signal<number | null>(null);
  precioDesde = signal<number>(this.POT_MIN_DEFAULT);
  precioHasta = signal<number>(this.POT_MAX_DEFAULT);

  // Signal para el input y para el valor filtrado con retraso
  textoBusqueda = signal<string>('');
  textoBusquedaDebounced = signal<string>('');
  private searchTimer: any;

  ngOnInit(): void {

    // this.cargarFiltros();

    // if (this.voService.usuarioActual) {
    //   this.cargarFavoritosUsuario();
    // }

    // this.cargarTodosLosVehiculos();

  }

  // -------------------------------------------------------------
  // COMPUTED PRINCIPAL: EXTRACTOR UNIVERSAL DE AÑO
  // -------------------------------------------------------------
  vehiculosFiltrados = computed(() => {
    const todos = this.vehiculosSinFiltrar();
    const query = this.textoBusquedaDebounced();

    if (!todos || todos.length === 0) return [];

    // Helper para checkboxes
    const getSeleccionados = (sig: () => FilterOption[]) => {
      const seleccionados = sig().filter(x => x.isChecked);
      return {
        valores: seleccionados.flatMap(x => [
          (x.codigo || '').toString().toLowerCase().trim(),
          (x.name || '').toString().toLowerCase().trim()
        ]).filter(Boolean),
        activo: seleccionados.length > 0
      };
    };

    const fTipos = getSeleccionados(this.tipos);
    const fMarcas = getSeleccionados(this.marcas);
    const fModelos = getSeleccionados(this.modelos);
    const fCabinas = getSeleccionados(this.cabinas);
    const fEjes = getSeleccionados(this.ejes);
    const fEuro = getSeleccionados(this.euroNormas);
    const fCarro = getSeleccionados(this.carrocerias);

    const hayFiltroAnio = this.anioDesde() > this.ANIO_MIN_DEFAULT || this.anioHasta() < this.ANIO_MAX_DEFAULT;
    const hayFiltroPotencia = this.potDesde() > this.POT_MIN_DEFAULT || this.potHasta() < this.POT_MAX_DEFAULT;
    const hayFiltroKm = (this.kmDesde() !== null && this.kmDesde()! > 0) || (this.kmHasta() !== null && this.kmHasta()! > 0);
    const hayCheckboxActivo = fTipos.activo || fMarcas.activo || fModelos.activo || fCabinas.activo || fEjes.activo || fEuro.activo || fCarro.activo;
    const hayFiltroTexto = query.length > 0;

    if (!hayCheckboxActivo && !hayFiltroAnio && !hayFiltroPotencia && !hayFiltroKm && !hayFiltroTexto) {
      return todos;
    }

    const aDesde = Number(this.anioDesde());
    const aHasta = Number(this.anioHasta());
    const pDesde = Number(this.potDesde());
    const pHasta = Number(this.potHasta());
    const kDesde = this.kmDesde() !== null ? Number(this.kmDesde()) : null;
    const kHasta = this.kmHasta() !== null ? Number(this.kmHasta()) : null;

    const extraerAnio = (valorFecha: any): number | null => {
      if (!valorFecha) return null;
      const str = valorFecha.toString().trim();
      const match = str.match(/\b(19\d\d|20\d\d)\b/);
      if (match) return parseInt(match[0], 10);
      const num = parseInt(str, 10);
      return !isNaN(num) && num > 1900 && num < 2100 ? num : null;
    };

    return todos.filter((v: VehiculoDto) => {
      // -------------------------------------------------------------------
      // BUSCADOR GLOBAL DINÁMICO (FILTRA POR TODO MENOS IMÁGENES)
      // -------------------------------------------------------------------
      if (hayFiltroTexto) {
        const coincide = Object.entries(v).some(([clave, valor]) => {
          // Ignoramos campos nulos, indefinidos o de imagen (base64, URL, etc.)
          if (
            valor === null ||
            valor === undefined ||
            clave.toLowerCase().includes('imagen') ||
            clave.toLowerCase().includes('image') ||
            clave.toLowerCase().includes('img')
          ) {
            return false;
          }

          // Si la propiedad es un objeto u otro tipo, lo convertimos a String
          const textoCampo = typeof valor === 'object'
            ? JSON.stringify(valor).toLowerCase()
            : valor.toString().toLowerCase();

          return textoCampo.includes(query);
        });

        if (!coincide) return false;
      }

      // Coincidencia de Checkboxes
      const coincideCheckbox = (campo: any, filtro: { valores: string[], activo: boolean }) => {
        if (!filtro.activo) return true;
        if (!campo) return false;
        const texto = campo.toString().toLowerCase().trim();
        return filtro.valores.some(val => texto.includes(val) || val.includes(texto));
      };

      if (!coincideCheckbox(v.tipoVeh, fTipos)) return false;
      if (!coincideCheckbox(v.marca, fMarcas)) return false;
      if (!coincideCheckbox(v.modelo, fModelos)) return false;
      if (!coincideCheckbox(v.cabina, fCabinas)) return false;
      if (!coincideCheckbox(v.confEjes, fEjes)) return false;
      if (!coincideCheckbox(v.euronorma, fEuro)) return false;

      // Filtro por Año
      if (hayFiltroAnio) {
        const anio = extraerAnio(v.fechaMat);
        if (anio !== null && (anio < aDesde || anio > aHasta)) return false;
      }

      // Filtro por Potencia
      if (hayFiltroPotencia) {
        const pot = Number(v.potMot || 0);
        if (pot > 0 && (pot < pDesde || pot > pHasta)) return false;
      }

      // Filtro por Kilometraje
      if (hayFiltroKm) {
        const km = Number(v.kilom || 0);
        if (kDesde !== null && km < kDesde) return false;
        if (kHasta !== null && km > kHasta) return false;
      }

      return true;
    });
  });

  // COMPUTED PAGINACIÓN
  // Vehículos reales de la página actual, sin tocar imágenes
  vehiculosPaginaBase = computed(() => {
    const inicio = (this.paginaActual() - 1) * this.elementosPorPagina();
    const fin = inicio + this.elementosPorPagina();

    return this.vehiculosFiltrados().slice(inicio, fin);
  });

  // Vehículos que se pintan en pantalla
  vehiculos = computed(() => {
    const imagenes = this.imagenesVehiculo();

    return this.vehiculosPaginaBase().map(v => ({
      ...v,
      imagenBase64: imagenes[v.idStoc?.toString()] ?? null
    }));
  });

  totalPaginas = computed(() =>
    Math.ceil(this.vehiculosFiltrados().length / this.elementosPorPagina())
  );

  paginas = computed(() =>
    Array.from({ length: this.totalPaginas() }, (_, i) => i + 1)
  );

  get filtrarAniosHasta() {
    return this.aniosDisponibles().filter(a => a >= this.anioDesde());
  }

  get filtrarPotenciasHasta() {
    return this.potenciasDisponibles().filter(p => p >= this.potDesde());
  }

  // -------------------------------------------------------------
  // MÉTODOS DE ACTUALIZACIÓN DE RANGOS
  // -------------------------------------------------------------
  setAnioDesde(val: any) {
    const num = Number(val);
    this.anioDesde.set(num);
    if (this.anioHasta() < num) {
      this.anioHasta.set(num);
    }
    this.paginaActual.set(1);
  }

  setAnioHasta(val: any) {
    this.anioHasta.set(Number(val));
    this.paginaActual.set(1);
  }

  setPotDesde(val: any) {
    const num = Number(val);
    this.potDesde.set(num);
    if (this.potHasta() < num) {
      this.potHasta.set(num);
    }
    this.paginaActual.set(1);
  }

  setPotHasta(val: any) {
    this.potHasta.set(Number(val));
    this.paginaActual.set(1);
  }

  setKmDesde(val: any) {
    this.kmDesde.set(val !== null && val !== '' ? Number(val) : null);
    this.paginaActual.set(1);
  }

  setKmHasta(val: any) {
    this.kmHasta.set(val !== null && val !== '' ? Number(val) : null);
    this.paginaActual.set(1);
  }

  // -------------------------------------------------------------
  // CARGA DE DATOS API
  // -------------------------------------------------------------
  private cargarTodosLosVehiculos(): void {
    const filtroInicial: VehiculoData = {
      idioma: this.idiomaService.getIdiomaCodigo(),
      orden: 'PRECIO_ASC'
    };

    this.voService.getVehiculos(filtroInicial).subscribe({
      next: (res: any) => {
        const listaVehiculos: VehiculoDto[] = Array.isArray(res)
          ? res
          : (res?.data || res?.vehiculos || []);


        if (!listaVehiculos.length) {
          this.vehiculosSinFiltrar.set([]);
          return;
        }

        // Pintamos vehículos al instante, sin esperar a las imágenes
        this.vehiculosSinFiltrar.set(listaVehiculos);

        // Marcamos favoritos si ya estaban cargados
        this.marcarFavoritos();
      },

      error: err => {
        console.error('Error al llamar a getVehiculos:', err);
        this.vehiculosSinFiltrar.set([]);
      }
    });
  }

  private cargarFiltros(): void {
    this.voService.getFiltros().subscribe({
      next: (filtros: any) => {
        if (!filtros) return;

        this.tipos.set((filtros.tipoVeh || []).map((t: string) => ({ id: `tipo-${t}`, codigo: t, name: t, isChecked: false })));
        this.marcas.set((filtros.codMarca || []).map((c: string, i: number) => ({ id: `marca-${c}`, codigo: c, name: filtros.desMarca?.[i] || c, isChecked: false })));
        this.modelos.set((filtros.codModelo || []).map((c: string, i: number) => ({ id: `modelo-${c}`, codigo: c, name: filtros.desModelo?.[i] || c, isChecked: false })));
        this.cabinas.set((filtros.codCabina || []).map((c: string, i: number) => ({ id: `cabina-${c}`, codigo: c, name: filtros.desCabina?.[i] || c, isChecked: false })));
        this.ejes.set((filtros.codEje || []).map((c: string, i: number) => ({ id: `eje-${c}`, codigo: c, name: filtros.desEje?.[i] || c, isChecked: false })));
        this.euroNormas.set((filtros.codEuroNorma || []).map((c: string, i: number) => ({ id: `euro-${c}`, codigo: c, name: filtros.desEuroNorma?.[i] || c, isChecked: false })));
        this.carrocerias.set((filtros.codCarro || []).map((c: string, i: number) => ({ id: `carro-${i}`, codigo: filtros.desCarro?.[i] || c, name: filtros.desCarro?.[i] || c, isChecked: false })));

        // Generar lista de Años para el <select> sin modificar la selección actual
        const anioMin = filtros.minAnio?.length ? Number(filtros.minAnio[0]) : 2000;
        const anioAct = new Date().getFullYear();
        const listaAnios = [];
        for (let a = anioMin; a <= anioAct; a++) listaAnios.push(a);
        this.aniosDisponibles.set(listaAnios);

        // Generar lista de Potencias para el <select> sin modificar la selección actual
        const potMax = filtros.maxPot?.length ? Number(filtros.maxPot[0]) : 1000;
        const listaPot = [];
        for (let p = 0; p <= potMax; p += 10) listaPot.push(p);
        this.potenciasDisponibles.set(listaPot);
        this.aplicarFiltrosHome();
      },
      error: (err) => console.error('Error al cargar filtros:', err)
    });
  }

  toggleCheckbox(lista: CategoriaFiltro, index: number) {
    const mapCategorias = {
      tipos: this.tipos,
      marcas: this.marcas,
      modelos: this.modelos,
      cabinas: this.cabinas,
      ejes: this.ejes,
      euroNormas: this.euroNormas,
      carrocerias: this.carrocerias
    };

    const targetSignal = mapCategorias[lista];
    if (targetSignal) {
      targetSignal.update(opciones => {
        const actualizadas = [...opciones];
        actualizadas[index] = { ...actualizadas[index], isChecked: !actualizadas[index].isChecked };
        return actualizadas;
      });
      this.paginaActual.set(1);
    }
  }

  applyFilters(): void {
    this.paginaActual.set(1);
    this.cerrarFiltros();
  }

  overrideApplyFilters(): void {
    this.applyFilters();
  }

  paginaAnterior(): void {
    if (this.paginaActual() > 1) this.paginaActual.update(x => x - 1);
  }

  paginaSiguiente(): void {
    if (this.paginaActual() < this.totalPaginas()) this.paginaActual.update(x => x + 1);
  }

  irPagina(num: number): void {
    this.paginaActual.set(num);
  }

  toggleFiltros(): void {
    this.mostrarFiltros.update(v => !v);
  }

  cerrarFiltros(): void {
    this.mostrarFiltros.set(false);
  }

  toggleFavorito(vehiculo: VehiculoDto): void {

    const usuario = this.voService.usuarioActual;

    if (!usuario) {

      this.accionPendiente = 'favorito';

      this.vehiculoPendiente = vehiculo;

      this.mostrarLoginModal.set(true);

      return;
    }

    if (vehiculo.esFavorito) {

      // Cambio visual inmediato
      vehiculo.esFavorito = false;

      this.voService.delFavorito({
        idUsr: usuario.numUsuario.toString(),
        idStoc: vehiculo.idStoc.toString()
      })
      .subscribe({
        next: () => {


        },
        error: err => {

          console.error(err);

          // Revertir si falla
          vehiculo.esFavorito = true;

        }
      });

    } else {

      // Cambio visual inmediato
      vehiculo.esFavorito = true;

      this.voService.addFavoritos({
        idUsr: usuario.numUsuario.toString(),
        idStoc: vehiculo.idStoc.toString()
      })
      .subscribe({
        next: () => {


        },
        error: err => {

          console.error(err);

          // Revertir si falla
          vehiculo.esFavorito = false;

        }
      });

    }

  }

  private cargarFavoritosUsuario(): void {

    const usuario = this.voService.usuarioActual;

    if (!usuario) {
      return;
    }

    this.voService.getFavoritos({
      idioma: this.idiomaService.getCodigo(),
      idUsr: usuario.numUsuario.toString()
    }).subscribe({

      next: favoritos => {

        this.favoritosUsuario.set(
          favoritos.map(x => x.idStoc.toString())
        );

        this.marcarFavoritos();

      },

      error: err => {
        console.error(err);
      }

    });

  }

  private marcarFavoritos(): void {

    const favoritos = this.favoritosUsuario();

    if (!favoritos.length) {
      return;
    }

    this.vehiculosSinFiltrar.update(
      vehiculos =>
        vehiculos.map(v => ({

          ...v,

          esFavorito: favoritos.includes(
            v.idStoc.toString()
          )

        }))
    );

  }

  guardarBusqueda(): void {

    const usuario = this.voService.usuarioActual;
    if (!usuario) {

      this.accionPendiente = 'guardarBusqueda';

      this.mostrarLoginModal.set(true);

      return;
    }


    const tipos = this.tipos()
      .filter(x => x.isChecked)
      .map(x => x.name);

    const marcas = this.marcas()
      .filter(x => x.isChecked)
      .map(x => x.name);

    const modelos = this.modelos()
      .filter(x => x.isChecked)
      .map(x => x.name);

    const cabinas = this.cabinas()
      .filter(x => x.isChecked)
      .map(x => x.name);

    const cfgEjes = this.ejes()
      .filter(x => x.isChecked)
      .map(x => x.name);

    const emisiones = this.euroNormas()
      .filter(x => x.isChecked)
      .map(x => x.name);

    const carroceria = this.carrocerias()
      .filter(x => x.isChecked)
      .map(x => x.name);

    const data: BusquedaData = {

      idUsr: usuario.numUsuario.toString(),

      idioma: this.idiomaService.getCodigo(),

      nombreConsulta:
        `Búsqueda ${new Date().toLocaleDateString('es-ES')}`,

      tipos,

      marcas,

      modelos,

      anioDesde: this.anioDesde().toString(),

      anioHasta: this.anioHasta().toString(),

      potDesde: this.potDesde().toString(),

      potHasta: this.potHasta().toString(),

      emisiones,

      cfgEjes,

      cabinas,

      carroceria,

      kmsDesde:
        this.kmDesde() != null
          ? this.kmDesde()!.toString()
          : '',

      kmsHasta:
        this.kmHasta() != null
          ? this.kmHasta()!.toString()
          : '',

      precioDesde: '',

      precioHasta: ''

    };


    this.voService.guardarBusqueda(data)
      .subscribe({

        next: resultado => {

          alert(
            'Búsqueda guardada correctamente'
          );

        },

        error: err => {

          console.error(err);

        }

      });

  }

  cerrarLoginModal(): void {

    this.mostrarLoginModal.set(false);

    const usuario = this.voService.usuarioActual;

    if (!usuario) {

      this.accionPendiente = null;
      this.vehiculoPendiente = null;

      return;
    }

    this.cargarFavoritosUsuario();

    switch (this.accionPendiente) {

      case 'guardarBusqueda':

        this.accionPendiente = null;

        this.guardarBusqueda();

        break;

      case 'favorito':

        if (this.vehiculoPendiente) {

          const vehiculo = this.vehiculoPendiente;

          this.accionPendiente = null;
          this.vehiculoPendiente = null;

          this.toggleFavorito(vehiculo);

        }

        break;

      default:

        this.accionPendiente = null;
        this.vehiculoPendiente = null;

        break;
    }
  }

  private aplicarFiltrosHome(): void {

    const params = this.route.snapshot.queryParamMap;

    // Home
    const marca = params.get('marca');
    const modelo = params.get('modelo');
    const anio = params.get('anio');
    const km = params.get('km');

    // Búsquedas guardadas
    const marcas = params.get('marcas');
    const modelos = params.get('modelos');
    const tipos = params.get('tipos');

    const anioDesde = params.get('anioDesde');
    const anioHasta = params.get('anioHasta');

    const kmsDesde = params.get('kmsDesde');
    const kmsHasta = params.get('kmsHasta');

    const potDesde = params.get('potDesde');
    const potHasta = params.get('potHasta');

    const precioDesde = params.get('precioDesde');
    const precioHasta = params.get('precioHasta');

    // --------------------------------------------------
    // HOME (marca única)
    // --------------------------------------------------

    if (marca) {

      this.marcas.update(lista =>
        lista.map(item => ({
          ...item,
          isChecked:
            item.name.toLowerCase() === marca.toLowerCase()
        }))
      );

    }

    // --------------------------------------------------
    // HOME (modelo único)
    // --------------------------------------------------

    if (modelo) {

      this.modelos.update(lista =>
        lista.map(item => ({
          ...item,
          isChecked:
            item.name.toLowerCase().includes(
              modelo.toLowerCase()
            )
        }))
      );

    }

    // --------------------------------------------------
    // BÚSQUEDAS GUARDADAS - MARCAS
    // --------------------------------------------------

    if (marcas) {

      const listaMarcas = marcas
        .split('|')
        .map(x => x.toLowerCase());

      this.marcas.update(lista =>
        lista.map(item => ({
          ...item,
          isChecked:
            listaMarcas.includes(
              item.name.toLowerCase()
            )
        }))
      );

    }

    // --------------------------------------------------
    // BÚSQUEDAS GUARDADAS - MODELOS
    // --------------------------------------------------

    if (modelos) {

      const listaModelos = modelos
        .split('|')
        .map(x => x.toLowerCase());

      this.modelos.update(lista =>
        lista.map(item => ({
          ...item,
          isChecked:
            listaModelos.includes(
              item.name.toLowerCase()
            )
        }))
      );

    }

    // --------------------------------------------------
    // BÚSQUEDAS GUARDADAS - TIPOS
    // --------------------------------------------------

    if (tipos) {

      const listaTipos = tipos
        .split('|')
        .map(x => x.toLowerCase());

      this.tipos.update(lista =>
        lista.map(item => ({
          ...item,
          isChecked:
            listaTipos.includes(
              item.name.toLowerCase()
            )
        }))
      );

    }

    // --------------------------------------------------
    // AÑOS
    // --------------------------------------------------

    if (anio) {
      this.anioDesde.set(Number(anio));
    }

    if (anioDesde) {
      this.anioDesde.set(Number(anioDesde));
    }

    if (anioHasta) {
      this.anioHasta.set(Number(anioHasta));
    }

    // --------------------------------------------------
    // KM
    // --------------------------------------------------

    if (km) {
      this.kmHasta.set(Number(km));
    }

    if (kmsDesde) {
      this.kmDesde.set(Number(kmsDesde));
    }

    if (kmsHasta) {
      this.kmHasta.set(Number(kmsHasta));
    }

    // --------------------------------------------------
    // POTENCIA
    // --------------------------------------------------

    if (potDesde) {
      this.potDesde.set(Number(potDesde));
    }

    if (potHasta) {
      this.potHasta.set(Number(potHasta));
    }

    // --------------------------------------------------
    // PRECIO
    // --------------------------------------------------

    if (precioDesde) {
      this.precioDesde.set(Number(precioDesde));
    }

    if (precioHasta) {
      this.precioHasta.set(Number(precioHasta));
    }

    this.paginaActual.set(1);

  }

  // Alterna (añade o quita) el vehículo de la lista sin límite de cantidad
  toggleComparador(vehiculo: VehiculoDto): void {
    const estaComparado = this.esVehiculoComparado(vehiculo);

    if (estaComparado) {
      this.comparadorService.removeVehiculo(
        vehiculo.idStoc.toString()
      );
      return;
    }

    const resultado = this.comparadorService.addVehiculo(
      vehiculo.idStoc.toString(),
      vehiculo.tipoVeh.trim()
    );

    switch (resultado) {
      case 'TIPO':
        alert('Solo puedes comparar vehículos del mismo tipo.');
        break;

      case 'MAXIMO':
        alert('Solo puedes comparar 2 vehículos como máximo.');
        break;
    }
  }


  // Verifica si el vehículo actual está en la lista de comparados
  esVehiculoComparado(vehiculo: VehiculoDto): boolean {
    if (!vehiculo?.idStoc) return false;

    // Asumiendo que vehiculosComparador es una Signal en tu ComparadorService
    return this.comparadorService
      .vehiculosComparador()
      .includes(vehiculo.idStoc.toString());
  }

  onTextoBusquedaChange(valor: string): void {
    this.textoBusqueda.set(valor);

    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }

    this.searchTimer = setTimeout(() => {
      this.textoBusquedaDebounced.set(valor.trim().toLowerCase());
      this.paginaActual.set(1); // Resetea a la página 1 al buscar
    }, 400);
  }

  private cargarImagenesPagina(vehiculos: VehiculoDto[]): void {
    const solicitadas = this.imagenesSolicitadas();

    const idsPendientes = vehiculos
      .map(v => v.idStoc?.toString())
      .filter((id): id is string => !!id)
      .filter(id => !solicitadas.has(id));

    if (!idsPendientes.length) {
      return;
    }

    // Marcamos estas imágenes como solicitadas para no pedirlas otra vez
    this.imagenesSolicitadas.update(actual => {
      const nuevo = new Set(actual);

      idsPendientes.forEach(id => {
        nuevo.add(id);
      });

      return nuevo;
    });

    // Activamos skeleton
    this.imagenesCargando.update(actual => {
      const nuevo = { ...actual };

      idsPendientes.forEach(id => {
        nuevo[id] = true;
      });

      return nuevo;
    });

    this.voService.getImagenes(idsPendientes, 0).subscribe({
      next: (imagenesRes: any) => {
        const imagenes = imagenesRes?.imagenes || (
          Array.isArray(imagenesRes) ? imagenesRes : []
        );

        this.imagenesVehiculo.update(actual => {
          const nuevo = { ...actual };

          idsPendientes.forEach((id, index) => {
            nuevo[id] = imagenes[index] ?? null;
          });

          return nuevo;
        });

        this.imagenesCargando.update(actual => {
          const nuevo = { ...actual };

          idsPendientes.forEach(id => {
            nuevo[id] = false;
          });

          return nuevo;
        });
      },

      error: err => {
        console.error('Error cargando imágenes:', err);

        this.imagenesVehiculo.update(actual => {
          const nuevo = { ...actual };

          idsPendientes.forEach(id => {
            nuevo[id] = null;
          });

          return nuevo;
        });

        this.imagenesCargando.update(actual => {
          const nuevo = { ...actual };

          idsPendientes.forEach(id => {
            nuevo[id] = false;
          });

          return nuevo;
        });
      }
    });
  }

  getImagenSrc(vehiculo: VehiculoDto): string {
    const id = vehiculo.idStoc?.toString();

    if (!id) {
      return 'assets/no-image.jpg';
    }

    const imagen = this.imagenesVehiculo()[id];

    return imagen
      ? `data:image/jpeg;base64,${imagen}`
      : 'assets/no-image.jpg';
  }

  estaCargandoImagen(vehiculo: VehiculoDto): boolean {
    const id = vehiculo.idStoc?.toString();

    if (!id) {
      return false;
    }

    return this.imagenesCargando()[id] === true;
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '';

    const d = new Date(fecha);

    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  }

  formatearKm(valor: any): string {
    if (valor === null || valor === undefined || valor === '') {
      return '0';
    }

    return Number(valor).toLocaleString('es-ES');
  }


}
