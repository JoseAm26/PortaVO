import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VoService } from '../../../services/vo.service';
import { UsrActivarData } from '../../../interfaces/login.interface';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-activar.component',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './activar.component.html',
  styleUrl: './activar.component.scss',
})
export default class ActivarComponent implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly voService = inject(VoService);

  cargando = signal(true);
  exito = signal(false);
  mensaje = signal('Activando cuenta...');

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token');

    if (!token) {
      this.cargando.set(false);
      this.exito.set(false);
      this.mensaje.set('El enlace de activación no es válido.');
      return;
    }

    const data: UsrActivarData = { token };

    this.voService.activarUsuario(data).subscribe({
      next: resultado => {
        this.cargando.set(false);

        if (resultado > 0) {
          this.exito.set(true);
          this.mensaje.set('Tu cuenta ha sido activada correctamente.');
        } else {
          this.exito.set(false);
          this.mensaje.set('No ha sido posible activar la cuenta.');
        }
      },
      error: err => {
        console.error(err);
        this.cargando.set(false);
        this.exito.set(false);
        this.mensaje.set('El enlace ha expirado o no es válido.');
      }
    });
  }

  aceptar(): void {
    if (this.exito()) {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/']);
    }
  }
}
