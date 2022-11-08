import { useAuth } from "./useAuth";
import { useEffect, useState } from "react";
import { LoginState } from "../context/UserContext";
import { useNavigate, useSearchParams } from "react-router-dom";

export type PageOptions<T = any> = {
  redirectIfNotLogged: boolean;
  redirectPage: '/';
  params: T;
}

export const defaultPageOptions = (): PageOptions => ({
  redirectIfNotLogged: true,
  redirectPage: '/',
  params: {},
})

export function usePage<T>(options: Partial<PageOptions> = defaultPageOptions()) {

  const {isLogged} = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (isLogged === LoginState.not_logged && options.redirectIfNotLogged) {
      navigate(options.redirectPage ?? '/');
    }
    if (isLogged === LoginState.logged || isLogged === LoginState.not_logged) {
      setIsReady(true);
    }
  }, [isLogged]);

  return {
    params: searchParams,
    isReady,
  }
}
