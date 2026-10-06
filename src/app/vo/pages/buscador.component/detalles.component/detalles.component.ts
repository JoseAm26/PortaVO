import { CommonModule, Location } from '@angular/common';
import { Component, computed, effect, ElementRef, HostListener, inject, OnInit, signal, viewChild, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VoService } from '../../../services/vo.service';
import { FichaData, FichaDto } from '../../../interfaces/detalles.interface';
import { FormuarlioDetalleComponent } from './formuarlio-detalle.component/formuarlio-detalle.component';
import { RelacionadosComponent } from './relacionados.component/relacionados.component';
import { VehiculoData, VehiculoDto } from '../../../interfaces/vehiculos.interface';
import { LoginModalComponent } from '../../../components/login-modal.component/login-modal.component';
import { ComparadorService } from '../../../services/comparador.service';
import { TranslatePipe } from '@ngx-translate/core';
import { IdiomaService } from '../../../services/idioma.service';
import { DetalleEspecificoComponent } from './detalle-especifico.component/detalle-especifico.component';
import { Ficha } from '../../../interfaces/ficha.interface';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// 2. Importa los iconos sólidos
import {
  faArrowLeft,
  faTriangleExclamation,
  faChevronLeft,
  faChevronRight,
  faCamera,
  faMagnifyingGlassPlus,
  faStar as faStarSolid,
  faCalendar,
  faRoad,
  faGaugeHigh,
  faGears,
  faLeaf,
  faLocationDot,
  faCircleCheck,
  faCircleXmark,
  faClock,
  faTrashCan,
  faCopy,
  faFileLines,
  faFilePdf,
  faEnvelope,
  faXmark,
  faMinus,
  faPlus,
  faRotateLeft
} from '@fortawesome/free-solid-svg-icons';

// 3. Importa la estrella de contorno (regular)
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';


@Component({
  selector: 'app-detalles',
  standalone: true,
  imports: [
    CommonModule, FormuarlioDetalleComponent, RelacionadosComponent,
    LoginModalComponent, TranslatePipe, DetalleEspecificoComponent,
    FontAwesomeModule
  ],
  templateUrl: './detalles.component.html',
  styleUrl: './detalles.component.scss',
})
export default class DetallesComponent implements OnInit {

  faArrowLeft = faArrowLeft;
  faTriangleExclamation = faTriangleExclamation;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faCamera = faCamera;
  faMagnifyingGlassPlus = faMagnifyingGlassPlus;
  faStarSolid = faStarSolid;
  faStarRegular = faStarRegular;
  faCalendar = faCalendar;
  faRoad = faRoad;
  faGaugeHigh = faGaugeHigh;
  faGears = faGears;
  faLeaf = faLeaf;
  faLocationDot = faLocationDot;
  faCircleCheck = faCircleCheck;
  faCircleXmark = faCircleXmark;
  faClock = faClock;
  faTrashCan = faTrashCan;
  faCopy = faCopy;
  faFileLines = faFileLines;
  faFilePdf = faFilePdf;
  faEnvelope = faEnvelope;
  faXmark = faXmark;
  faMinus = faMinus;
  faPlus = faPlus;
  faRotateLeft = faRotateLeft;

  private route = inject(ActivatedRoute);
  private voService = inject(VoService);
  private location = inject(Location);
  public comparadorService = inject(ComparadorService);
  private idiomaService = inject(IdiomaService);
  readonly formularioRef = viewChild('formularioRef', { read: ElementRef });


  private currentStockId = signal<number>(0);

  @ViewChild('contenedorMiniaturas')
  contenedorMiniaturas!: ElementRef<HTMLDivElement>;

  relacionados = signal<VehiculoDto[]>([]);
  vehiculo = signal<FichaDto | null>(null);
  cargando = signal<boolean>(true);
  error = signal<string | null>(null);
  esFavorito = signal<boolean>(false);
  mostrarLoginModal = signal<boolean>(false);

  private accionPendiente: 'favorito' | null = null;

  // Control de galería e índice activo
  indiceSeleccionado = signal<number>(0);
  modalFotoAbierto = signal<boolean>(false);
  zoom = signal<number>(1);

