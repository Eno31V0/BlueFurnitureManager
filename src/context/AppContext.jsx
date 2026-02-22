import { SK, initState } from "../storage.js";

const { createContext, useContext, useReducer, useState, useEffect, useMemo, useCallback } = React;

// ========== Reducer ==========
function appReducer(state, action) {
  switch (action.type) {
    case "TOGGLE_FURNITURE_OWNED": {
      const prev = state.furniture[action.fid] || { owned: false, room: 0 };
      return { ...state, furniture: { ...state.furniture, [action.fid]: { ...prev, owned: !prev.owned } } };
    }
    case "SET_FURNITURE_ROOM": {
      const prev = state.furniture[action.fid] || { owned: false, room: 0 };
      return { ...state, furniture: { ...state.furniture, [action.fid]: { ...prev, room: action.room } } };
    }
    case "TOGGLE_ROOM": {
      const prev = state.furniture[action.fid] || { owned: false, room: 0 };
      const r = prev.room;
      const tr = action.targetRoom;
      const newRoom = r === 3 ? (tr === 1 ? 2 : 1) : r === tr ? 0 : r === 0 ? tr : 3;
      return { ...state, furniture: { ...state.furniture, [action.fid]: { ...prev, room: newRoom } } };
    }
    case "TOGGLE_STUDENT_OWNED": {
      const prev = state.students[action.sid] || { owned: false, star: 3, bond: 1, hasEx: false };
      return { ...state, students: { ...state.students, [action.sid]: { ...prev, owned: !prev.owned } } };
    }
    case "SET_STUDENT_STAR": {
      const prev = state.students[action.sid] || { owned: false, star: 3, bond: 1, hasEx: false };
      return { ...state, students: { ...state.students, [action.sid]: { ...prev, star: action.star, bond: Math.min(prev.bond, getBondCap(action.star)) } } };
    }
    case "SET_STUDENT_BOND": {
      const prev = state.students[action.sid] || { owned: false, star: 3, bond: 1, hasEx: false };
      const bond = Math.max(1, Math.min(action.bond, getBondCap(prev.star)));
      return { ...state, students: { ...state.students, [action.sid]: { ...prev, bond } } };
    }
    case "TOGGLE_STUDENT_EX": {
      const prev = state.students[action.sid] || { owned: false, star: 3, bond: 1, hasEx: false };
      return { ...state, students: { ...state.students, [action.sid]: { ...prev, hasEx: !prev.hasEx } } };
    }
    case "REORDER_FURNITURE": {
      const order = [...(state.furnitureOrder || [])];
      const fi = order.indexOf(action.fromId);
      const ti = order.indexOf(action.toId);
      if (fi < 0 || ti < 0) return state;
      order.splice(fi, 1);
      order.splice(ti, 0, action.fromId);
      return { ...state, furnitureOrder: order };
    }
    case "ADD_CUSTOM_STUDENT": {
      const { student, initialState: is } = action;
      return {
        ...state,
        customStudents: [...(state.customStudents || []), student],
        students: { ...state.students, [student.id]: is },
      };
    }
    case "ADD_CUSTOM_FURNITURE": {
      const { furniture, initialState: is } = action;
      return {
        ...state,
        customFurniture: [...(state.customFurniture || []), furniture],
        furniture: { ...state.furniture, [furniture.id]: is },
        furnitureOrder: [...(state.furnitureOrder || []), furniture.id],
      };
    }
    case "DELETE_CUSTOM_STUDENT":
      return { ...state, customStudents: (state.customStudents || []).filter(s => s.id !== action.id) };
    case "DELETE_CUSTOM_FURNITURE":
      return {
        ...state,
        customFurniture: (state.customFurniture || []).filter(f => f.id !== action.id),
        furnitureOrder: (state.furnitureOrder || []).filter(fid => fid !== action.id),
      };
    case "APPLY_MASTER_EDIT_FURN": {
      const { fid, name, targets, series } = action;
      const me = state.masterEdits || { furniture: {}, students: {}, series: {} };
      return {
        ...state,
        masterEdits: {
          ...me,
          furniture: { ...me.furniture, [fid]: { name, targets } },
          series: { ...me.series, [name]: series },
        },
      };
    }
    case "APPLY_MASTER_EDIT_STUDENT": {
      const { sid, name } = action;
      const me = state.masterEdits || { furniture: {}, students: {}, series: {} };
      return { ...state, masterEdits: { ...me, students: { ...me.students, [sid]: { name } } } };
    }
    case "IMPORT_STATE":
      return initState(action.data);
    case "RESET_STATE":
      return initState();
    default:
      return state;
  }
}

