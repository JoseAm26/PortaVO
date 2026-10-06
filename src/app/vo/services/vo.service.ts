import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environments } from '../../../environments/environments';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Destacado } from '../interfaces/destacado.interface';
import { ImagenesVehData, ImagenesVehDto } from '../interfaces/imagenes.interface';
import { FiltroData, FiltroDto } from '../interfaces/filtro.interface';
import { VehiculoData, VehiculoDto } from '../interfaces/vehiculos.interface';
import { FichaData, FichaDto } from '../interfaces/detalles.interface';
import { RelacionadoData, RelacionadoDto } from '../interfaces/relacionados.interface';
import { ClaimsResponse, LoginResponse, LogoutResponse, PwdForgotData, RegistraUsrData, ResetPwdData, UsrActivarData, UsrData } from '../interfaces/login.interface';
import { FavoritoCData, FavoritoDataAdd, FavoritoDto } from '../interfaces/favorito.interface';
import { BusquedaData, BusquedaDData, BusquedaDto } from '../interfaces/busqueda.interface';
import { LlamarData, SolicitudData } from '../interfaces/formularios.interface';
import { PeticionData } from '../interfaces/peticion.interface';
import { IdiomaService } from './idioma.service';
import { Ficha } from '../interfaces/ficha.interface';

declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class VoService {

  private http = inject(HttpClient);
  private idiomaService = inject(IdiomaService);

  private readonly usuarioSubject = new BehaviorSubject<LoginResponse | null>(null);
  usuario$ = this.usuarioSubject.asObservable();

  private readonly baseUrl = environments.baseUrl;
  private isGoogleScriptLoaded = false;

  private get idioma(): string {
    return this.idiomaService.getCodigo();
  }

  /**
   * Carga el SDK de Google en memoria únicamente cuando es invocado por primera vez.
   */
  public loadGoogleSdk(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isGoogleScriptLoaded && typeof google !== 'undefined' && google.accounts?.oauth2) {
        resolve();
        return;
      }

      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }

      let retries = 0;
      const checkInterval = setInterval(() => {
        retries++;
        if (typeof google !== 'undefined' && google.accounts?.oauth2) {
          clearInterval(checkInterval);
          this.isGoogleScriptLoaded = true;
          resolve();
        } else if (retries > 50) {
          clearInterval(checkInterval);
          reject(new Error('No se pudo cargar el cliente Google OAuth2.'));
        }
      }, 100);
    });
  }

  getDestacados(): Observable<Destacado[]> {
    const params = new HttpParams().set('Idioma', this.idioma);
    return this.http.get<Destacado[]>(`${this.baseUrl}/VO/Destacados`, { params });
  }

  getImagenes(idStk: string[], modo: number): Observable<ImagenesVehDto> {
    const body: ImagenesVehData = { idStk, modo };
    return this.http.post<ImagenesVehDto>(this.baseUrl + '/VO/Imagenes', body);
  }

  getFiltros(): Observable<FiltroDto> {
    const body: FiltroData = { idioma: this.idioma };
    return this.http.post<FiltroDto>(`${this.baseUrl}/VO/Filtros`, body);
  }

  getVehiculos(filtro: VehiculoData): Observable<VehiculoDto[]> {
    const body: VehiculoData = {
      ...filtro,
      idioma: this.idiomaService.getCodigo()
    };
    return this.http.post<VehiculoDto[]>(`${this.baseUrl}/VO/Vehiculos`, body);
  }

  getFicha(ficha: FichaData): Observable<FichaDto> {
    const body: FichaData = {
      ...ficha,
      aIdioma: this.idiomaService.getCodigo()
    };
    return this.http.post<FichaDto>(`${this.baseUrl}/VO/Ficha`, body);
  }

  getRelacionados(data: RelacionadoData): Observable<RelacionadoDto> {
    const body: RelacionadoData = {
      ...data,
      idioma: this.idiomaService.getCodigo()
    };
    return this.http.post<RelacionadoDto>(`${this.baseUrl}/VO/Relacionados`, body);
  }

  getFavoritos(data: FavoritoCData): Observable<FavoritoDto[]> {
    const body: FavoritoCData = {
      ...data,
      idioma: this.idiomaService.getCodigo()
    };
    return this.http.post<FavoritoDto[]>(`${this.baseUrl}/VO/Favoritos`, body, { withCredentials: true });
  }

  addFavoritos(data: FavoritoDataAdd): Observable<number> {
    return this.http.post<number>(`${this.baseUrl}/VO/AddFavorito`, data, { withCredentials: true });
  }

  delFavorito(data: FavoritoDataAdd): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseUrl}/VO/DelFavorito`, data, { withCredentials: true });
  }

  getBusquedas(idUsr: string): Observable<BusquedaDto[]> {
    return this.http.get<BusquedaDto[]>(`${this.baseUrl}/VO/Busquedas`, { params: { IdUsr: idUsr }, withCredentials: true });
  }

  delBusqueda(data: BusquedaDData): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseUrl}/VO/DelBusqueda`, data, { withCredentials: true });
  }

  guardarBusqueda(data: BusquedaData): Observable<number> {
    return this.http.post<number>(`${this.baseUrl}/VO/GuardaBusqueda`, data, { withCredentials: true });
  }

  teLlamamos(data: LlamarData): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseUrl}/VO/TeLlamamos`, data);
  }

  solicitud(data: SolicitudData): Observable<boolean> {
    const body: SolicitudData = {
      ...data,
      idioma: this.idiomaService.getCodigo()
    };
    return this.http.post<boolean>(`${this.baseUrl}/VO/Solicitud`, body);
  }

  eviarPeticion(data: PeticionData): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseUrl}/VO/EnvPeticion`, data, { withCredentials: true });
  }

  obtenerFicha(data: Ficha): Observable<string> {
    return this.http.post(`${this.baseUrl}/VO/UsadosFicha`, data, { responseType: 'text' });
  }

  login(data: UsrData): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/VO/ValidarUsr`, data, { withCredentials: true });
  }

  registrarUsuario(data: RegistraUsrData): Observable<number> {
    return this.http.post<number>(`${this.baseUrl}/VO/RegistrarUsr`, data);
  }

  registrarUsuarioGoogle(data: RegistraUsrData): Observable<number> {
    return this.http.post<number>(`${this.baseUrl}/VO/RegistrarUsrGoogle`, data);
  }

  comporbarToken(token: string): Observable<string> {
    const params = new HttpParams().set('token', token);
    return this.http.post(`${this.baseUrl}/VO/ComprobarToken`, null, { params, responseType: 'text' });
  }

  activarUsuario(data: UsrActivarData): Observable<number> {
    return this.http.post<number>(`${this.baseUrl}/VO/ActivarUsr`, data);
  }

  pwdForgot(data: PwdForgotData): Observable<boolean> {
    const body: PwdForgotData = {
      ...data,
      idioma: this.idiomaService.getCodigo()
    };
    return this.http.post<boolean>(`${this.baseUrl}/VO/PwdForgot`, body);
  }

  resetPwd(data: ResetPwdData): Observable<boolean> {
    const params = new HttpParams()
      .set('mail', data.mail)
      .set('nuevaPassword', data.nuevaPassword)
      .set('token', data.token);

    return this.http.post<boolean>(`${this.baseUrl}/VO/ResetPWD`, null, { params });
  }

  logout(): Observable<LogoutResponse> {
    return this.http.post<LogoutResponse>(`${this.baseUrl}/VO/Logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        this.usuarioSubject.next(null);
      })
    );
  }

  cargarUsuario(): Observable<ClaimsResponse> {
    return this.http.get<ClaimsResponse>(`${this.baseUrl}/VO/Claims`, { withCredentials: true }).pipe(
      tap(resp => {
        const email = resp.claims.find(x => x.tipo === 'Email')?.valor ?? '';
        const numUsuarioClaim = resp.claims.find(x => x.tipo === 'NumUsuario')?.valor ?? 0;
        const numUsuario = numUsuarioClaim ? parseInt(numUsuarioClaim, 10) : 0;

        this.usuarioSubject.next({
          authenticated: resp.authenticated,
          mail: email,
          numUsuario
        });
      })
    );
  }

  get usuarioActual(): LoginResponse | null {
    return this.usuarioSubject.value;
  }
}
