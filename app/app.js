const state = {
  data: null,
  entries: [],
  selectedTags: new Set(),
  selectedId: null,
  query: "",
  sort: "score",
  activeTab: "visual",
  visualFilter: "",
};

const categoryLabels = {
  visual_elements: "視覚要素",
  materials: "素材感",
  lighting_air: "光・空気感",
  mood: "雰囲気",
  settings: "場所",
  era_technology: "時代・技術",
  colors: "色",
  motifs: "モチーフ",
};

const els = {
  searchInput: document.querySelector("#searchInput"),
  resetButton: document.querySelector("#resetButton"),
  activeTags: document.querySelector("#activeTags"),
  tagGroups: document.querySelector("#tagGroups"),
  resultList: document.querySelector("#resultList"),
  resultCount: document.querySelector("#resultCount"),
  detailContent: document.querySelector("#detailContent"),
  sortSelect: document.querySelector("#sortSelect"),
  resultTemplate: document.querySelector("#resultTemplate"),
  tabButtons: document.querySelectorAll(".tab-button"),
  visualTab: document.querySelector("#visualTab"),
  dictionaryTab: document.querySelector("#dictionaryTab"),
  missingTab: document.querySelector("#missingTab"),
  visualFilter: document.querySelector("#visualFilter"),
  visualGrid: document.querySelector("#visualGrid"),
  missingList: document.querySelector("#missingList"),
  missingCount: document.querySelector("#missingCount"),
};

init();

async function init() {
  try {
    const response = await fetch("../data/visual-dictionary.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    state.data = await response.json();
    state.entries = state.data.entries || [];
    state.selectedId = state.entries[0]?.id || null;
    bindEvents();
    render();
  } catch (error) {
    document.body.innerHTML = `
      <div class="error-box">
        <h1>辞書データを読み込めませんでした</h1>
        <p>ローカルサーバー経由で開いてください。</p>
        <pre>python scripts/serve.py</pre>
        <p>${escapeHtml(String(error))}</p>
      </div>
    `;
  }
}

function bindEvents() {
  els.searchInput.addEventListener("input", (event) => {
    state.query = event.target.value.trim();
    renderDictionary();
  });

  els.resetButton.addEventListener("click", () => {
    state.query = "";
    state.selectedTags.clear();
    state.visualFilter = "";
    els.searchInput.value = "";
    els.visualFilter.value = "";
    state.selectedId = state.entries[0]?.id || null;
    render();
  });

  els.sortSelect.addEventListener("change", (event) => {
    state.sort = event.target.value;
    renderResults();
  });

  els.tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.activeTab = button.dataset.tab;
      renderTabs();
    });
  });

  els.visualFilter.addEventListener("input", (event) => {
    state.visualFilter = event.target.value.trim();
    renderVisualIndex();
  });
}

function render() {
  renderTabs();
  renderVisualIndex();
  renderDictionary();
  renderMissingImages();
}

function renderTabs() {
  els.tabButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === state.activeTab);
  });
  els.visualTab.classList.toggle("active", state.activeTab === "visual");
  els.dictionaryTab.classList.toggle("active", state.activeTab === "dictionary");
  els.missingTab.classList.toggle("active", state.activeTab === "missing");
}

function renderVisualIndex() {
  const query = state.visualFilter.toLowerCase();
  const entries = state.entries
    .filter((entry) => hasRepresentativeImage(entry))
    .filter((entry) => !query || searchableText(entry).includes(query));

  els.visualGrid.innerHTML = "";
  if (entries.length === 0) {
    els.visualGrid.innerHTML = `
      <div class="empty-visual-message">
        <h3>代表画像が設定済みの項目がありません</h3>
        <p>まずは代表画像未設定一覧を確認し、各項目の representative_image を設定してください。</p>
      </div>
    `;
    return;
  }

  entries.forEach((entry) => {
    els.visualGrid.appendChild(createVisualCard(entry));
  });
}

function createVisualCard(entry) {
  const image = entry.representative_image || {};
  const card = document.createElement("article");
  card.className = "visual-card";
  card.innerHTML = `
    <button class="visual-card-main" type="button" title="詳細を見る">
      <div class="visual-image-wrap">
        <img src="${escapeAttribute(image.thumbnail_url || image.image_url)}" alt="${escapeAttribute(image.alt || entry.name)}" loading="lazy" />
      </div>
      <div class="visual-card-body">
        <h3>${escapeHtml(entry.name)} <span>/ ${escapeHtml(entry.english_name)}</span></h3>
        <p>${escapeHtml(entry.short_description)}</p>
        <div class="tag-list">
          ${mainTags(entry).map((tag) => `<span class="mini-tag">${escapeHtml(tag)}</span>`).join("")}
        </div>
      </div>
    </button>
    <div class="visual-card-actions">
      <button class="ghost-button detail-link" type="button">詳細を見る</button>
      <button class="ghost-button source-link" type="button">画像元を開く</button>
    </div>
  `;

  const openDetail = () => openEntryDetail(entry.id, { scrollToDetail: true, keepSelected: true });
  card.querySelector(".visual-card-main").addEventListener("click", openDetail);
  card.querySelector(".detail-link").addEventListener("click", openDetail);
  card.querySelector(".source-link").addEventListener("click", (event) => {
    event.stopPropagation();
    if (image.source_page_url) {
      window.open(image.source_page_url, "_blank", "noopener,noreferrer");
    }
  });

  return card;
}

