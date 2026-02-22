// ========== カラーパレット ==========
export const C = {
  bg:"#1a1b2e", card:"#252742", accent:"#4fc3f7", accentDim:"#2a6f8a",
  gold:"#ffd54f", text:"#e8eaf6", textDim:"#9e9eaf", border:"#3a3c5a",
  owned:"#2e7d32", room1:"#e65100", room2:"#6a1b9a", roomBoth:"#1565c0",
  danger:"#ef5350", catFurn:"#4a6741", catDeco:"#6a4176",
  amber:"#ffb74d", purple:"#ce93d8", hlNA:"#4fc3f7",
};

// ========== ルームカラー・ラベルヘルパー ==========
export const isInRoom = (r, t) => r === 3 || r === t;
export const roomColor = (r) => r===3?C.roomBoth:r===2?C.room2:r===1?C.room1:C.border;
export const roomLabel = (r) => r===3?"R1&R2":r===2?"R2":r===1?"R1":"未設置";

// ========== ボタンスタイルヘルパー ==========
export const btn = (on, color) => ({
  padding:"5px 10px", border:"none", borderRadius:6, cursor:"pointer",
  fontSize:11, fontWeight:600,
  background: on ? (color || C.accent) : C.card,
  color: on ? "#000" : C.textDim,
  transition:"all .2s", whiteSpace:"nowrap",
});
