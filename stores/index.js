import { create as _create } from "zustand";

const storeResetFns = new Set();

export const resetAllStores = () => {
  storeResetFns.forEach((resetFn) => resetFn());
}

export const create = (() => {
  return (stateCreator) => {
    const store = _create(stateCreator);
    const initialState = store.getState();
    storeResetFns.add(() => store.setState(initialState, true));
    return store;
  }
});