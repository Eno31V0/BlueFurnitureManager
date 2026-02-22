// ========== Storage キー & 初期化 ==========
export const SK = "ba-mgr-v5";

export const initState = (prev) => ({
  version: 5,
  students: Object.fromEntries(INIT_STUDENTS.map(s => {
    const p = prev?.students?.[s.id];
    return [s.id, {
      owned: p?.owned ?? false,
      star:  p?.star  ?? s.star,
      bond:  p?.bond  ?? 1,
      hasEx: p?.hasEx ?? s.hasEx,
    }];
  })),
  furniture: Object.fromEntries(INIT_FURNITURE.map(f => {
    const p = prev?.furniture?.[f.id];
    return [f.id, { owned: p?.owned ?? false, room: p?.room ?? 0 }];
  })),
  furnitureOrder: prev?.furnitureOrder || INIT_FURNITURE.map(f => f.id),
  customStudents:  prev?.customStudents  || [],
  customFurniture: prev?.customFurniture || [],
  masterEdits: prev?.masterEdits || { furniture: {}, students: {}, series: {} },
});