  posX = signal<number>(0);
  posY = signal<number>(0);

  private arrastrando = false;
  private inicioX = 0;
  private inicioY = 0;
  private startPosX = 0;
  private startPosY = 0;

  seccionesAbiertas = signal<Set<string>>(new Set([
    'motor', 'chasis', 'cabina', 'carroceria', 'frio', 'grua', 'doc'
  ]));

  // Extraer todas las imágenes disponibles en un array
  imagenesGaleria = computed(() => {
    const v = this.vehiculo();
    if (!v) return [];

    const imgsRaw = [
      v.img1, v.img2, v.img3, v.img4, v.img5,
      v.img6, v.img7, v.img8, v.img9, v.img10,
      v.imgCarroceria, v.imgGrua, v.imgPlataforma
    ];

    return imgsRaw
      .filter((img): img is string => !!img && img.trim().length > 0)
      .map(img => img.startsWith('data:image') ? img : `data:image/jpeg;base64,${img}`);
  });

  // Obtener la imagen actualmente seleccionada basándonos en el índice
  imagenSeleccionada = computed(() => {
    const galeria = this.imagenesGaleria();
    if (galeria.length === 0) return 'assets/no-image.jpg';
    const idx = this.indiceSeleccionado();
    return galeria[idx] || galeria[0];
  });