function renderMissingImages() {
  const missing = state.entries.filter((entry) => !hasRepresentativeImage(entry));
  els.missingCount.textContent = `${missing.length}件`;
  els.missingList.innerHTML = "";

  missing.forEach((entry) => {
    const card = document.createElement("article");
    card.className = "missing-card";
    card.innerHTML = `
      <button class="placeholder-card" type="button">
        <div class="placeholder-image">
          <strong>${escapeHtml(entry.name)}</strong>
          <span>画像未設定</span>
          <small>代表画像を設定してください</small>
        </div>
        <div class="missing-card-body">
          <h3>${escapeHtml(entry.name)} <span>/ ${escapeHtml(entry.english_name)}</span></h3>
          <p>${escapeHtml(entry.short_description)}</p>
          <div class="tag-list">
            ${mainTags(entry).map((tag) => `<span class="mini-tag">${escapeHtml(tag)}</span>`).join("")}
          </div>
        </div>
      </button>
    `;
    card.querySelector(".placeholder-card").addEventListener("click", () => {
      openEntryDetail(entry.id, { scrollToDetail: true, keepSelected: true });
    });
    els.missingList.appendChild(card);
  });
}

function renderDictionary() {
  renderActiveTags();
  renderTagGroups();
  renderResults();
  renderDetail();
}

function openEntryDetail(entryId, options = {}) {
  state.selectedId = entryId;
  state.activeTab = "dictionary";
  renderTabs();
  renderResults({ keepSelected: options.keepSelected });
  renderDetail();

  if (options.scrollToDetail) {
    requestAnimationFrame(() => {
      scrollToDetail();
    });
  }
}

function scrollToDetail() {
  const stickyOffset = 118;
  const top = els.detailContent.getBoundingClientRect().top + window.scrollY - stickyOffset;
  window.scrollTo({ top: Math.max(0, top), behavior: "auto" });
}

function renderTagGroups() {
  if (!state.data) return;
  els.tagGroups.innerHTML = "";
  const catalog = state.data.tag_catalog || {};

  Object.entries(categoryLabels).forEach(([category, label]) => {
    const tags = catalog[category];
    if (!Array.isArray(tags) || tags.length === 0) return;

    const section = document.createElement("section");
    section.className = "tag-group";
    const title = document.createElement("h3");
    title.textContent = label;
    const list = document.createElement("div");
    list.className = "tag-list";

    tags.forEach((tag) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `tag-chip ${state.selectedTags.has(tag) ? "active" : ""}`;
      button.textContent = tag;
      button.title = `${tag} で絞り込み`;
      button.addEventListener("click", () => toggleTag(tag));
      list.appendChild(button);
    });

    section.append(title, list);
    els.tagGroups.appendChild(section);
  });
}

function renderActiveTags() {
  const tags = Array.from(state.selectedTags);
  els.activeTags.innerHTML = "";
  if (tags.length === 0) {
    els.activeTags.textContent = "タグ未選択";
    els.activeTags.className = "tag-list empty-state";
    return;
  }

  els.activeTags.className = "tag-list";
  tags.forEach((tag) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "tag-chip active";
    button.textContent = `${tag} ×`;
    button.title = `${tag} を解除`;
    button.addEventListener("click", () => toggleTag(tag));
    els.activeTags.appendChild(button);
  });
}

function renderResults(options = {}) {
  const matches = getMatches();
  els.resultCount.textContent = `${matches.length}件`;
  els.resultList.innerHTML = "";

  if (!options.keepSelected && !matches.some((item) => item.entry.id === state.selectedId)) {
    state.selectedId = matches[0]?.entry.id || null;
  }

  matches.forEach(({ entry, score, matchedTags }) => {
    const node = els.resultTemplate.content.firstElementChild.cloneNode(true);
    node.classList.toggle("active", entry.id === state.selectedId);
    node.querySelector(".result-score").textContent = Math.max(0, score);
    node.querySelector(".result-title").textContent = `${entry.name} / ${entry.english_name}`;
    node.querySelector(".result-description").textContent = entry.short_description;

    const miniTags = node.querySelector(".mini-tags");
    matchedTags.slice(0, 6).forEach((tag) => {
      const span = document.createElement("span");
      span.className = "mini-tag";
      span.textContent = tag;
      miniTags.appendChild(span);
    });

    node.querySelector(".result-button").addEventListener("click", () => {
      state.selectedId = entry.id;
      renderResults();
      renderDetail();
    });

    els.resultList.appendChild(node);
  });

  if (matches.length === 0) {
    els.resultList.innerHTML = `<div class="section-block"><p class="notice">一致する項目がありません。タグを減らすか、別の言葉で検索してください。</p></div>`;
  }
}