// ========== Context ==========
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, undefined, () => initState());
  const [loaded, setLoaded] = useState(false);
  const [hlScope, setHlScope] = useState("all");
  const [hlThreshold, setHlThreshold] = useState("cap");
  const [editMode, setEditMode] = useState(false);
  const [stateBackup, setStateBackup] = useState(null);
  const [editFurnId, setEditFurnId] = useState(null);
  const [editStudentId, setEditStudentId] = useState(null);
  const [editDraft, setEditDraft] = useState({});

  // Load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SK);
      if (raw) dispatch({ type: "IMPORT_STATE", data: JSON.parse(raw) });
    } catch {}
    setLoaded(true);
  }, []);

  // Save to localStorage (suppress during editMode)
  useEffect(() => {
    if (!loaded || editMode) return;
    try { localStorage.setItem(SK, JSON.stringify(state)); } catch {}
  }, [state, loaded, editMode]);

  // Edit mode callbacks
  const enterEdit = useCallback(() => {
    setStateBackup(JSON.parse(JSON.stringify(state)));
    setEditMode(true); setEditFurnId(null); setEditStudentId(null);
  }, [state]);
  const saveEdit = useCallback(() => {
    setEditMode(false); setStateBackup(null); setEditFurnId(null); setEditStudentId(null);
    try { localStorage.setItem(SK, JSON.stringify(state)); } catch {}
  }, [state]);
  const cancelEdit = useCallback(() => {
    if (stateBackup) dispatch({ type: "IMPORT_STATE", data: stateBackup });
    setEditMode(false); setStateBackup(null); setEditFurnId(null); setEditStudentId(null);
  }, [stateBackup]);

  // Derived data
  const allStudents = useMemo(() => [...INIT_STUDENTS, ...(state.customStudents || [])], [state.customStudents]);
  const allFurniture = useMemo(() => [...INIT_FURNITURE, ...(state.customFurniture || [])], [state.customFurniture]);
  const allStudentMap = useMemo(() => Object.fromEntries(allStudents.map(s => [s.id, s])), [allStudents]);
  const allFurnMap = useMemo(() => Object.fromEntries(allFurniture.map(f => [f.id, f])), [allFurniture]);

  const me = state.masterEdits || { furniture: {}, students: {}, series: {} };
  const eFurnName = useCallback((f) => me.furniture?.[f.id]?.name || f.name, [me.furniture]);
  const eFurnTargets = useCallback((f) => me.furniture?.[f.id]?.targets || f.targets, [me.furniture]);
  const eFurnSeries = useCallback((f) => {
    const n = eFurnName(f);
    return me.series?.[n] ?? (SERIES_MAP[n] || SERIES_MAP[f.name] || "");
  }, [eFurnName, me.series]);
  const eStudentName = useCallback((s) => me.students?.[s.id]?.name || s.name, [me.students]);

  const gss = useCallback((sid) => state.students[sid] || { owned: false, star: STUDENT_MAP[sid]?.star || 3, bond: 1, hasEx: STUDENT_MAP[sid]?.hasEx || false }, [state.students]);
  const gfs = useCallback((fid) => state.furniture[fid] || { owned: false, room: 0 }, [state.furniture]);

  const motionStudentIds = useMemo(() => {
    const s = new Set();
    allFurniture.forEach(f => eFurnTargets(f).forEach(sid => s.add(sid)));
    return s;
  }, [allFurniture, eFurnTargets]);

  const bondCheck = useCallback((sid) => {
    const s = gss(sid);
    if (!s.owned) return false;
    if (hlThreshold === "cap") return s.bond >= getBondCap(s.star);
    return s.hasEx ? s.bond >= 20 : s.bond >= 9;
  }, [gss, hlThreshold]);

  const furnIsAchieved = useCallback((f) => {
    const targets = eFurnTargets(f);
    if (targets.length === 0) return false;
    const ot = targets.filter(sid => gss(sid).owned);
    if (ot.length === 0) return false;
    return hlScope === "all" ? ot.every(bondCheck) : ot.some(bondCheck);
  }, [eFurnTargets, gss, hlScope, bondCheck]);

  const furnHasOwnedNotAchieved = useCallback((f) => {
    const targets = eFurnTargets(f);
    if (targets.length === 0) return false;
    const ot = targets.filter(sid => gss(sid).owned);
    if (ot.length === 0) return false;
    return !furnIsAchieved(f);
  }, [eFurnTargets, gss, furnIsAchieved]);

  const stats = useMemo(() => {
    const of = allFurniture.filter(f => gfs(f.id).owned).length;
    const r1 = allFurniture.filter(f => { const r = gfs(f.id).room; return r === 1 || r === 3; }).length;
    const r2 = allFurniture.filter(f => { const r = gfs(f.id).room; return r === 2 || r === 3; }).length;
    return { of, r1, r2, tf: allFurniture.length };
  }, [state.furniture, allFurniture]);

  const value = {
    state, dispatch, loaded,
    hlScope, setHlScope,
    hlThreshold, setHlThreshold,
    editMode, enterEdit, saveEdit, cancelEdit,
    editFurnId, setEditFurnId,
    editStudentId, setEditStudentId,
    editDraft, setEditDraft,
    allStudents, allFurniture, allStudentMap, allFurnMap,
    me, eFurnName, eFurnTargets, eFurnSeries, eStudentName,
    gss, gfs,
    motionStudentIds,
    bondCheck, furnIsAchieved, furnHasOwnedNotAchieved,
    stats,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
};
