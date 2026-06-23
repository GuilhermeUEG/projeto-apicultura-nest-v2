export function parseAuthError(error: any): string {
  if (error?.status === 0) {
    return 'Não foi possível conectar ao servidor. Verifique sua conexão.';
  }
  if (error?.error?.error === 'AUTH_USER_INACTIVE') {
    return 'Sua conta está aguardando liberação do administrador.';
  }
  if (error?.error?.error === 'AUTH_INVALID_CREDENTIALS') {
    return 'E-mail ou senha incorretos.';
  }
  if (error?.error?.error === 'AUTH_EMAIL_EXISTS') {
    return 'Este e-mail já está em uso.';
  }
  if (error?.error?.error === 'AUTH_INVALID_TOKEN') {
    return 'O token de recuperação é inválido ou expirou.';
  }
  if (error?.error?.message) {
    if (Array.isArray(error.error.message)) {
      return error.error.message.join(', ');
    }
    return error.error.message;
  }
  return 'Ocorreu um erro inesperado. Tente novamente mais tarde.';
}

export function extractBackendError(error: any): string {
  if (error?.status === 0) {
    return 'Não foi possível conectar ao servidor. Verifique sua conexão.';
  }
  const body = error?.error;
  if (body) {
    if (body.message) {
      if (Array.isArray(body.message)) {
        return body.message.join(', ');
      }
      return body.message;
    }
  }
  return error?.message || 'Ocorreu um erro inesperado no servidor.';
}

export function extractFieldErrors(error: any): Record<string, string> {
  const body = error?.error;
  if (body && body.errors) {
    return body.errors;
  }
  return {};
}
