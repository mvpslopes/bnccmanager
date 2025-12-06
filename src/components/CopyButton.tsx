import { useState } from "react";

interface CopyButtonProps {
  textToCopy: string;
  variant?: "primary" | "ghost";
  label?: string;
}

export function CopyButton({ textToCopy, variant = "primary", label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Erro ao copiar para a área de transferência", error);
    }
  };

  const baseClasses =
    "inline-flex items-center gap-1.5 rounded-lg text-xs font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2";

  const variants: Record<Required<CopyButtonProps>["variant"], string> = {
    primary:
      "bg-primary-500 text-white hover:bg-primary-600 px-3 py-2 shadow-sm hover:shadow-md",
    ghost:
      "bg-gray-700 text-gray-300 hover:bg-gray-600 px-3 py-2 border border-gray-600 hover:border-gray-500"
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`${baseClasses} ${variants[variant]}`}
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Copiado!
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {label || "Copiar link"}
        </>
      )}
    </button>
  );
}


