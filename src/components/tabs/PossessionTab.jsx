import { useAppContext } from "../../context/AppContext.jsx";
import { C, roomColor, roomLabel, btn } from "../../constants.js";
import { searchMatch } from "../../utils/search.js";
import FurnEditForm from "../shared/FurnEditForm.jsx";

const { useState, useMemo } = React;

export default function PossessionTab({ search }) {
  const {
    state, dispatch,
    editMode, enterEdit, saveEdit, cancelEdit,
    editFurnId, setEditFurnId,
    editStudentId, setEditStudentId,
    editDraft, setEditDraft,
    allStudents, allFurniture, allFurnMap, allStudentMap,
    eFurnName, eFurnTargets, eFurnSeries, eStudentName,
    gfs,
  } = useAppContext();

  const [furniCat, setFurniCat] = useState("all");
  const [furniType, setFurniType] = useState("all");
  const [furniSort, setFurniSort] = useState("user");
  const [dragId, setDragId] = useState(null);

  const eSeriesIdx = (f) => { const s = eFurnSeries(f) || "その他"; const i = SERIES_ORDER.indexOf(s); return i >= 0 ? i : 0; };

  const filteredFurniture = useMemo(() => {
    const order = state.furnitureOrder || allFurniture.map(f => f.id);
    let list = order.filter(id => allFurnMap[id]).map(id => allFurnMap[id]);
    if (furniCat !== "all") list = list.filter(f => f.cat === furniCat);
    if (furniType !== "all") list = list.filter(f => f.type === furniType);
    if (search) { list = list.filter(f => searchMatch(eFurnName(f), search) || eFurnTargets(f).some(sid => searchMatch(eStudentName(allStudentMap[sid] || { name: sid }), search))); }
    if (furniSort === "name") list = [...list].sort((a, b) => eFurnName(a).localeCompare(eFurnName(b), "ja"));
    else if (furniSort === "series") list = [...list].sort((a, b) => eSeriesIdx(a) - eSeriesIdx(b) || eFurnName(a).localeCompare(eFurnName(b), "ja"));
    return list;
  }, [furniCat, furniType, search, furniSort, state.furnitureOrder, allFurniture, allFurnMap, allStudentMap, eFurnName, eFurnTargets, eStudentName, eFurnSeries]);

  const startEditFurn = (f) => {
    setEditFurnId(f.id); setEditStudentId(null);
    setEditDraft({ name: eFurnName(f), series: eFurnSeries(f), targets: eFurnTargets(f).map(sid => eStudentName(allStudentMap[sid] || { name: sid })).join(", ") });
  };
  const applyEditFurn = (fid) => {
    const targetIds = editDraft.targets.split(",").map(s => s.trim()).filter(Boolean)
      .map(tname => allStudents.find(s => eStudentName(s) === tname)?.id).filter(Boolean);
    dispatch({ type: "APPLY_MASTER_EDIT_FURN", fid, name: editDraft.name.trim(), targets: targetIds, series: editDraft.series.trim() });
    setEditFurnId(null);
  };

  // Drag handlers
  const onDS = (fid) => setDragId(fid);
  const onDO = (e) => {
    e.preventDefault();
    const y = e.clientY, h = window.innerHeight, zone = 80;
    if (y < zone) window.scrollBy(0, -(zone - y) / 5);
    else if (y > h - zone) window.scrollBy(0, (y - (h - zone)) / 5);
  };
  const onDE = () => setDragId(null);
  const onDrop = (tid) => {
    if (!dragId) return;
    if (dragId === tid) { setDragId(null); return; }
    dispatch({ type: "REORDER_FURNITURE", fromId: dragId, toId: tid });
    setDragId(null);
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
        {[["all", `全て(${allFurniture.length})`], ["furniture", `家具(${allFurniture.filter(f => f.cat === "furniture").length})`], ["decoration", `装飾(${allFurniture.filter(f => f.cat === "decoration").length})`]].map(([k, l]) =>
          <button key={k} onClick={() => setFurniCat(k)} style={btn(furniCat === k, k === "furniture" ? C.catFurn : k === "decoration" ? C.catDeco : C.accentDim)}>{l}</button>
        )}
      </div>
      <div style={{ display: "flex", gap: 3, marginBottom: 4, flexWrap: "wrap" }}>
        <button onClick={() => setFurniType("all")} style={btn(furniType === "all")}>種別:全て</button>
        {FURN_TYPES.map(t => <button key={t} onClick={() => setFurniType(t)} style={btn(furniType === t)}>{t}</button>)}
      </div>
      <div style={{ display: "flex", gap: 3, marginBottom: 6, alignItems: "center", flexWrap: "wrap" }}>
        <span style={{ fontSize: 10, color: C.textDim }}>並替:</span>
        {[["user", "ユーザー設定"], ["name", "名前"], ["series", "セット"]].map(([k, l]) =>
          <button key={k} onClick={() => setFurniSort(k)} style={btn(furniSort === k)}>{l}</button>
        )}
        <span style={{ flex: 1 }} />
        {!editMode ? <button onClick={enterEdit} style={{ padding: "5px 12px", border: "none", borderRadius: 6, background: C.accentDim, color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>📝 編集</button>
          : <><button onClick={saveEdit} style={{ padding: "5px 12px", border: "none", borderRadius: 6, background: "#66bb6a", color: "#000", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>💾 保存</button>
            <button onClick={cancelEdit} style={{ padding: "5px 12px", border: "none", borderRadius: 6, background: C.danger, color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>✕ 取消</button></>}
      </div>

      {filteredFurniture.map((f, i) => {
        const fs = gfs(f.id); const fn = eFurnName(f); const ft = eFurnTargets(f);
        const tNames = ft.map(sid => eStudentName(allStudentMap[sid] || { name: sid })).join(", ");
        const series = eFurnSeries(f); const isCustom = f.id.startsWith("cf_");
        const showSeriesHeader = furniSort === "series" && (i === 0 || eSeriesIdx(filteredFurniture[i - 1]) !== eSeriesIdx(f));
        const isEditing = editMode && editFurnId === f.id;
        return (<div key={f.id}>
          {showSeriesHeader && <div style={{ fontSize: 11, fontWeight: 700, color: C.accent, padding: "6px 0 2px", borderBottom: `1px solid ${C.border}`, marginBottom: 4 }}>{series || "その他"}</div>}
          <div draggable={furniSort === "user" && !isEditing} onDragStart={() => onDS(f.id)} onDragOver={onDO} onDrop={() => onDrop(f.id)} onDragEnd={onDE}
            style={{ background: isEditing ? "#2a3050" : dragId === f.id ? "#3a3c6a" : C.card, borderRadius: 8, padding: "7px 10px", marginBottom: 3, border: `1px solid ${isEditing ? "#ff9800" : fs.owned ? C.owned : C.border}`, cursor: furniSort === "user" && !isEditing ? "grab" : "default", opacity: dragId === f.id ? 0.5 : 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14, cursor: "pointer", userSelect: "none" }} onClick={() => dispatch({ type: "TOGGLE_FURNITURE_OWNED", fid: f.id })}>{fs.owned ? "✅" : "⬜"}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                {!isEditing ? <>
                  <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{fn}</div>
                  <div style={{ fontSize: 10, color: C.textDim }}>
                    <span style={{ background: f.cat === "decoration" ? C.catDeco : C.catFurn, padding: "1px 4px", borderRadius: 3, marginRight: 3, color: "#fff", fontSize: 9 }}>{f.type}</span>
                    {series && <span style={{ padding: "1px 4px", borderRadius: 3, marginRight: 3, color: C.accent, fontSize: 9, border: `1px solid ${C.accent}33` }}>{series}</span>}
                    {tNames}
                  </div>
                </> : <FurnEditForm draft={editDraft} onDraftChange={setEditDraft} onApply={() => applyEditFurn(f.id)} onClose={() => setEditFurnId(null)} />}
              </div>
              {editMode && !isEditing && <span onClick={() => startEditFurn(f)} style={{ cursor: "pointer", fontSize: 11, color: "#ffb74d", padding: "2px 6px", borderRadius: 4, border: "1px solid #ff980055" }}>✏️</span>}
              {isCustom && <span onClick={() => dispatch({ type: "DELETE_CUSTOM_FURNITURE", id: f.id })} style={{ cursor: "pointer", fontSize: 12, color: C.danger }}>✕</span>}
              {fs.room > 0 && <span style={{ fontSize: 9, padding: "2px 5px", borderRadius: 4, background: roomColor(fs.room), color: "#fff", fontWeight: 700 }}>{roomLabel(fs.room)}</span>}
              {furniSort === "user" && !isEditing && <span style={{ fontSize: 14, color: C.textDim, cursor: "grab" }}>⠿</span>}
            </div>
          </div>
        </div>);
      })}
    </div>
  );
}
