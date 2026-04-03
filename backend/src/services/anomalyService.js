import { store } from "../utils/inMemoryStore.js";

export function getAnomalies() {
  return store.anomalies;
}
