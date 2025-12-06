import type { ResourceItem } from "../data/schedule";
import { CopyButton } from "./CopyButton";
import { TypeTag } from "./TypeTag";

interface ResourceCardProps {
  item: ResourceItem;
}

export function ResourceCard({ item }: ResourceCardProps) {
  const fullText = `${item.title}\n${item.description ?? ""}\n${item.url}`;

  const domain = (() => {
    try {
      const url = new URL(item.url);
      return url.hostname.replace(/^www\./, "");
    } catch {
      return "";
    }
  })();

  return (
    <article className="rounded-xl border border-gray-700 bg-gray-800 p-5 shadow-sm hover:shadow-md transition-all duration-150">
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-100 leading-snug">
              {item.title}
            </h3>
            {item.description && (
              <p className="mt-1.5 text-xs text-gray-400 leading-relaxed">
                {item.description}
              </p>
            )}
          </div>
          <TypeTag type={item.type} />
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-gray-700">
          <span className="text-xs text-gray-400 font-mono truncate max-w-[200px]">
            {domain || item.url}
          </span>
          <span className="text-gray-600">•</span>
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary-500 hover:text-primary-400 font-medium transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Abrir link
          </a>
        </div>

        {item.notes && (
          <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg px-3 py-2">
            <p className="text-xs text-yellow-300 leading-relaxed">
              {item.notes}
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-2">
          <CopyButton textToCopy={item.url} label="Copiar link" />
          <CopyButton
            textToCopy={fullText}
            variant="ghost"
            label="Copiar texto completo"
          />
        </div>
      </div>
    </article>
  );
}


