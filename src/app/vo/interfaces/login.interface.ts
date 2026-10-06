export interface UsrData {
  eMail: string;
  pwd: string;
  ip: string;
  nombre: string;
  id: string;
  tipoAcceso: string;
}


export interface LoginResponse {
  numUsuario: number;
  mail?: string;
  authenticated: boolean;
}


export interface ClaimDto {
  tipo: string;
  valor: string;
}

export interface ClaimsResponse {
  authenticated: boolean;
  usuario: string;
  claims: ClaimDto[];
}

export interface LogoutResponse {
  ok: boolean;
  mensaje: string;
}

export interface RegistraUsrData {
  idioma?: string;
  ip?: string;
  eMail: string;
  pwd: string;
  aceptaEnvio?: string;
  nombre?: string;
  tfn?: string;
  provincia?: string;
  obs?: string;
}

export interface UsrActivarData {
  token: string;
}

export interface PwdForgotData {
  idioma?: string;
  eMail: string;
}

export interface ResetPwdData {
  mail: string;
  nuevaPassword: string;
  token: string;
}
