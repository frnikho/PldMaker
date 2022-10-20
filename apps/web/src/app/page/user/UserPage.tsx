import React, { useContext, useEffect, useState } from "react";
import { LoginState} from "../../context/UserContext";

import { Stack } from "@carbon/react";
import { UserInfoComponent } from "../../component/user/info/UserInfoComponent";
import { toast } from "react-toastify";
import { Mfa, User } from "@pld/shared";
import { language } from "../../language";
import { LanguageContext, LanguageContextState } from "../../context/LanguageContext";
import { UserSecurityComponent } from "../../component/user/security/UserSecurityComponent";
import { UserApiController } from "../../controller/UserApiController";
import { useAuth } from "../../hook/useAuth";

export default function UserPage() {

  const userCtx = useAuth();
  const languageCtx = useContext<LanguageContextState>(LanguageContext);
  const [mfa, setMfa] = useState<Mfa[] | undefined>(undefined);

  useEffect(() => {
    if (userCtx.isLogged === LoginState.logged) {
      UserApiController.getMfa(userCtx.accessToken, (mfa, error) => {
        if (error) {
          toast(error.message, {type: 'error'});
        } else {
          setMfa(mfa);
        }
      });
    }
  }, [userCtx]);

  const loadMfa = () => {
    UserApiController.getMfa(userCtx.accessToken, (mfa, error) => {
      if (error) {
        toast(error.message, {type: 'error'});
      } else {
        setMfa(mfa);
      }
    });
  }

  const onUserUpdated = (user: User) => {
    toast('Informations de votre profile mis à jour 👍', {type: 'success'});
    userCtx.refreshUser((user, error) => {
      console.log(user, error);
    });
  }

  const onMfaEnabled = (newToken: string): boolean => {
    userCtx.saveOtpToken(newToken, (user, error) => {
      if (error) {
        toast('Une erreur est survenue !', {type: 'error'});
        return false;
      } else {
        toast('2FA Activé', {type: 'success'});
        loadMfa();
        return true;
      }
    });
    return true;
  }

  const onMfaDisable = (): boolean => {
    loadMfa();
    return true;
  }

  return (
    <Stack gap={4}>
      <h2 style={style.title}>{languageCtx.translate(language.pages.myProfile.title)}</h2>
      <UserInfoComponent onUpdateUser={onUserUpdated} userContext={userCtx} user={userCtx.user}/>
      <h3 style={style.title}>{languageCtx.translate(language.pages.myProfile.security.title)}</h3>
      <UserSecurityComponent onMfaEnabled={onMfaEnabled} onMfaDisabled={onMfaDisable} userContext={userCtx} languageCtx={languageCtx} mfa={mfa}/>
{/*      <h3 style={style.title}>{languageCtx.translate(language.pages.myProfile.preference.title)}</h3>
      <h3 style={style.dangerTitle}>{languageCtx.translate(language.pages.myProfile.delete.title)}</h3>*/}
    </Stack>
  );
}

const style = {
  dangerTitle: {
    fontWeight: 'bold',
    color: '#E74C3C',
    marginTop: 18,
  },
  title: {
    fontWeight: 'bold',
    marginTop: 18,
  },
}
