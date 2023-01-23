import "./App.css";
import { BrowserRouter } from "react-router-dom";
import Router from "./Router";
import { createContext, useReducer } from "react";
import { reducer } from "./reducers/userReducer";
import { initialState } from "./reducers/initialState";

export const UserContext = createContext();

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      <UserContext.Provider value={{ state, dispatch }}>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </UserContext.Provider>
    </>
  );
}

export default App;
