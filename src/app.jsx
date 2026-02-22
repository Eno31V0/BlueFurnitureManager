import { AppProvider, useAppContext } from "./context/AppContext.jsx";
import { C } from "./constants.js";
import PossessionTab from "./components/tabs/PossessionTab.jsx";
import RoomTab from "./components/tabs/RoomTab.jsx";
import BondTab from "./components/tabs/BondTab.jsx";
import DataTab from "./components/tabs/DataTab.jsx";

const { useState } = React;

// ========== メインアプリ内部 ==========
function AppInner() {
  const {
    loaded,
    editMode, saveEdit, cancelEdit,
    allStudents,
    stats,
  } = useAppContext();

  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [roomSearch, setRoomSearch] = useState("");

  const tabs = ["所持状況", "ルーム設置", "絆ランク", "データ管理"];

  if (!loaded) return (
    <div style={{ background: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: C.textDim }}>
      読み込み中...
    </div>
  );

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, fontFamily: "'Segoe UI',sans-serif", maxWidth: 900, margin: "0 auto", padding: "8px 12px" }}>
      <h2 style={{ textAlign: "center", margin: "8px 0", fontSize: 18, background: "linear-gradient(135deg,#4fc3f7,#7c4dff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        ブルアカ モーション家具マネージャー
      </h2>
      <div style={{ textAlign: "center", fontSize: 11, color: C.textDim, marginBottom: 8 }}>
        家具 {stats.of}/{stats.tf} | R1:{stats.r1} R2:{stats.r2} | 生徒 {allStudents.length}名
      </div>

      <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
        {tabs.map((t, i) => (
          <button key={i} onClick={() => {
            if (editMode) {
              if (!confirm("編集中です。変更を破棄してタブを切り替えますか？")) return;
              cancelEdit();
            }
            setTab(i);
          }} style={{ flex: 1, padding: "8px 0", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600, background: tab === i ? C.accent : C.card, color: tab === i ? "#000" : C.textDim }}>
            {t}
          </button>
        ))}
      </div>

      {editMode && (
        <div style={{ background: "#ff980033", border: "1px solid #ff9800", borderRadius: 6, padding: "6px 12px", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#ffb74d" }}>📝 編集モード</span>
          <div style={{ display: "flex", gap: 4 }}>
            <button onClick={saveEdit} style={{ padding: "4px 10px", border: "none", borderRadius: 4, background: "#66bb6a", color: "#000", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>💾 保存</button>
            <button onClick={cancelEdit} style={{ padding: "4px 10px", border: "none", borderRadius: 4, background: C.danger, color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>✕ 取消</button>
          </div>
        </div>
      )}

      {tab < 3 && (
        <input
          value={tab === 1 ? roomSearch : search}
          onChange={e => tab === 1 ? setRoomSearch(e.target.value) : setSearch(e.target.value)}
          placeholder="検索(家具名・生徒名)..."
          style={{ width: "100%", padding: "8px 12px", boxSizing: "border-box", borderRadius: 6, border: `1px solid ${C.border}`, background: C.card, color: C.text, fontSize: 13, marginBottom: 8, outline: "none" }}
        />
      )}

      {tab === 0 && <PossessionTab search={search} />}
      {tab === 1 && <RoomTab search={roomSearch} />}
      {tab === 2 && <BondTab search={search} />}
      {tab === 3 && <DataTab />}
    </div>
  );
}

// ========== エントリーポイント ==========
export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
