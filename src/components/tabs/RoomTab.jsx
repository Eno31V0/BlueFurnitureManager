import { useAppContext } from "../../context/AppContext.jsx";
import { C, isInRoom, roomColor, btn } from "../../constants.js";
import { searchMatch } from "../../utils/search.js";
import FurnRoomCard from "../FurnRoomCard.jsx";

const { useState, useMemo } = React;

export default function RoomTab({ search }) {
  const {
    state,
    hlScope, setHlScope,
    hlThreshold, setHlThreshold,
    allFurniture, allFurnMap, allStudentMap,
    eFurnName, eFurnTargets, eStudentName,
    gfs,
    furnIsAchieved, furnHasOwnedNotAchieved,
  } = useAppContext();

  const [roomMode, setRoomMode] = useState("room");
  const [roomHlAchieved, setRoomHlAchieved] = useState(true);
  const [roomHlNotAchieved, setRoomHlNotAchieved] = useState(true);
  const [roomFurnFilter, setRoomFurnFilter] = useState("all");
  const [roomPlacedFilter, setRoomPlacedFilter] = useState("all");
  const [roomFurniCat, setRoomFurniCat] = useState("all");
  const [roomFurniType, setRoomFurniType] = useState("all");
  const [roomFurniSort, setRoomFurniSort] = useState("name");

  const eSeriesIdx = (f) => { const s = eFurnSeries(f) || "その他"; const i = SERIES_ORDER.indexOf(s); return i >= 0 ? i : 0; };

  // eFurnSeries はコンテキストから取得
  const { eFurnSeries } = useAppContext();

  const roomFilteredFurniture = useMemo(() => {
    const order = state.furnitureOrder || allFurniture.map(f => f.id);
    let list = order.filter(id => allFurnMap[id]).map(id => allFurnMap[id]);
    list = list.filter(f => gfs(f.id).owned);
    if (roomFurniCat !== "all") list = list.filter(f => f.cat === roomFurniCat);
    if (roomFurniType !== "all") list = list.filter(f => f.type === roomFurniType);
    if (search) { list = list.filter(f => searchMatch(eFurnName(f), search) || eFurnTargets(f).some(sid => searchMatch(eStudentName(allStudentMap[sid] || { name: sid }), search))); }
    if (roomFurnFilter === "achieved") list = list.filter(f => furnIsAchieved(f));
    else if (roomFurnFilter === "notAchieved") list = list.filter(f => furnHasOwnedNotAchieved(f));
    if (roomFurniSort === "name") list = [...list].sort((a, b) => eFurnName(a).localeCompare(eFurnName(b), "ja"));
    else if (roomFurniSort === "series") list = [...list].sort((a, b) => eSeriesIdx(a) - eSeriesIdx(b) || eFurnName(a).localeCompare(eFurnName(b), "ja"));
    return list;
  }, [roomFurniCat, roomFurniType, search, roomFurniSort, roomFurnFilter,
    state.furnitureOrder, allFurniture, allFurnMap, allStudentMap, state.furniture, state.students,
    hlScope, hlThreshold, eFurnName, eFurnTargets, eStudentName, gfs, furnIsAchieved, furnHasOwnedNotAchieved]);

  return (
    <div>
      <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
        <button onClick={() => setRoomMode("room")} style={btn(roomMode === "room")}>ルーム表示</button>
        <button onClick={() => setRoomMode("furniture")} style={btn(roomMode === "furniture")}>家具表示</button>
      </div>

      <div style={{ background: C.card, borderRadius: 6, padding: "6px 10px", marginBottom: 6, display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
        <span style={{ fontSize: 10, color: C.gold, fontWeight: 600 }}>🏅HL条件:</span>
        <span style={{ fontSize: 10, color: C.textDim }}>所持生徒</span>
        {[["all", "全員が"], ["any", "誰かが"]].map(([k, l]) =>
          <button key={k} onClick={() => setHlScope(k)} style={btn(hlScope === k, C.gold)}>{l}</button>
        )}
        <span style={{ fontSize: 10, color: C.textDim }}>絆</span>
        {[["cap", "上限"], ["ex920", "EX有20/EX無9"]].map(([k, l]) =>
          <button key={k} onClick={() => setHlThreshold(k)} style={btn(hlThreshold === k, C.gold)}>{l}</button>
        )}
        <span style={{ fontSize: 10, color: C.textDim }}>に達成</span>
        <span style={{ fontSize: 10, color: C.textDim, marginLeft: 6 }}>HL表示:</span>
        <button onClick={() => setRoomHlAchieved(!roomHlAchieved)} style={btn(roomHlAchieved, C.gold)}>達成{roomHlAchieved ? "✓" : "✗"}</button>
        <button onClick={() => setRoomHlNotAchieved(!roomHlNotAchieved)} style={btn(roomHlNotAchieved, C.hlNA)}>未達成{roomHlNotAchieved ? "✓" : "✗"}</button>
      </div>

      <div style={{ background: C.card, borderRadius: 6, padding: "6px 10px", marginBottom: 6 }}>
        <div style={{ display: "flex", gap: 3, marginBottom: 4, flexWrap: "wrap" }}>
          {[["all", `全て`], ["furniture", "家具"], ["decoration", "装飾"]].map(([k, l]) =>
            <button key={k} onClick={() => setRoomFurniCat(k)} style={btn(roomFurniCat === k, k === "furniture" ? C.catFurn : k === "decoration" ? C.catDeco : C.accentDim)}>{l}</button>
          )}
        </div>
        <div style={{ display: "flex", gap: 3, marginBottom: 4, flexWrap: "wrap" }}>
          <button onClick={() => setRoomFurniType("all")} style={btn(roomFurniType === "all")}>種別:全て</button>
          {FURN_TYPES.map(t => <button key={t} onClick={() => setRoomFurniType(t)} style={btn(roomFurniType === t)}>{t}</button>)}
        </div>
        <div style={{ display: "flex", gap: 3, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: 10, color: C.textDim }}>並替:</span>
          {[["user", "順序"], ["name", "名前"], ["series", "セット"]].map(([k, l]) =>
            <button key={k} onClick={() => setRoomFurniSort(k)} style={btn(roomFurniSort === k)}>{l}</button>
          )}
          <span style={{ fontSize: 10, color: C.textDim, marginLeft: 6 }}>達成:</span>
          {[["all", "全て"], ["achieved", "達成済"], ["notAchieved", "未達成"]].map(([k, l]) =>
            <button key={k} onClick={() => setRoomFurnFilter(k)} style={btn(roomFurnFilter === k, k === "achieved" ? C.gold : k === "notAchieved" ? C.hlNA : undefined)}>{l}</button>
          )}
          {roomMode === "room" && <>
            <span style={{ fontSize: 10, color: C.textDim, marginLeft: 6 }}>設置:</span>
            {[["all", "全て"], ["placed", "設置中"], ["notPlaced", "未設置"]].map(([k, l]) =>
              <button key={k} onClick={() => setRoomPlacedFilter(k)} style={btn(roomPlacedFilter === k)}>{l}</button>
            )}
          </>}
        </div>
      </div>

      <div style={{ fontSize: 10, color: C.textDim, marginBottom: 6, padding: "3px 8px", background: C.card, borderRadius: 6, lineHeight: 1.6 }}>
        <span style={{ color: C.gold }}>■</span>達成HL&nbsp;&nbsp;<span style={{ color: C.hlNA }}>■</span>未達成HL(所持生徒あり)&nbsp;&nbsp;<span style={{ color: C.gold }}>生徒名</span>条件達成&nbsp;&nbsp;<span style={{ color: C.hlNA }}>生徒名</span>所持・未達成
      </div>

      {roomMode === "room" ? <div>
        {[1, 2].map(rn => {
          const displayList = roomPlacedFilter === "placed"
            ? roomFilteredFurniture.filter(f => isInRoom(gfs(f.id).room, rn))
            : roomPlacedFilter === "notPlaced"
              ? roomFilteredFurniture.filter(f => !isInRoom(gfs(f.id).room, rn))
              : roomFilteredFurniture;
          const inRoomCount = roomFilteredFurniture.filter(f => isInRoom(gfs(f.id).room, rn)).length;
          return <div key={rn} style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 15, color: rn === 1 ? C.room1 : C.room2, marginBottom: 4 }}>
              ルーム {rn} <span style={{ fontSize: 11, fontWeight: 400, color: C.textDim }}>({inRoomCount}個チェック済 / {displayList.length}個表示中)</span>
            </h3>
            {displayList.length === 0 && <div style={{ fontSize: 12, color: C.textDim, padding: 8 }}>表示する家具なし</div>}
            {displayList.map(f => (
              <FurnRoomCard key={f.id} f={f} border={roomColor(rn)} showCheckbox={true} roomNum={rn} roomHlAchieved={roomHlAchieved} roomHlNotAchieved={roomHlNotAchieved} />
            ))}
          </div>;
        })}
      </div> : <div>
        {[1, 2].map(rn => {
          const rf = roomFilteredFurniture.filter(f => isInRoom(gfs(f.id).room, rn));
          return <div key={rn} style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, color: rn === 1 ? C.room1 : C.room2, marginBottom: 6 }}>ルーム {rn} ({rf.length}個)</h3>
            {rf.length === 0 && <div style={{ fontSize: 12, color: C.textDim, padding: 8 }}>設置なし</div>}
            {rf.map(f => <FurnRoomCard key={f.id} f={f} border={roomColor(rn)} showSelect={true} roomHlAchieved={roomHlAchieved} roomHlNotAchieved={roomHlNotAchieved} />)}
          </div>;
        })}
        <h3 style={{ fontSize: 14, color: C.textDim, marginBottom: 6 }}>未設置(所持済み)</h3>
        {roomFilteredFurniture.filter(f => gfs(f.id).room === 0).map(f => <FurnRoomCard key={f.id} f={f} border={C.border} showSelect={true} roomHlAchieved={roomHlAchieved} roomHlNotAchieved={roomHlNotAchieved} />)}
      </div>}
    </div>
  );
}
