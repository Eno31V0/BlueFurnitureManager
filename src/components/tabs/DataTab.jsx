import { useAppContext } from "../../context/AppContext.jsx";
import { C } from "../../constants.js";

const { useState, useMemo, useRef } = React;

export default function DataTab() {
  const { state, dispatch, allStudents, allFurniture, eStudentName } = useAppContext();
  const [showIO, setShowIO] = useState(false);
  const [importText, setImportText] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);
  const [addMode, setAddMode] = useState(null);
  const [addForm, setAddForm] = useState({});
  const fileInputRef = useRef(null);

  const addCustomStudent = () => {
    const name = addForm.name?.trim();
    if (!name) return;
    const id = "cs_" + Date.now();
    dispatch({
      type: "ADD_CUSTOM_STUDENT",
      student: { id, name, star: Number(addForm.star) || 3, hasEx: !!addForm.hasEx },
      initialState: { owned: false, star: Number(addForm.star) || 3, bond: 1, hasEx: !!addForm.hasEx },
    });
    setAddForm({}); setAddMode(null);
  };

  const addCustomFurniture = () => {
    const name = addForm.name?.trim();
    if (!name) return;
    const id = "cf_" + Date.now();
    const targets = (addForm.targets || "").split(",").map(s => s.trim()).filter(Boolean);
    const targetIds = targets.map(tname => allStudents.find(s => eStudentName(s) === tname)?.id).filter(Boolean);
    dispatch({
      type: "ADD_CUSTOM_FURNITURE",
      furniture: { id, name, type: addForm.type || "小物", cat: addForm.cat || "furniture", targets: targetIds },
      initialState: { owned: false, room: 0 },
    });
    setAddForm({}); setAddMode(null);
  };

  const exportJson = useMemo(() => showIO ? JSON.stringify(state, null, 2) : "", [showIO, state]);

  const doImport = () => {
    try {
      const d = JSON.parse(importText);
      if (d.students && d.furniture) { dispatch({ type: "IMPORT_STATE", data: d }); setImportText(""); setShowIO(false); }
      else { alert("無効なデータ"); }
    } catch { alert("JSON形式エラー"); }
  };

  const doExportFile = () => {
    const blob = new Blob([exportJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "ba-furniture-data.json";
    a.click(); URL.revokeObjectURL(url);
  };

  const doImportFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const d = JSON.parse(ev.target.result);
        if (d.students && d.furniture) { dispatch({ type: "IMPORT_STATE", data: d }); setImportText(""); setShowIO(false); }
        else { alert("無効なデータ"); }
      } catch { alert("JSON形式エラー"); }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const doReset = () => { dispatch({ type: "RESET_STATE" }); setConfirmReset(false); };

  return (
    <div style={{ padding: 8 }}>
      <div style={{ background: C.card, borderRadius: 8, padding: 12, marginBottom: 10 }}>
        <h3 style={{ fontSize: 14, marginBottom: 6 }}>マスタデータ</h3>
        <div style={{ fontSize: 11, color: C.textDim, lineHeight: 1.8 }}>
          <div>生徒: {allStudents.length}名 (★3:{allStudents.filter(s => s.star === 3).length} ★2:{allStudents.filter(s => s.star === 2).length} ★1:{allStudents.filter(s => s.star === 1).length}) EX有:{allStudents.filter(s => s.hasEx).length}名</div>
          <div>家具: {allFurniture.length}個 (家具:{allFurniture.filter(f => f.cat === "furniture").length} 装飾:{allFurniture.filter(f => f.cat === "decoration").length})</div>
          <div>カスタム: 生徒{(state.customStudents || []).length}名 家具{(state.customFurniture || []).length}個</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
        <button onClick={() => { setAddMode(addMode === "student" ? null : "student"); setAddForm({ star: 3 }); }} style={{ padding: "7px 14px", border: "none", borderRadius: 6, background: addMode === "student" ? "#66bb6a" : C.accentDim, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>+ 生徒追加</button>
        <button onClick={() => { setAddMode(addMode === "furniture" ? null : "furniture"); setAddForm({ cat: "furniture", type: "小物" }); }} style={{ padding: "7px 14px", border: "none", borderRadius: 6, background: addMode === "furniture" ? "#66bb6a" : C.accentDim, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>+ 家具追加</button>
      </div>

      {addMode === "student" && <div style={{ background: C.card, borderRadius: 8, padding: 12, marginBottom: 10 }}>
        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>生徒追加</div>
        <input placeholder="名前" value={addForm.name || ""} onChange={e => setAddForm({ ...addForm, name: e.target.value })} style={{ width: "100%", boxSizing: "border-box", padding: "6px 8px", borderRadius: 4, border: `1px solid ${C.border}`, background: C.bg, color: C.text, fontSize: 12, marginBottom: 4, outline: "none" }} />
        <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: C.textDim }}>★</span>
          <select value={addForm.star || 3} onChange={e => setAddForm({ ...addForm, star: Number(e.target.value) })} style={{ background: C.bg, color: C.text, border: `1px solid ${C.border}`, borderRadius: 4, padding: "4px 6px", fontSize: 11 }}>
            {[1, 2, 3].map(n => <option key={n} value={n}>★{n}</option>)}
          </select>
          <label style={{ fontSize: 11, color: C.textDim, cursor: "pointer" }}><input type="checkbox" checked={!!addForm.hasEx} onChange={e => setAddForm({ ...addForm, hasEx: e.target.checked })} /> EX有</label>
        </div>
        <button onClick={addCustomStudent} style={{ padding: "6px 16px", border: "none", borderRadius: 6, background: "#66bb6a", color: "#000", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>追加</button>
      </div>}

      {addMode === "furniture" && <div style={{ background: C.card, borderRadius: 8, padding: 12, marginBottom: 10 }}>
        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>家具追加</div>
        <input placeholder="名前" value={addForm.name || ""} onChange={e => setAddForm({ ...addForm, name: e.target.value })} style={{ width: "100%", boxSizing: "border-box", padding: "6px 8px", borderRadius: 4, border: `1px solid ${C.border}`, background: C.bg, color: C.text, fontSize: 12, marginBottom: 4, outline: "none" }} />
        <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4, flexWrap: "wrap" }}>
          <select value={addForm.cat || "furniture"} onChange={e => setAddForm({ ...addForm, cat: e.target.value })} style={{ background: C.bg, color: C.text, border: `1px solid ${C.border}`, borderRadius: 4, padding: "4px", fontSize: 11 }}>
            <option value="furniture">家具</option><option value="decoration">装飾</option>
          </select>
          <select value={addForm.type || "小物"} onChange={e => setAddForm({ ...addForm, type: e.target.value })} style={{ background: C.bg, color: C.text, border: `1px solid ${C.border}`, borderRadius: 4, padding: "4px", fontSize: 11 }}>
            {FURN_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <input placeholder="対象生徒名(カンマ区切り)" value={addForm.targets || ""} onChange={e => setAddForm({ ...addForm, targets: e.target.value })} style={{ width: "100%", boxSizing: "border-box", padding: "6px 8px", borderRadius: 4, border: `1px solid ${C.border}`, background: C.bg, color: C.text, fontSize: 11, marginBottom: 6, outline: "none" }} />
        <button onClick={addCustomFurniture} style={{ padding: "6px 16px", border: "none", borderRadius: 6, background: "#66bb6a", color: "#000", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>追加</button>
      </div>}

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
        <button onClick={() => { setShowIO(!showIO); setImportText(""); }} style={{ padding: "7px 14px", border: "none", borderRadius: 6, background: C.accent, color: "#000", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{showIO ? "閉じる" : "エクスポート/インポート"}</button>
        {!confirmReset ? <button onClick={() => setConfirmReset(true)} style={{ padding: "7px 14px", border: "none", borderRadius: 6, background: C.danger, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>全データリセット</button>
          : <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <span style={{ fontSize: 11, color: C.danger, fontWeight: 700 }}>本当に？</span>
            <button onClick={doReset} style={{ padding: "5px 12px", border: "none", borderRadius: 6, background: C.danger, color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>実行</button>
            <button onClick={() => setConfirmReset(false)} style={{ padding: "5px 12px", border: "none", borderRadius: 6, background: C.card, color: C.textDim, fontSize: 11, cursor: "pointer" }}>取消</button>
          </div>}
      </div>

      {showIO && <div style={{ background: C.card, borderRadius: 8, padding: 12 }}>
        <input ref={fileInputRef} type="file" accept=".json" style={{ display: "none" }} onChange={doImportFile} />
        <div style={{ fontSize: 12, color: C.accent, fontWeight: 600, marginBottom: 4 }}>エクスポート</div>
        <textarea readOnly value={exportJson} onFocus={e => e.target.select()} style={{ background: "#1e1e38", border: `1px solid ${C.border}`, borderRadius: 6, color: "#81c784", padding: 6, fontFamily: "monospace", fontSize: 10, outline: "none", width: "100%", minHeight: 50, resize: "vertical", boxSizing: "border-box", marginBottom: 6 }} />
        <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
          <button onClick={doExportFile} style={{ padding: "7px 14px", border: "none", borderRadius: 6, background: C.accent, color: "#000", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>ファイルとして保存</button>
        </div>
        <div style={{ fontSize: 12, color: C.amber, fontWeight: 600, marginBottom: 4 }}>インポート</div>
        <textarea value={importText} onChange={e => setImportText(e.target.value)} placeholder="JSON貼り付け..." style={{ background: "#1e1e38", border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, padding: 6, fontFamily: "monospace", fontSize: 10, outline: "none", width: "100%", minHeight: 50, resize: "vertical", boxSizing: "border-box", marginBottom: 6 }} />
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={doImport} style={{ padding: "7px 14px", border: "none", borderRadius: 6, background: "#66bb6a", color: "#000", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>テキストからインポート</button>
          <button onClick={() => fileInputRef.current?.click()} style={{ padding: "7px 14px", border: "none", borderRadius: 6, background: C.accentDim, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>ファイルから読み込み</button>
        </div>
      </div>}
    </div>
  );
}
