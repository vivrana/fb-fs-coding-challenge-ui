import { useState } from "react";

const localStorageKey = "USER_ID";

function loadUserId() {
  try {
    return JSON.parse(localStorage.getItem(localStorageKey) ?? "") as number;
  } catch (e) {
    return null;
  }
}

function storeUserId(userId: number | null) {
  localStorage.setItem(localStorageKey, JSON.stringify(userId));
}

export interface LoginState {
  userId: number | null;
  setUserId: (userId: number) => void;
  logOut: () => void;
  isLoggedIn: boolean;
}

export function useLoginState(): LoginState {
  const [userId, setUserIdState] = useState<number | null>(loadUserId());

  const setUserId = (userId: number | null) => {
    setUserIdState(userId);
    storeUserId(userId);
  };

  const logOut = () => setUserId(null);

  return {
    userId,
    logOut,
    setUserId,
    isLoggedIn: userId !== null,
  };
}
