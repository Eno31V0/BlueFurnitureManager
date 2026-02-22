import { C, btn } from "../../constants.js";

/**
 * 汎用トグルボタン行コンポーネント
 *
 * @param {Array} options  - [[value, label], ...] or [[value, label, activeColor], ...]
 * @param {string} value   - 現在選択中の値
 * @param {Function} onChange - (value: string) => void
 * @param {string} [label] - 左端に表示するラベル (例: "並替:")
 * @param {number} [mb=4]  - marginBottom (px)
 * @param {number} [gap=3] - ボタン間のgap (px)
 * @param {object} [style] - 追加スタイル
 */
export default function FilterBar({ label, options, value, onChange, mb = 4, gap = 3, style }) {
  return (
    <div style={{ display: "flex", gap, marginBottom: mb, flexWrap: "wrap", alignItems: "center", ...style }}>
      {label && <span style={{ fontSize: 10, color: C.textDim }}>{label}</span>}
      {options.map(([k, l, color]) =>
        <button key={k} onClick={() => onChange(k)} style={btn(value === k, color)}>{l}</button>
      )}
    </div>
  );
}
