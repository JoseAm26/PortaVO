import { Component, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// 2. Importa los iconos de FontAwesome
import {
  faImage,
  faMapLocationDot,
  faLocationDot,
  faClock,
  faPhone,
  faMapPin,
  faGears,
  faScrewdriverWrench
} from '@fortawesome/free-solid-svg-icons';

interface Delegacion {
  nombre: string;
  direccion: string;
  telefono: string;
  horario: string;
  imagen: string;
  iframeUrlRaw: string;
  iframeUrl?: SafeResourceUrl;
  enlaceComoLlegar: string;
  mostrarMapa: boolean;
  // Nuevas rutas específicas de Angular por delegación
  rutaRecambios: string;
  rutaPostventa: string;
}

@Component({
  selector: 'app-delegaciones.component',
  standalone: true,
  imports: [RouterLink, TranslatePipe, FontAwesomeModule],
  templateUrl: './delegaciones.component.html',
  styleUrl: './delegaciones.component.scss',
})
export default class DelegacionesComponent {

  faImage = faImage;
  faMapLocationDot = faMapLocationDot;
  faLocationDot = faLocationDot;
  faClock = faClock;
  faPhone = faPhone;
  faMapPin = faMapPin;
  faGears = faGears;
  faScrewdriverWrench = faScrewdriverWrench;

  private sanitizer = inject(DomSanitizer);

  delegaciones: Delegacion[] = [
    {
      nombre: 'Almería',
      direccion: 'A-1000, nº 32, 04230 Huércal de Almería (Almería)',
      telefono: '950 21 20 00',
      horario: 'Lunes a Viernes: 08:30 - 13:30, 15:30 - 19:00 | Sábado: 08:30 - 13:00',
      imagen: '/assets/img/delegaciones/Almeria.webp',
      iframeUrlRaw: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7572.0471889068285!2d-2.4450412237276615!3d36.87287646359857!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd7a9e383002b7af%3A0xf14084439bda7e92!2sVeinsur%2C%20S.A.U.!5e1!3m2!1ses!2sus!4v1784031230882!5m2!1ses!2sus',
      enlaceComoLlegar: 'https://maps.app.goo.gl/9KAzK1PXmXZbSLCh9',
      mostrarMapa: false,
      rutaPostventa: '/delegaciones/postventa/almeria',
      rutaRecambios: '/delegaciones/recambios/almeria'
    },
    {
      nombre: 'Granada',
      direccion: 'Ctra. Lachar, sect. SI-2. A-92, salida 225 18339 Cijuela (Granada)',
      telefono: '958 411 600',
      horario: 'Lunes a Viernes de 8:00 a 19:00. Sábado de 8:00 a 13:00.',
      imagen: '/assets/img/delegaciones/Granada.webp',
      iframeUrlRaw: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1884.5909260338085!2d-3.819826711170414!3d37.19599712898627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd7200da12146029%3A0x6f2ee97bca8736bd!2sVeinsur%2C%20S.A.U.!5e1!3m2!1ses!2sus!4v1784031560918!5m2!1ses!2sus',
      enlaceComoLlegar: 'https://maps.app.goo.gl/eW7b9a5SvqU6uA548',
      mostrarMapa: false,
      rutaRecambios: '/delegaciones/recambios/granada',
      rutaPostventa: '/delegaciones/postventa/granada'
    },
    {
      nombre: 'Antas',
      direccion: 'Pol. Ind. El Real Calle Vente Vacío nº 3 04628 Antas (Almería)',
      telefono: '950 203 289',
      horario: 'Lunes a Viernes de 8:00 a 19:00. Sábado de 9:00 a 13:00.',
      imagen: '/assets/img/delegaciones/Antas.webp',
      iframeUrlRaw: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1123.5498170771414!2d-1.9009814579851876!3d37.26195672525293!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd7ad5d4cc676ed7%3A0x2ea25925b16fc26c!2sVeinsur%2C%20S.A.U.!5e1!3m2!1ses!2sus!4v1784031675806!5m2!1ses!2sus',
      enlaceComoLlegar: 'https://maps.app.goo.gl/kmJXbmZp6u1gnJtM7',
      mostrarMapa: false,
      rutaRecambios: '/delegaciones/recambios/antas',
      rutaPostventa: '/delegaciones/postventa/antas'
    },
    {
      nombre: 'Málaga',
      direccion: 'Parque Industrial Trévenez. Calle Prokofiev 1, 3 y 5. 29590 Málaga',
      telefono: '952 243 866',
      horario: 'Lunes a Viernes de 8:00 a 19:00. Sábado de 8:00 a 13:00.',
      imagen: '/assets/img/delegaciones/Malaga.webp',
      iframeUrlRaw: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1131.9919440389583!2d-4.51876810976701!3d36.711907851442675!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd72f0895abe004b%3A0xf4fcd1e6d9df6471!2sVeinsur!5e1!3m2!1ses!2sus!4v1784032553813!5m2!1ses!2sus',
      enlaceComoLlegar: 'https://maps.app.goo.gl/KYTaLgcaegN7N1QdA',
      mostrarMapa: false,
      rutaRecambios: '/delegaciones/recambios/malaga',
      rutaPostventa: '/delegaciones/postventa/malaga'
    },
    {
      nombre: 'Jaén',
      direccion: 'Polígono Industrial Guadiel, Avenida Linares, 17 B, 23210 Guarromán, (Jaén)',
      telefono: '953 678 200',
      horario: 'Lunes a Viernes de 6:00 a 22:00. Sábado y Domingo de 8:00 a 21:00.',
      imagen: '/assets/img/delegaciones/Jaen.webp',
      iframeUrlRaw: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2190.9524433428314!2d-3.7209998414673717!3d38.14646404525692!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd6e9da47e9fb8e3%3A0x2c7523cf6cc43f88!2sVeinsur%2C%20S.A.U.!5e1!3m2!1ses!2sus!4v1784032685742!5m2!1ses!2sus',
      enlaceComoLlegar: 'https://maps.app.goo.gl/Rim37TNyewcRvHp18',
      mostrarMapa: false,
      rutaRecambios: '/delegaciones/recambios/jaen',
      rutaPostventa: '/delegaciones/postventa/jaen'
    },
    {
      nombre: 'Córdoba',
      direccion: 'Pol. Ind. Las Quemadas, Parcela 50, Calle José de Gálvez y Aranda s/n 14014 (Córdoba)',
      telefono: '957 325 877',
      horario: 'Lunes a Viernes de 8:00 a 19:00. Sábado de 9:00 a 13:00.',
      imagen: '/assets/img/delegaciones/Cordoba.webp',
      iframeUrlRaw: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1319.7266207899563!2d-4.718141381690952!3d37.90434394678959!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd6ce00ab7a2dcbb%3A0xe52be134116d5bcb!2sVeinsur!5e1!3m2!1ses!2sus!4v1784038596525!5m2!1ses!2sus',
      enlaceComoLlegar: 'https://maps.app.goo.gl/vmn1zv6G8N4yiKXAA',
      mostrarMapa: false,
      rutaRecambios: '/delegaciones/recambios/cordoba',
      rutaPostventa: '/delegaciones/postventa/cordoba'
    },
    {
      nombre: 'Sevilla',
      direccion: 'Autovía A-92, Km 5 41500 Alcalá de Guadaira (Sevilla)',
      telefono: '955 632 050',
      horario: 'Lunes a Viernes de 8:00 a 19:00. Sábado de 8:00 a 13:00.',
      imagen: '/assets/img/delegaciones/Sevilla.webp',
      iframeUrlRaw: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3760.9153535123974!2d-5.886714099999999!3d37.37651109999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd126504bbed08bb%3A0x26ca43825544e297!2sVeinsur%2C%20S.A.U.!5e1!3m2!1ses!2sus!4v1784038771759!5m2!1ses!2sus',
      enlaceComoLlegar: 'https://maps.app.goo.gl/KVQnozdaQSkccwuM6',
      mostrarMapa: false,
      rutaRecambios: '/delegaciones/recambios/sevilla',
      rutaPostventa: '/delegaciones/postventa/sevilla'
    }
  ];

  constructor() {
    this.delegaciones = this.delegaciones.map(del => ({
      ...del,
      iframeUrl: this.sanitizer.bypassSecurityTrustResourceUrl(del.iframeUrlRaw)
    }));
  }
}