function renderDetail() {
  const entry = state.entries.find((item) => item.id === state.selectedId);
  if (!entry) {
    els.detailContent.className = "detail-content empty-detail";
    els.detailContent.innerHTML = `
      <p class="eyebrow">Detail</p>
      <h2>候補なし</h2>
      <p>検索条件をゆるめると候補が表示されます。</p>
    `;
    return;
  }

  els.detailContent.className = "detail-content";
  const nearTerms = getEntriesByIds(entry.near_terms);
  const keywordText = (entry.ai_keywords || []).join(", ");

  els.detailContent.innerHTML = `
    <div class="detail-header">
      <div>
        <p class="eyebrow">${escapeHtml(entry.english_name)}</p>
        <h2>${escapeHtml(entry.name)}</h2>
        <p class="reading">${escapeHtml(entry.reading)}</p>
      </div>
      <button class="copy-button" id="copyKeywords" type="button">キーワードをコピー</button>
    </div>

    <section class="section-block">
      <h3>一言説明</h3>
      <p>${escapeHtml(entry.short_description)}</p>
    </section>

    <section class="section-block">
      <h3>代表画像</h3>
      ${representativeImageDetail(entry)}
    </section>

    <section class="section-block">
      <h3>視覚的特徴</h3>
      ${listHtml(entry.visual_features)}
    </section>

    <section class="section-block">
      <div class="meta-grid">
        ${metaBox("モチーフ", entry.common_motifs)}
        ${metaBox("色の傾向", entry.color_tendencies)}
        ${metaBox("素材感", entry.material_feel)}
        ${metaBox("近い用語", nearTerms.map((item) => item.name))}
      </div>
    </section>

    <section class="section-block">
      <h3>光・空気感</h3>
      <p>${escapeHtml(entry.light_air)}</p>
    </section>

    <section class="section-block">
      <h3>世界観の方向性</h3>
      <p>${escapeHtml(entry.worldview_direction)}</p>
    </section>

    <section class="section-block">
      <h3>混同しやすい用語</h3>
      <div class="comparison-list">
        ${(entry.confusable_terms || []).map((item) => comparisonHtml(item)).join("")}
      </div>
    </section>

    <section class="section-block">
      <h3>AI画像生成・検索キーワード</h3>
      <p class="keyword-text" id="keywordText">${escapeHtml(keywordText)}</p>
    </section>

    <section class="section-block">
      <h3>画像検索タグ</h3>
      <div class="tag-list">
        ${(entry.image_search_tags || []).map((tag) => `<span class="mini-tag">${escapeHtml(tag)}</span>`).join("")}
      </div>
      <p class="muted-line">候補画像収集用の補助タグです。メイン表示は representative_image の1枚を使います。</p>
    </section>

    <section class="section-block">
      <h3>タグ</h3>
      <div class="tag-list">
        ${flattenTags(entry.tags).map((tag) => `<span class="mini-tag">${escapeHtml(tag)}</span>`).join("")}
      </div>
    </section>
  `;

  document.querySelector("#copyKeywords").addEventListener("click", async () => {
    await navigator.clipboard.writeText(keywordText);
    document.querySelector("#copyKeywords").textContent = "コピー済み";
    setTimeout(() => {
      const button = document.querySelector("#copyKeywords");
      if (button) button.textContent = "キーワードをコピー";
    }, 1200);
  });
}

function representativeImageDetail(entry) {
  const image = entry.representative_image || {};
  if (!hasRepresentativeImage(entry)) {
    return `
      <div class="placeholder-image detail-placeholder">
        <strong>${escapeHtml(entry.name)}</strong>
        <span>画像未設定</span>
        <small>${mainTags(entry).join("、")}</small>
      </div>
    `;
  }

  return `
    <div class="representative-detail">
      <img src="${escapeAttribute(image.thumbnail_url || image.image_url)}" alt="${escapeAttribute(image.alt || entry.name)}" />
      <div>
        <p>${escapeHtml(image.alt || entry.name)}</p>
        <p class="muted-line">${escapeHtml(image.source || "source unknown")} / ${escapeHtml(image.creator || "creator unknown")} / ${escapeHtml(image.license || "license unknown")}</p>
        ${image.source_page_url ? `<a class="ghost-button inline-source" href="${escapeAttribute(image.source_page_url)}" target="_blank" rel="noreferrer">画像元を開く</a>` : ""}
      </div>
    </div>
  `;
}

