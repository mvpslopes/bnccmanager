import { useMemo, useState, useEffect } from "react";
import { useAuth } from "./contexts/AuthContext";
import { LoginPage } from "./pages/LoginPage";
import { LoadingScreen } from "./components/LoadingScreen";
import { Layout } from "./components/Layout";
import { DayCard } from "./components/DayCard";
import { ResourceCard } from "./components/ResourceCard";
import { schedule, type DaySchedule, type ResourceItem } from "./data/schedule";

type ResourceTypeFilter = "todos" | "zoom" | "form" | "recurso" | "outro";

function filterResources(
  items: ResourceItem[],
  search: string,
  type: ResourceTypeFilter
): ResourceItem[] {
  return items.filter((item) => {
    const matchesType = type === "todos" ? true : item.type === type;
    const normalizedSearch = search.trim().toLowerCase();

    const matchesSearch =
      !normalizedSearch ||
      item.title.toLowerCase().includes(normalizedSearch) ||
      (item.description ?? "").toLowerCase().includes(normalizedSearch);

    return matchesType && matchesSearch;
  });
}

function getFlatResources(day: DaySchedule): { sectionId: string; sectionLabel: string; item: ResourceItem }[] {
  return day.sections.flatMap((section) =>
    section.items.map((item) => ({
      sectionId: section.id,
      sectionLabel: section.label,
      item
    }))
  );
}

function DashboardContent() {
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [selectedDayId, setSelectedDayId] = useState<string | null>(
    schedule[0]?.id ?? null
  );
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<ResourceTypeFilter>("todos");

  useEffect(() => {
    // Simular carregamento dos dados do dashboard
    const timer = setTimeout(() => {
      setIsLoadingData(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const sortedDays = useMemo(
    () => [...schedule].sort((a, b) => a.order - b.order),
    []
  );

  const selectedDay = useMemo(
    () => sortedDays.find((day) => day.id === selectedDayId) ?? sortedDays[0],
    [sortedDays, selectedDayId]
  );

  const flatResources = useMemo(
    () => (selectedDay ? getFlatResources(selectedDay) : []),
    [selectedDay]
  );

  const filteredResources = useMemo(
    () =>
      flatResources.filter(({ item }) =>
        filterResources([item], search, typeFilter).length > 0
      ),
    [flatResources, search, typeFilter]
  );

  if (isLoadingData) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-xl mb-6 shadow-lg animate-pulse">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
            </div>
            <h2 className="text-lg font-semibold text-gray-100 mb-1">
              Carregando recursos
            </h2>
            <p className="text-sm text-gray-400">
              Organizando os links e materiais...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="grid gap-8 lg:grid-cols-[280px,1fr]">
        <section aria-label="Dias do curso" className="space-y-5">
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 shadow-sm">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Dias do curso
            </h2>
            <p className="text-xs text-gray-300 leading-relaxed">
              Selecione um dia para ver os links de aula, formulários e materiais correspondentes.
            </p>
          </div>

          <div className="space-y-2">
            {sortedDays.map((day) => (
              <DayCard
                key={day.id}
                day={day}
                isSelected={day.id === selectedDay?.id}
                onSelect={() => setSelectedDayId(day.id)}
              />
            ))}
          </div>
        </section>

        <section aria-label="Recursos do dia selecionado" className="space-y-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-sm">
            <header className="mb-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h2 className="text-xl font-semibold text-gray-100 mb-1">
                    {selectedDay?.label ?? "Selecione um dia"}
                  </h2>
                  {selectedDay?.date && (
                    <p className="text-sm text-gray-400">{selectedDay.date}</p>
                  )}
                </div>
                {selectedDay && (
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary-500">
                      {filteredResources.length}
                    </div>
                    <div className="text-xs text-gray-400 uppercase tracking-wide">
                      recursos
                    </div>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-400">
                Use filtros e busca para localizar rapidamente o link desejado e copie para compartilhar com a turma.
              </p>
            </header>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex-1 max-w-md">
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
                  Buscar por título ou descrição
                </label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Ex.: presença, avaliação, BNCC..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-700 bg-gray-900 text-sm text-gray-100 placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  { id: "todos", label: "Todos" },
                  { id: "zoom", label: "Zoom" },
                  { id: "form", label: "Formulários" },
                  { id: "recurso", label: "Recursos" },
                  { id: "outro", label: "Outros" }
                ].map((filter) => (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() =>
                      setTypeFilter(filter.id as ResourceTypeFilter)
                    }
                    className={`rounded-lg border px-3 py-2 text-xs font-medium transition-all duration-150 ${
                      typeFilter === filter.id
                        ? "border-primary-500 bg-primary-500 text-white shadow-sm"
                        : "border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:border-gray-600"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {filteredResources.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed border-gray-700 bg-gray-800 px-6 py-12 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-medium text-gray-200 mb-1">
                  Nenhum recurso encontrado
                </p>
                <p className="text-xs text-gray-400">
                  Ajuste a busca ou o tipo de recurso para encontrar o que procura.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredResources.map(({ sectionId, sectionLabel, item }) => (
                  <div key={`${sectionId}-${item.id}`} className="flex flex-col gap-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 px-1">
                      {sectionLabel}
                    </p>
                    <ResourceCard item={item} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}

export default function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <DashboardContent />;
}