  constructor() {
    effect(() => {
      const idStock = this.currentStockId();
      const lang = this.idiomaService.idioma().codigo;

      if (idStock > 0) {
        this.cargarFicha(idStock, lang);
      }
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idStockParam = params.get('idStock');
      const idStock = idStockParam ? Number(idStockParam) : 0;

      if (idStock > 0) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.currentStockId.set(idStock);
      } else {
        this.error.set('No se ha proporcionado un identificador válido.');
        this.cargando.set(false);
      }
    });
  }

  cargarFicha(idStock: number, idiomaCode?: string): void {
    this.cargando.set(true);
    this.error.set(null);

    const lang = idiomaCode || this.idiomaService.getCodigo();

    const payload: FichaData = {
      aIdioma: lang,
      aIdStock: idStock.toString()
    };

    this.voService.getFicha(payload).subscribe({
      next: (data) => {

        // console.log('Vehiculo Ficha: ', data)

        this.vehiculo.set(data);
        this.cargando.set(false);
        this.cargarFavoritoDetalle(lang);
        this.cargarRelacionados(lang);

        // Resetear al índice 0 al cargar una nueva ficha
        this.indiceSeleccionado.set(0);
      },
      error: (err) => {
        console.error('Error cargando ficha:', err);
        this.error.set('No se pudo cargar la información del vehículo.');
        this.cargando.set(false);
      }
    });
  }

  cargarRelacionados(idiomaCode?: string): void {
    const v = this.vehiculo();
    if (!v) return;

    const lang = idiomaCode || this.idiomaService.getCodigo();

    const filtro: VehiculoData = {
      idioma: lang,
      marca: v.marca ? [v.marca] : [],
      tipo: (v.tipoVeh || v.vhTipVeh) ? [v.tipoVeh || v.vhTipVeh] : []
    };

    this.voService.getVehiculos(filtro).subscribe({
      next: (res: any) => {
        let listaVehiculos: VehiculoDto[] = Array.isArray(res) ? res : (res?.data || res?.vehiculos || []);

        const filtrados = listaVehiculos.filter(item => item.idStoc.toString() !== v.idStoc.toString());

        if (!filtrados.length) {
          this.relacionados.set([]);
          return;
        }

        this.relacionados.set(filtrados);

        const idsStk = filtrados.map(item => item.idStoc).filter(Boolean);

        if (idsStk.length > 0) {
          this.voService.getImagenes(idsStk, 0).subscribe({
            next: (imagenesRes: any) => {
              const imagenes = imagenesRes?.imagenes || (Array.isArray(imagenesRes) ? imagenesRes : []);

              const vehiculosConImagen = filtrados.map((vehiculo, index) => ({
                ...vehiculo,
                imagenBase64: imagenes[index] ?? null
              }));

              this.relacionados.set(vehiculosConImagen);
            },
            error: (err) => {
              console.error('Error al obtener imágenes de relacionados:', err);
              this.relacionados.set(filtrados.map(vehiculo => ({ ...vehiculo, imagenBase64: null })));
            }
          });
        }
      },
      error: (err) => console.error('Error al obtener vehículos relacionados:', err)
    });
  }

  esCheck(valor: any): boolean {
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

  estaAbierta(seccion: string): boolean {
    return this.seccionesAbiertas().has(seccion);
  }

  toggleSeccion(seccion: string): void {
    const actuales = new Set(this.seccionesAbiertas());
    if (actuales.has(seccion)) {
      actuales.delete(seccion);
    } else {
      actuales.add(seccion);
    }
    this.seccionesAbiertas.set(actuales);
  }

  expandirTodas(): void {
    this.seccionesAbiertas.set(new Set(['motor', 'chasis', 'cabina', 'carroceria', 'frio', 'grua', 'doc']));
  }

  colapsarTodas(): void {
    this.seccionesAbiertas.set(new Set());
  }

  volver(): void {
    this.location.back();
  }

  // ==========================================
  // NAVEGACIÓN Y GALERÍA DE IMÁGENES
  // ==========================================

  seleccionarImagenPorIndice(index: number): void {
    if (index >= 0 && index < this.imagenesGaleria().length) {
      this.indiceSeleccionado.set(index);
      this.resetZoom();
      this.scrollMiniaturaHaciaVista(index);
    }
  }

  fotoAnterior(event?: Event): void {
    event?.stopPropagation();
    const galeria = this.imagenesGaleria();
    if (!galeria.length) return;

    const actual = this.indiceSeleccionado();
    const nuevoIndice = actual <= 0 ? galeria.length - 1 : actual - 1;
    this.seleccionarImagenPorIndice(nuevoIndice);
  }

  fotoSiguiente(event?: Event): void {
    event?.stopPropagation();
    const galeria = this.imagenesGaleria();
    if (!galeria.length) return;

    const actual = this.indiceSeleccionado();
    const nuevoIndice = actual === galeria.length - 1 ? 0 : actual + 1;
    this.seleccionarImagenPorIndice(nuevoIndice);
  }

  private scrollMiniaturaHaciaVista(index: number): void {
    if (!this.contenedorMiniaturas?.nativeElement) return;

    const contenedor = this.contenedorMiniaturas.nativeElement;
    const miniatura = contenedor.children[index] as HTMLElement;

    miniatura?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.modalFotoAbierto()) return;

    if (event.key === 'ArrowRight') {
      this.fotoSiguiente();
    } else if (event.key === 'ArrowLeft') {
      this.fotoAnterior();
    } else if (event.key === 'Escape') {
      this.cerrarModalFoto();
    }
  }

  // ==========================================
  // CONTROL DE MODAL Y ZOOM
  // ==========================================

  abrirModalFoto(): void {
    this.modalFotoAbierto.set(true);
    this.resetZoom();
  }

  cerrarModalFoto(): void {
    this.modalFotoAbierto.set(false);
    this.resetZoom();
  }

  resetZoom(): void {
    this.zoom.set(1);
    this.posX.set(0);
    this.posY.set(0);
    this.arrastrando = false;
  }

  zoomMas(event?: Event): void {
    event?.stopPropagation();

    this.zoom.update(valor => {
      const nuevoZoom = Math.min(valor + 0.25, 3);
      return Number(nuevoZoom.toFixed(2));
    });
  }

  zoomMenos(event?: Event): void {
    event?.stopPropagation();

    this.zoom.update(valor => {
      const nuevoZoom = Math.max(valor - 0.25, 1);

      if (nuevoZoom === 1) {
        this.posX.set(0);
        this.posY.set(0);
      }

      return Number(nuevoZoom.toFixed(2));
    });
  }

  onWheelZoom(event: WheelEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (event.deltaY < 0) {
      this.zoomMas();
    } else {
      this.zoomMenos();
    }
  }

  iniciarArrastre(event: MouseEvent | TouchEvent): void {
    if (this.zoom() <= 1) return;

    event.preventDefault();
    event.stopPropagation();

    this.arrastrando = true;
    const punto = this.obtenerPunto(event);

    this.inicioX = punto.x;
    this.inicioY = punto.y;

    this.startPosX = this.posX();
    this.startPosY = this.posY();
  }

  moverImagen(event: MouseEvent | TouchEvent): void {
    if (!this.arrastrando || this.zoom() <= 1) return;

    event.preventDefault();
    event.stopPropagation();

    const punto = this.obtenerPunto(event);

    const deltaX = punto.x - this.inicioX;
    const deltaY = punto.y - this.inicioY;

    this.posX.set(this.startPosX + deltaX);
    this.posY.set(this.startPosY + deltaY);
  }

  finalizarArrastre(event?: MouseEvent | TouchEvent): void {
    event?.stopPropagation();
    this.arrastrando = false;
  }

  private obtenerPunto(event: MouseEvent | TouchEvent): { x: number; y: number } {
    if (event instanceof MouseEvent) {
      return { x: event.clientX, y: event.clientY };
    }

    const touch = event.touches[0] || event.changedTouches[0];
    return { x: touch.clientX, y: touch.clientY };
  }

  get transformImagenModal(): string {
    return `translate(${this.posX()}px, ${this.posY()}px) scale(${this.zoom()})`;
  }

  get puedeMoverImagen(): boolean {
    return this.zoom() > 1;
  }

  // ==========================================
  // FAVORITOS, COMPARADOR Y PDF
  // ==========================================

  private cargarFavoritoDetalle(idiomaCode?: string): void {
    const usuario = this.voService.usuarioActual;
    const vehiculo = this.vehiculo();

    if (!usuario || !vehiculo) return;

    const lang = (idiomaCode || this.idiomaService.getCodigo()).toLowerCase();

    this.voService.getFavoritos({
      idioma: lang,
      idUsr: usuario.numUsuario.toString()
    }).subscribe({
      next: favoritos => {
        this.esFavorito.set(
          favoritos.some(x => x.idStoc.toString() === vehiculo.idStoc.toString())
        );
      },
      error: err => console.error(err)
    });
  }

  toggleFavorito(): void {
    const usuario = this.voService.usuarioActual;
    const vehiculo = this.vehiculo();

    if (!vehiculo) return;

    if (!usuario) {
      this.accionPendiente = 'favorito';
      this.mostrarLoginModal.set(true);
      return;
    }

    const estadoActual = this.esFavorito();
    this.esFavorito.set(!estadoActual);

    const body = {
      idUsr: usuario.numUsuario.toString(),
      idStoc: vehiculo.idStoc.toString()
    };

    if (estadoActual) {
      this.voService.delFavorito(body).subscribe({
        next: () => {},
        error: (err: any) => {
          console.error(err);
          this.esFavorito.set(true);
        }
      });
    } else {
      this.voService.addFavoritos(body).subscribe({
        next: () => {},
        error: (err: any) => {
          console.error(err);
          this.esFavorito.set(false);
        }
      });
    }
  }

  cerrarLoginModal(): void {
    this.mostrarLoginModal.set(false);
    const usuario = this.voService.usuarioActual;

    if (!usuario) {
      this.accionPendiente = null;
      return;
    }

    if (this.accionPendiente === 'favorito') {
      this.accionPendiente = null;
      this.cargarFavoritoDetalle();
      this.toggleFavorito();
    }
  }

  isEnComparador = computed(() => {
    const veh = this.vehiculo();
    if (!veh?.idStoc) return false;

    return this.comparadorService
      .vehiculosComparador()
      .includes(veh.idStoc.toString());
  });

  toggleComparar(): void {
    const veh = this.vehiculo();
    if (!veh?.idStoc || !veh?.tipoVeh) return;

    if (this.isEnComparador()) {
      this.comparadorService.removeVehiculo(veh.idStoc.toString());
      return;
    }

    const resultado = this.comparadorService.addVehiculo(
      veh.idStoc.toString(),
      veh.tipoVeh
    );

    switch (resultado) {
      case 'TIPO':
        alert(`Solo puedes comparar vehículos del tipo "${this.comparadorService.tipoActual()}".`);
        break;
      case 'MAXIMO':
        alert('Solo puedes comparar un máximo de 2 vehículos.');
        break;
    }
  }

  estaComparado(idStoc: string): boolean {
    return this.comparadorService
      .vehiculosComparador()
      .includes(idStoc);
  }

  toggleCompararVehiculo(idStoc: string, tipoVeh: string): void {
    if (this.estaComparado(idStoc)) {
      this.comparadorService.removeVehiculo(idStoc);
      return;
    }

    const resultado = this.comparadorService.addVehiculo(
      idStoc,
      tipoVeh.trim()
    );

    switch (resultado) {
      case 'TIPO':
        alert(`Solo puedes comparar vehículos del tipo "${this.comparadorService.tipoActual()}".`);
        break;
      case 'MAXIMO':
        alert('Solo puedes comparar un máximo de 2 vehículos.');
        break;
    }
  }

  descargarFicha(fichaMini: boolean): void {
    const vehiculo = this.vehiculo();
    if (!vehiculo) return;

    // 1. Abrimos la ventana inmediatamente para evitar que el navegador la bloquee como pop-up
    const ventanaPdf = window.open('', '_blank');
    if (ventanaPdf) {
      ventanaPdf.document.write('<p style="font-family: sans-serif; padding: 20px;">Generando documento PDF, por favor espere...</p>');
    }

    const data: Ficha = {
      idioma: this.idiomaService.getCodigo(),
      idStocs: [vehiculo.idStoc.toString()],
      portada: true,
      anexos: false,
      mostrarPrecio: false,
      mostrarGarantia: false,
      fichaMini
    };

    this.voService.obtenerFicha(data).subscribe({
      next: (respuesta: any) => {
        try {

          // Extraemos el string base64 si viene dentro de un objeto o directamente
          let rawBase64 = typeof respuesta === 'string' ? respuesta : (respuesta?.data || respuesta?.pdf || '');

          // Limpiamos comillas extra, espacios y prefijos Data-URI si existen
          rawBase64 = rawBase64
            .trim()
            .replace(/^"(.*)"$/, '$1')
            .replace(/^data:application\/pdf;base64,/, '');

          if (!rawBase64) {
            throw new Error('El contenido PDF recibido está vacío.');
          }

          // Convertimos Base64 a ArrayBuffer (admite textos largos sin desbordamiento)
          const binaryString = window.atob(rawBase64);
          const len = binaryString.length;
          const bytes = new Uint8Array(len);

          for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }

          const pdfBlob = new Blob([bytes], { type: 'application/pdf' });
          const blobUrl = URL.createObjectURL(pdfBlob);

          // Si pudimos abrir la pestaña previamente, redirigimos ahí la URL del Blob
          if (ventanaPdf && !ventanaPdf.closed) {
            ventanaPdf.location.href = blobUrl;
          } else {
            // Alternativa: Descarga directa de respaldo si la pestaña emergente no abrió
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `ficha_${vehiculo.idStoc}_${fichaMini ? 'mini' : 'completa'}.pdf`;
            link.click();
          }

        } catch (err) {
          console.error('Error al procesar el PDF:', err);
          if (ventanaPdf && !ventanaPdf.closed) {
            ventanaPdf.document.body.innerHTML = '<p style="color: red; font-family: sans-serif; padding: 20px;">Error al procesar el archivo PDF.</p>';
          }
        }
      },
      error: (err) => {
        console.error('Error en la llamada al servicio de PDF:', err);
        if (ventanaPdf && !ventanaPdf.closed) {
          ventanaPdf.document.body.innerHTML = '<p style="color: red; font-family: sans-serif; padding: 20px;">No se pudo obtener la ficha PDF del servidor.</p>';
        }
      }
    });
  }

  get estaLogueado(): boolean {
    return !!this.voService.usuarioActual;
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


  irAlFormulario(): void {
    this.formularioRef()?.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

}
