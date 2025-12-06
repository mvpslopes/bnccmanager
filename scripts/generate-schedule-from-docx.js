/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const mammoth = require("mammoth");

/**
 * Heurística de parsing (ajustada para o formato real do Word):
 * - Linhas como "Segunda-Feira (08/12)" são tratadas como novos dias.
 * - Linhas que começam com "Link ..." / "Links ..." / "Atividades ..." viram seções.
 * - Linhas com URL viram recursos.
 *   - Se tiver texto + URL na mesma linha, o texto é o título.
 *   - Senão, usamos a linha de texto imediatamente anterior como título.
 * - O tipo é inferido pelo domínio/palavras-chave (zoom/forms/drive/youtube).
 *
 * Ajuste os padrões abaixo se o formato do Word mudar.
 */

const WORD_FILE_NAME = "Links 2ª Turma.docx";

function inferTypeFromText(text, url) {
  const lower = (text || "").toLowerCase();
  const lowerUrl = (url || "").toLowerCase();

  if (lower.includes("zoom") || lowerUrl.includes("zoom.us")) {
    return "zoom";
  }
  if (
    lower.includes("form") ||
    lowerUrl.includes("forms.gle") ||
    lowerUrl.includes("docs.google.com/forms")
  ) {
    return "form";
  }
  if (
    lower.includes("recurso") ||
    lower.includes("material") ||
    lowerUrl.includes("drive.google.com")
  ) {
    return "recurso";
  }

  return "outro";
}

function parseTextToSchedule(text) {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const urlRegex = /(https?:\/\/\S+)/i;
  // Ex.: "Segunda-Feira (08/12)", "Terça-Feira (09/12)", etc.
  const dayHeaderRegex = /^.+\(\d{2}\/\d{2}\)\s*$/;

  const days = [];
  let currentDay = null;
  let orderCounter = 1;
  let pendingTitle = "";
  let currentSection = null;

  for (const line of lines) {
    // 1) Detecta início de um novo dia
    if (dayHeaderRegex.test(line)) {
      const dateMatch = line.match(/\((\d{2}\/\d{2})\)/);
      currentDay = {
        id: `dia-${orderCounter}`,
        label: line,
        order: orderCounter++,
        date: dateMatch ? dateMatch[1] : undefined,
        sections: []
      };
      days.push(currentDay);
      pendingTitle = "";
      currentSection = null;
      continue;
    }

    // Se ainda não há dia atual, ignoramos (cabeçalhos anteriores, etc.)
    if (!currentDay) {
      continue;
    }

    // 2) Linhas com URL viram recursos
    const urlMatch = line.match(urlRegex);
    if (urlMatch) {
      const url = urlMatch[1];
      const titleText = (
        line.replace(urlRegex, "").replace(/[:\-–]+$/, "").trim() ||
        pendingTitle
      ).trim();
      const title = titleText || "Recurso";

      const type = inferTypeFromText(titleText, url);

      // Garante que exista uma seção atual
      if (!currentSection) {
        currentSection = {
          id: "geral",
          label: "Geral",
          items: []
        };
        currentDay.sections.push(currentSection);
      }

      const section = currentSection;
      section.items.push({
        id: `${currentDay.id}-${section.items.length + 1}`,
        title,
        description: "",
        type,
        url
      });

      pendingTitle = "";
      continue;
    }

    // 3) Linhas que definem seções (ex.: "Link Reuniões do Zoom:", "Link Presenças:", "Link Recursos", etc.)
    const lower = line.toLowerCase();
    const isSectionHeader =
      lower.startsWith("link ") ||
      lower.startsWith("links ") ||
      lower.startsWith("atividades ");

    if (isSectionHeader) {
      const label = line.replace(/:\s*$/, "");
      const sectionIdBase = label
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // remove acentos
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      currentSection = {
        id: sectionIdBase || `secao-${(currentDay.sections.length || 0) + 1}`,
        label,
        items: []
      };
      currentDay.sections.push(currentSection);
      pendingTitle = "";
      continue;
    }

    // 4) Linha de descrição/título potencial (sem URL nem marcador de dia ou seção)
    pendingTitle = line;
  }

  return days;
}

async function main() {
  const projectRoot = process.cwd();
  const docxPath = path.join(projectRoot, WORD_FILE_NAME);

  if (!fs.existsSync(docxPath)) {
    console.error(
      `Arquivo ${WORD_FILE_NAME} não encontrado na raiz do projeto (${projectRoot}).`
    );
    process.exit(1);
  }

  console.log(`Lendo ${WORD_FILE_NAME}...`);

  const { value: text } = await mammoth.extractRawText({ path: docxPath });

  console.log("Convertendo texto em cronograma estruturado...");
  const schedule = parseTextToSchedule(text);

  const outputDir = path.join(projectRoot, "src", "data");
  const outputPath = path.join(outputDir, "schedule.json");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(schedule, null, 2), "utf8");

  console.log(
    `Cronograma gerado com sucesso em ${path.relative(
      projectRoot,
      outputPath
    )}.`
  );
  console.log(
    `Abra a aplicação (npm run dev) e confira se os dias/links ficaram alinhados com o Word.`
  );
}

main().catch((err) => {
  console.error("Erro ao gerar cronograma a partir do Word:", err);
  process.exit(1);
});


