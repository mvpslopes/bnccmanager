import { useState, useEffect } from "react";

interface AvatarProps {
  src?: string;
  name: string;
  username?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Avatar({ src, name, username, size = "md", className = "" }: AvatarProps) {
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | undefined>(src);
  
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };

  const getInitials = (name: string): string => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Tentar encontrar a imagem com diferentes variações
  useEffect(() => {
    if (!username) return;
    
    const firstName = username.split(".")[0].toLowerCase();
    const extensions = [".PNG", ".png", ".jpg", ".JPG", ".jpeg", ".JPEG", ".webp", ".WEBP"];
    
    // Tentar diferentes combinações
    const possiblePaths = [
      `/avatars/${firstName}.PNG`,
      `/avatars/${firstName}.png`,
      `/avatars/${username}.PNG`,
      `/avatars/${username}.png`,
      `/avatars/${username}.jpg`,
      `/avatars/${firstName}.jpg`,
    ];
    
    // Se já tem um src definido, usa ele primeiro
    if (src) {
      setImageSrc(src);
      return;
    }
    
    // Tenta o primeiro caminho (mais comum baseado nos arquivos)
    setImageSrc(possiblePaths[0]);
  }, [username, src]);

  const initials = getInitials(name);
  const showImage = imageSrc && !imageError;

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-semibold bg-primary-500 text-white border-2 border-gray-700 overflow-hidden flex-shrink-0 ${className}`}
      style={{ aspectRatio: "1/1" }}
    >
      {showImage ? (
        <img
          src={imageSrc}
          alt={name}
          className="w-full h-full object-cover rounded-full"
          style={{ 
            objectFit: "cover",
            objectPosition: "center"
          }}
          onError={() => {
            setImageError(true);
            setImageSrc(undefined);
          }}
        />
      ) : (
        <span className="select-none">{initials}</span>
      )}
    </div>
  );
}

