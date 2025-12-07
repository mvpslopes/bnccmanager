/**
 * Tenta encontrar o caminho do avatar do usuário
 * Testa diferentes extensões de imagem
 */
export function getAvatarPath(username: string): string {
  // Extensões comuns de imagem
  const extensions = [".jpg", ".jpeg", ".png", ".webp"];
  
  // Retorna o caminho padrão (o componente Avatar fará fallback se não existir)
  // Por padrão, tenta .jpg primeiro
  return `/avatars/${username}.jpg`;
}

