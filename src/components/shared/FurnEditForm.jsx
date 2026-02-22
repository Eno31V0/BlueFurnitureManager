import { C } from "../../constants.js";

/**
 * 家具マスタ編集フォーム (Tab0・Tab2 共通)
 *
 * @param {string}   [title]         - フォーム上部に表示するタイトル
 * @param {object}   draft           - { name: string, series: string, targets: string }
 * @param {Function} onDraftChange   - (newDraft) => void
 * @param {Function} onApply         - 適用ボタン押下時
 * @param {Function} onClose         - 閉じるボタン押下時
 */
export default function FurnEditForm({ title, draft, onDraftChange, onApply, onClose }) {
  const d = draft || {};
  const inputStyle = { flex: 1, padding: "3px 6px", borderRadius: 4, border: `1px solid ${C.border}`, background: C.bg, color: C.text, fontSize: 11, outline: "none" };
  const labelStyle = { fontSize: 10, color: C.textDim, width: 40 };
  const rowStyle = { display: "flex", gap: 4, alignItems: "center" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {title && <div style={{ fontSize: 10, fontWeight: 600, color: "#ffb74d", marginBottom: 2 }}>{title}</div>}
      <div style={rowStyle}>
        <span style={labelStyle}>名前</span>
        <input value={d.name || ""} onChange={e => onDraftChange({ ...d, name: e.target.value })} style={inputStyle} />
      </div>
      <div style={rowStyle}>
        <span style={labelStyle}>シリーズ</span>
        <input value={d.series || ""} onChange={e => onDraftChange({ ...d, series: e.target.value })} placeholder="(なし)" style={inputStyle} />
      </div>
      <div style={rowStyle}>
        <span style={labelStyle}>対象</span>
        <input value={d.targets || ""} onChange={e => onDraftChange({ ...d, targets: e.target.value })} placeholder="生徒名(カンマ区切り)" style={inputStyle} />
      </div>
      <div style={{ display: "flex", gap: 3, justifyContent: "flex-end" }}>
        <button onClick={onApply} style={{ padding: "3px 10px", border: "none", borderRadius: 4, background: "#66bb6a", color: "#000", fontSize: 10, fontWeight: 700, cursor: "pointer" }}>適用</button>
        <button onClick={onClose} style={{ padding: "3px 10px", border: "none", borderRadius: 4, background: C.card, color: C.textDim, fontSize: 10, cursor: "pointer" }}>閉じる</button>
      </div>
    </div>
  );
}
