import { useContext, useEffect, useState } from "react";
import { UserContext, UserContextProps } from "../context/UserContext";
import { useSearchParams } from "react-router-dom";

export function useAuth() {

  const userCtx = useContext<UserContextProps>(UserContext);
  const [token, setToken] = useState<string | undefined>(undefined);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token !== null) {
      setToken(token);
    }
  }, [searchParams]);


  return {
    ...userCtx,
    accessToken: token ?? userCtx.accessToken,
  }

}
