import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
// import produce from 'immer';
import { produce } from 'immer';
import debounce from 'lodash.debounce';
import { v4 as uuid } from 'uuid';
import api from '../../../api';

const debouncedSave = debounce(async (get) => {
  const s = get();
  if (!s.designId) return;
  await api.put(`/designs/${s.designId}`, {
    name: s.name,
    width: s.width,
    height: s.height,
    background: s.background,
    elements: s.elements,
  });
}, 700);

export const useEditorStore = create(devtools((set, get) => ({
  designId: null,
  projectId: null,
  name: 'Untitled',
  width: 1080,
  height: 1080,
  background: '#ffffff',
  elements: [],
  selectedIds: [],
  zoom: 1,
  pan: { x: 0, y: 0 },
  past: [],
  future: [],

  // setDesign(state) { set(state); },
  setDesign(state) {
    set((s) => ({
      ...s,
      ...state,
    }));
  },


  pushHistory() {
    const { past, elements } = get();
    set({ past: [...past, elements?.map((e) => ({ ...e, attrs: { ...e.attrs } }))], future: [] });
  },

  addElement(el) {
    get().pushHistory();
    set(produce((s) => {
      if (!s.elements) s.elements = [];
      s.elements.push({ id: uuid(), locked: false, hidden: false, ...el });
    }));
    debouncedSave(get);
  },


  updateElement(id, patch) {
    get().pushHistory();
    set(produce((s) => { const item = s.elements.find((e) => e.id === id); if (item) item.attrs = { ...item.attrs, ...patch }; }));
    debouncedSave(get);
  },

  bulkUpdate(ids, patchFn) {
    get().pushHistory();
    set(produce((s) => { s.elements = s.elements?.map((e) => (ids.includes(e.id) ? patchFn(e) : e)); }));
    debouncedSave(get);
  },

  removeSelected() {
    const ids = get().selectedIds;
    if (!ids.length) return;
    get().pushHistory();
    set(produce((s) => { s.elements = s.elements.filter((e) => !ids.includes(e.id)); s.selectedIds = []; }));
    debouncedSave(get);
  },

  select(ids) { set({ selectedIds: ids }); },

  setZoom(z) { set({ zoom: z }); },

  setPan(p) { set({ pan: p }); },

  setBackground(c) { set({ background: c }); debouncedSave(get); },

  undo() {
    const { past, elements, future } = get();
    if (past.length === 0) return;
    const prev = past[past.length - 1];
    set({ elements: prev, past: past.slice(0, -1), future: [elements, ...future] });
    debouncedSave(get);
  },

  redo() {
    const { past, elements, future } = get();
    if (future.length === 0) return;
    const next = future[0];
    set({ elements: next, past: [...past, elements], future: future.slice(1) });
    debouncedSave(get);
  },
})));
