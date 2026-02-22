// ========== ひらがな変換 & 検索ヘルパー ==========
export const toHiragana = (str) =>
  str.replace(/[\u30A1-\u30F6]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x60));

export const searchMatch = (text, query) => {
  const t = toHiragana(text.toLowerCase());
  const q = toHiragana(query.toLowerCase());
  return t.includes(q);
};
