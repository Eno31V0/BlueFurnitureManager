import { useAppContext } from "../../context/AppContext.jsx";
import { C, btn } from "../../constants.js";
import { searchMatch } from "../../utils/search.js";
import FurnEditForm from "../shared/FurnEditForm.jsx";

const { useState, useMemo } = React;

export default function BondTab({ search }) {
  const {
    state, dispatch,
    editMode, enterEdit, saveEdit, cancelEdit,
    editFurnId, setEditFurnId,
    editStudentId, setEditStudentId,
    editDraft, setEditDraft,
    allStudents, allFurniture, allFurnMap,
    eFurnName, eFurnTargets, eFurnSeries, eStudentName,
    gss, motionStudentIds,
    bondCheck,
  } = useAppContext();

  const [studentSort, setStudentSort] = useState("name-asc");
  const [bondFilter, setBondFilter] = useState("all");
  const [motionFilter, setMotionFilter] = useState("all");
  const [bondHlEnabled, setBondHlEnabled] = useState(true);

  const sortedStudents = useMemo(() => {
    let list = [...allStudents];
    if (search) { list = list.filter(s => searchMatch(eStudentName(s), search)); }
    if (bondFilter === "owned") list = list.filter(s => gss(s.id).owned);
    else if (bondFilter === "notOwned") list = list.filter(s => !gss(s.id).owned);
    if (motionFilter === "hasMotion") list = list.filter(s => motionStudentIds.has(s.id));
    else if (motionFilter === "noMotion") list = list.filter(s => !motionStudentIds.has(s.id));
    const [key, dir] = studentSort.split("-");
    list.sort((a, b) => {
      if (key === "name") { const c = eStudentName(a).localeCompare(eStudentName(b), "ja"); return dir === "asc" ? c : -c; }
      if (key === "bond") { const ba = gss(a.id).bond, bb = gss(b.id).bond; if (ba !== bb) return dir === "asc" ? ba - bb : bb - ba; return eStudentName(a).localeCompare(eStudentName(b), "ja"); }
      const sa = gss(a.id).star, sb = gss(b.id).star; if (sa !== sb) return dir === "asc" ? sa - sb : sb - sa; return eStudentName(a).localeCompare(eStudentName(b), "ja");
    });
    return list;
  }, [search, studentSort, bondFilter, motionFilter, state.students, allStudents, motionStudentIds, eStudentName, gss]);

  const sortOpts = [{ v: "name-asc", l: "名前↑" }, { v: "name-desc", l: "名前↓" }, { v: "star-asc", l: "★↑" }, { v: "star-desc", l: "★↓" }, { v: "bond-asc", l: "絆↑" }, { v: "bond-desc", l: "絆↓" }];

  const startEditFurn = (f) => {
    setEditFurnId(f.id); setEditStudentId(null);
    setEditDraft({ name: eFurnName(f), series: eFurnSeries(f), targets: eFurnTargets(f).map(sid => eStudentName(allStudents.find(s => s.id === sid) || { name: sid })).join(", ") });
  };
  const applyEditFurn = (fid) => {
    const targetIds = editDraft.targets.split(",").map(s => s.trim()).filter(Boolean)
      .map(tname => allStudents.find(s => eStudentName(s) === tname)?.id).filter(Boolean);
    dispatch({ type: "APPLY_MASTER_EDIT_FURN", fid, name: editDraft.name.trim(), targets: targetIds, series: editDraft.series.trim() });
    setEditFurnId(null);
  };
  const startEditStudent = (s) => {
    setEditStudentId(s.id); setEditFurnId(null);
    setEditDraft({ name: eStudentName(s) });
  };
  const applyEditStudent = (sid) => {
    dispatch({ type: "APPLY_MASTER_EDIT_STUDENT", sid, name: editDraft.name.trim() });
    setEditStudentId(null);
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 3, marginBottom: 4, flexWrap: "wrap", alignItems: "center" }}>
        {sortOpts.map(o => <button key={o.v} onClick={() => setStudentSort(o.v)} style={btn(studentSort === o.v)}>{o.l}</button>)}
        <span style={{ fontSize: 10, color: C.textDim, marginLeft: 6 }}>HL:</span>
        <button onClick={() => setBondHlEnabled(!bondHlEnabled)} style={btn(bondHlEnabled, C.gold)}>{bondHlEnabled ? "ON" : "OFF"}</button>
        <span style={{ flex: 1 }} />
        {!editMode ? <button onClick={enterEdit} style={{ padding: "5px 12px", border: "none", borderRadius: 6, background: C.accentDim, color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>📝 編集</button>
          : <><button onClick={saveEdit} style={{ padding: "5px 12px", border: "none", borderRadius: 6, background: "#66bb6a", color: "#000", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>💾 保存</button>
            <button onClick={cancelEdit} style={{ padding: "5px 12px", border: "none", borderRadius: 6, background: C.danger, color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>✕ 取消</button></>}
      </div>
      <div style={{ display: "flex", gap: 3, marginBottom: 4, flexWrap: "wrap" }}>
        <span style={{ fontSize: 10, color: C.textDim, lineHeight: "26px" }}>絞込:</span>
        {[["all", "全て"], ["owned", "所持"], ["notOwned", "未所持"]].map(([k, l]) =>
          <button key={k} onClick={() => setBondFilter(k)} style={btn(bondFilter === k)}>{l}</button>
        )}
        <span style={{ fontSize: 10, color: C.textDim, lineHeight: "26px", marginLeft: 6 }}>家具:</span>
        {[["all", "全て"], ["hasMotion", "有"], ["noMotion", "無"]].map(([k, l]) =>
          <button key={k} onClick={() => setMotionFilter(k)} style={btn(motionFilter === k)}>{l}</button>
        )}
      </div>
      <div style={{ fontSize: 10, color: C.textDim, marginBottom: 6, padding: "3px 8px", background: C.card, borderRadius: 6, lineHeight: 1.6 }}>
        <span style={{ color: C.amber }}>■</span>EX無&絆≥9 <span style={{ color: C.purple }}>■</span>EX有&絆≥20 <span style={{ color: C.gold }}>■</span>絆MAX ▸EXタップ切替
      </div>

      {sortedStudents.map(s => {
        const ss = gss(s.id); const cap = getBondCap(ss.star); const isMax = ss.bond >= cap;
        const hasEx = ss.hasEx; const relFurn = allFurniture.filter(f => eFurnTargets(f).includes(s.id));
        const hlA = !hasEx && ss.bond >= 9 && !isMax; const hlP = hasEx && ss.bond >= 20 && !isMax;
        const rawHlBg = isMax ? `${C.gold}18` : hlP ? `${C.purple}33` : hlA ? `${C.amber}28` : C.card;
        const rawHlB = isMax ? C.gold : hlP ? C.purple : hlA ? C.amber : C.border;
        const hlBg = bondHlEnabled ? rawHlBg : C.card;
        const hlB = bondHlEnabled ? rawHlB : C.border;
        const boxShadow = bondHlEnabled ? (isMax ? `0 0 6px ${C.gold}33` : hlP || hlA ? `0 0 6px ${rawHlB}33` : "none") : "none";
        const isCustom = s.id.startsWith("cs_");
        const sn = eStudentName(s);
        const isEditingS = editMode && editStudentId === s.id;
        const editingRelFurnId = editMode && editFurnId && relFurn.some(f => f.id === editFurnId) ? editFurnId : null;

        return <div key={s.id} style={{ background: isEditingS ? "#2a3050" : hlBg, borderRadius: 8, padding: "7px 10px", marginBottom: 3, border: `1px solid ${isEditingS ? "#ff9800" : hlB}`, boxShadow }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 14, cursor: "pointer" }} onClick={() => dispatch({ type: "TOGGLE_STUDENT_OWNED", sid: s.id })}>{ss.owned ? "✅" : "⬜"}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              {!isEditingS ? <div style={{ fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", flexWrap: "wrap", gap: 3 }}>
                {sn} <span style={{ fontSize: 10, color: C.gold }}>{"★".repeat(ss.star)}</span>
                <span onClick={() => dispatch({ type: "TOGGLE_STUDENT_EX", sid: s.id })} style={{ fontSize: 9, padding: "1px 4px", borderRadius: 4, fontWeight: 700, cursor: "pointer", userSelect: "none", background: hasEx ? "#ce93d8" : "#555", color: hasEx ? "#1a1a2e" : "#999", border: hasEx ? "1px solid #ce93d8" : "1px dashed #777" }}>{hasEx ? "EX有" : "EX無"}</span>
                {bondHlEnabled && hlA && <span style={{ fontSize: 9, color: C.amber }}>⚠絆{ss.bond}</span>}
                {bondHlEnabled && hlP && <span style={{ fontSize: 9, color: C.purple }}>💎絆{ss.bond}</span>}
                {isCustom && <span onClick={() => dispatch({ type: "DELETE_CUSTOM_STUDENT", id: s.id })} style={{ cursor: "pointer", fontSize: 11, color: C.danger, marginLeft: 4 }}>✕削除</span>}
                {editMode && <span onClick={() => startEditStudent(s)} style={{ cursor: "pointer", fontSize: 11, color: "#ffb74d", marginLeft: 2, padding: "1px 5px", borderRadius: 4, border: "1px solid #ff980055" }}>✏️</span>}
              </div> : <div style={{ display: "flex", gap: 4, alignItems: "center", flexWrap: "wrap" }}>
                <input value={editDraft.name || ""} onChange={e => setEditDraft({ ...editDraft, name: e.target.value })} style={{ flex: 1, minWidth: 100, padding: "3px 6px", borderRadius: 4, border: `1px solid ${C.border}`, background: C.bg, color: C.text, fontSize: 11, outline: "none" }} />
                <button onClick={() => applyEditStudent(s.id)} style={{ padding: "3px 8px", border: "none", borderRadius: 4, background: "#66bb6a", color: "#000", fontSize: 10, fontWeight: 700, cursor: "pointer" }}>適用</button>
                <button onClick={() => setEditStudentId(null)} style={{ padding: "3px 8px", border: "none", borderRadius: 4, background: C.card, color: C.textDim, fontSize: 10, cursor: "pointer" }}>閉じる</button>
              </div>}
              <div style={{ fontSize: 10, color: C.textDim, marginTop: 1 }}>
                {relFurn.map((f, i) => (
                  <span key={f.id}>
                    {i > 0 && ", "}
                    {editMode
                      ? <span onClick={() => editFurnId === f.id ? setEditFurnId(null) : startEditFurn(f)} style={{ cursor: "pointer", color: editFurnId === f.id ? "#ffb74d" : C.accent, textDecoration: "underline" }}>{eFurnName(f)}</span>
                      : <span>{eFurnName(f)}</span>
                    }
                  </span>
                ))}
              </div>
              {editingRelFurnId && (() => {
                const ef = allFurnMap[editingRelFurnId];
                if (!ef) return null;
                return <div style={{ background: "#1e2040", borderRadius: 6, padding: 8, marginTop: 5, border: "1px solid #ff9800" }}>
                  <FurnEditForm
                    title={`家具編集: ${eFurnName(ef)}`}
                    draft={editDraft}
                    onDraftChange={setEditDraft}
                    onApply={() => applyEditFurn(editingRelFurnId)}
                    onClose={() => setEditFurnId(null)}
                  />
                </div>;
              })()}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 5 }}>
            <div style={{ display: "flex", gap: 1 }}>{[1, 2, 3, 4, 5].map(n => <span key={n} onClick={() => dispatch({ type: "SET_STUDENT_STAR", sid: s.id, star: n })} style={{ cursor: "pointer", fontSize: 13, color: n <= ss.star ? C.gold : C.textDim, userSelect: "none" }}>★</span>)}</div>
            <span style={{ fontSize: 10, color: C.textDim }}>絆</span>
            <input type="range" min={1} max={cap} value={ss.bond} onChange={e => dispatch({ type: "SET_STUDENT_BOND", sid: s.id, bond: Number(e.target.value) })} style={{ flex: 1, accentColor: isMax ? C.gold : C.accent }} />
            <input type="number" min={1} max={cap} value={ss.bond} onChange={e => { const v = parseInt(e.target.value); if (!isNaN(v)) dispatch({ type: "SET_STUDENT_BOND", sid: s.id, bond: v }); }} style={{ width: 40, background: C.card, color: isMax ? C.gold : C.text, border: `1px solid ${C.border}`, borderRadius: 4, padding: "2px 4px", fontSize: 11, textAlign: "right", outline: "none" }} />
            <span style={{ fontSize: 10, color: C.textDim }}>/{cap}</span>
          </div>
        </div>;
      })}
    </div>
  );
}
