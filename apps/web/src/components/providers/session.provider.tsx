"use client";
import * as React from "react";
import { createContext, Dispatch, useEffect, useReducer } from "react";
import { io } from "socket.io-client";

export interface Asset {
  image: any;
  symbol: string;
  timestamp: number;
  bid: number;
  ask: number;
  spot: number;
  change: number;
}

export interface State {
  rates: Asset[];
}

export interface Action {
  type: string;
  payload?: unknown;
}

const initialState: State = {
  rates: [],
};

export const SessionContext = createContext<{
  state: State;
  dispatch: Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => undefined,
});

export enum SessionReducerActions {
  RATES_CHANGE = "RATES_CHANGE",
}

const sessionReducerActionsMap = new Map([
  [
    SessionReducerActions.RATES_CHANGE,
    (state: State, action: Action) => {
      return { ...state, rates: action.payload as State["rates"] };
    },
  ],
]);

const createInitialState = (): State => {
  return initialState;
};

const sessionReducer = (state: State, action: Action): State => {
  if (sessionReducerActionsMap.has(action.type as SessionReducerActions)) {
    return sessionReducerActionsMap.get(action.type as SessionReducerActions)!(
      state,
      action,
    );
  }
  return state;
};

export function SessionContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(
    sessionReducer,
    null,
    createInitialState,
  );

  useEffect(() => {
    const socketInstance = io("http://localhost:5000/markets", {
      path: "/ws",
    });
    socketInstance.on("connect", () => console.log("Connected to Socket.io"));
    socketInstance.emit("subscribe", { channel: "rates" });
    socketInstance.on("data", (data: any) => {
      dispatch({ type: SessionReducerActions.RATES_CHANGE, payload: data });
    });
    socketInstance.on("disconnect", () =>
      console.log("Disconnected from Socket.io"),
    );
    return () => {
      socketInstance.removeListener("data");
    };
  }, []);

  return (
    <SessionContext.Provider value={{ state, dispatch }}>
      {children}
    </SessionContext.Provider>
  );
}
