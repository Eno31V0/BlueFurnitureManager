import { useAppContext } from "../context/AppContext.jsx";
import { C, isInRoom, roomColor } from "../constants.js";

export default function FurnRoomCard({ f, border, showCheckbox, showSelect, roomNum, roomHlAchieved, roomHlNotAchieved }) {
  const { dispatch, gss, gfs, eFurnName, eFurnTargets, eStudentName, allStudentMap, bondCheck, furnIsAchieved } = useAppContext();

  const fs = gfs(f.id);
  const isAch = furnIsAchieved(f);
  const hasOwned = eFurnTargets(f).some(sid => gss(sid).owned);
  const isNotAch = hasOwned && !isAch;
  const showGold = roomHlAchieved && isAch;
  const showBlue = roomHlNotAchieved && isNotAch;
  const hlBg = showGold ? `${C.gold}22` : showBlue ? `${C.hlNA}18` : (showCheckbox && isInRoom(fs.room, roomNum) ? `${roomColor(roomNum)}15` : C.card);
  const hlBorder = showGold ? C.gold : showBlue ? C.hlNA : border;

  const studentNodes = eFurnTargets(f).map((sid, i) => {
    const ss = gss(sid);
    const sd = allStudentMap[sid];
    const name = sd ? eStudentName(sd) : "?";
    const met = bondCheck(sid);
    const isOwned = ss.owned;
    const color = met ? C.gold : (showBlue && isOwned) ? C.hlNA : C.textDim;
    const fw = (met || (showBlue && isOwned)) ? 600 : 400;
    return <span key={sid}>{i > 0 && <span style={{ color: C.textDim }}>, </span>}<span style={{ color, fontWeight: fw }}>{name}(★{ss.star} 絆{ss.bond})</span></span>;
  });

  const nameNode = <div style={{ fontSize: showCheckbox ? 11 : 12, fontWeight: 600 }}>
    {eFurnName(f)}
    {fs.room === 3 && <span style={{ fontSize: 9, background: C.roomBoth, color: "#fff", padding: "1px 4px", borderRadius: 3, marginLeft: 4 }}>両方</span>}
  </div>;
  const targetNode = <div style={{ fontSize: 10, display: "flex", flexWrap: "wrap", gap: 1 }}>{studentNodes}</div>;
  const cardStyle = {
    background: hlBg, borderRadius: 8,
    padding: showCheckbox ? "5px 10px" : "6px 10px",
    marginBottom: showCheckbox ? 2 : 3,
    border: `${showCheckbox ? 1 : 2}px solid ${hlBorder}`,
    boxShadow: showGold ? `0 0 8px ${C.gold}44` : showBlue ? `0 0 8px ${C.hlNA}33` : "none",
  };

  if (showCheckbox) {
    const checked = isInRoom(fs.room, roomNum);
    return <div style={cardStyle}>
      <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
        <input type="checkbox" checked={checked} onChange={() => dispatch({ type: "TOGGLE_ROOM", fid: f.id, targetRoom: roomNum })} style={{ accentColor: roomColor(roomNum), width: 15, height: 15 }} />
        <div style={{ flex: 1, minWidth: 0 }}>{nameNode}{targetNode}</div>
      </label>
    </div>;
  }
  return <div style={cardStyle}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ flex: 1, minWidth: 0 }}>{nameNode}{targetNode}</div>
      {showSelect && <select value={fs.room} onChange={e => dispatch({ type: "SET_FURNITURE_ROOM", fid: f.id, room: Number(e.target.value) })} style={{ background: C.card, color: C.text, border: `1px solid ${C.border}`, borderRadius: 4, padding: "3px 5px", fontSize: 11, marginLeft: 6 }}>
        <option value={0}>未設置</option><option value={1}>ルーム1</option><option value={2}>ルーム2</option><option value={3}>両方(1&2)</option>
      </select>}
    </div>
  </div>;
}