function hasRepresentativeImage(entry) {
  const image = entry.representative_image || {};
  return Boolean(image.thumbnail_url || image.image_url);
}

function mainTags(entry) {
  const cues = [
    ...(entry.reverse_lookup?.strong_cues || []),
    ...flattenTags(entry.tags),
    ...(entry.common_motifs || []),
  ];
  return unique(cues).slice(0, 6);
}

function searchableText(entry) {
  return [
    entry.id,
    entry.name,
    entry.reading,
    entry.english_name,
    entry.short_description,
    ...(entry.image_search_tags || []),
    ...mainTags(entry),
  ].join(" ").toLowerCase();
}

function getMatches() {
  const queryTokens = tokenize(state.query);
  const selectedTags = Array.from(state.selectedTags);

  const matches = state.entries
    .map((entry) => scoreEntry(entry, queryTokens, selectedTags))
    .filter((item) => item.score > 0 || (queryTokens.length === 0 && selectedTags.length === 0));

  if (state.sort === "name") {
    matches.sort((a, b) => a.entry.name.localeCompare(b.entry.name, "ja"));
  } else if (state.sort === "english") {
    matches.sort((a, b) => a.entry.english_name.localeCompare(b.entry.english_name, "en"));
  } else {
    matches.sort((a, b) => b.score - a.score || a.entry.name.localeCompare(b.entry.name, "ja"));
  }

  return matches;
}

function scoreEntry(entry, queryTokens, selectedTags) {
  const tags = flattenTags(entry.tags);
  const strongCues = [
    ...(entry.reverse_lookup?.strong_cues || []),
    ...(entry.common_motifs || []),
  ];
  const searchable = [
    entry.name,
    entry.reading,
    entry.english_name,
    entry.short_description,
    entry.light_air,
    entry.worldview_direction,
    ...(entry.visual_features || []),
    ...(entry.ai_keywords || []),
    ...(entry.image_search_tags || []),
    ...tags,
    ...strongCues,
  ].join(" ").toLowerCase();

  let score = 0;
  const matchedTags = [];

  selectedTags.forEach((tag) => {
    if (tags.includes(tag)) {
      score += 9;
      matchedTags.push(tag);
    } else if (strongCues.includes(tag)) {
      score += 7;
      matchedTags.push(tag);
    } else {
      score -= 4;
    }
  });

  queryTokens.forEach((token) => {
    if (!token) return;
    const normalized = token.toLowerCase();
    if (entry.name.toLowerCase().includes(normalized)) score += 12;
    if (entry.english_name.toLowerCase().includes(normalized)) score += 10;
    if (strongCues.some((cue) => cue.toLowerCase().includes(normalized))) score += 8;
    if (tags.some((tag) => tag.toLowerCase().includes(normalized))) score += 7;
    if (searchable.includes(normalized)) score += 4;
  });

  if (queryTokens.length === 0 && selectedTags.length === 0) score = 1;

  const visibleTags = matchedTags.length > 0 ? unique(matchedTags) : tags.slice(0, 6);
  return { entry, score, matchedTags: visibleTags };
}

function toggleTag(tag) {
  if (!tag) return;
  if (state.selectedTags.has(tag)) {
    state.selectedTags.delete(tag);
  } else {
    state.selectedTags.add(tag);
  }
  renderDictionary();
}

function tokenize(query) {
  return query
    .split(/[\s,、]+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

function flattenTags(tags = {}) {
  return unique(Object.values(tags).flat().filter(Boolean));
}

function unique(items) {
  return Array.from(new Set(items));
}

function getEntriesByIds(ids = []) {
  return ids.map((id) => state.entries.find((entry) => entry.id === id)).filter(Boolean);
}

function listHtml(items = []) {
  return `<ul class="bullet-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function metaBox(title, items = []) {
  return `
    <div class="meta-box">
      <h4>${escapeHtml(title)}</h4>
      <div class="tag-list">
        ${items.map((item) => `<span class="mini-tag">${escapeHtml(item)}</span>`).join("")}
      </div>
    </div>
  `;
}

function comparisonHtml(item) {
  const target = state.entries.find((entry) => entry.id === item.id);
  const name = target ? target.name : item.id;
  return `
    <div class="comparison-item">
      <strong>${escapeHtml(name)}</strong>
      <p>${escapeHtml(item.difference || "")}</p>
    </div>
  `;
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
