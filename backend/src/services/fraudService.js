import { store } from "../utils/inMemoryStore.js";

export function getFraudTransactions() {
  return store.transactions;
}
