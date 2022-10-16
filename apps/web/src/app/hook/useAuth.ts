import { useContext } from "react";
import { UserContext, UserContextProps } from "../context/UserContext";

export function useAuth() {

  const userCtx = useContext<UserContextProps>(UserContext);

  return {
    ...userCtx
  }

}
