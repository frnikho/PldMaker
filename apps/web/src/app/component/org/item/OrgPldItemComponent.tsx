import { Pld } from "@pld/shared";
import { ClickableTile } from "carbon-components-react";
import { SERVER_URL_ASSETS } from "../../../util/User";
import { formatLongDate } from "@pld/utils";
import React from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  pld: Pld
};
export const OrgPldItemComponent = (props: Props) => {

  const navigate = useNavigate();

  return (
    <ClickableTile onClick={() => navigate(`pld/${props.pld._id}`)} style={{borderRadius: 10}}>
      <p style={{fontWeight: 600, fontSize: 26}}>{props.pld.title} (v{props.pld.version})</p>
      <p>{props.pld.description.substring(0, 160)}</p>
      <br/>
      <div style={{width: '100%', textAlign: 'center', marginTop: 20, marginBottom: 20}}>
        <img alt={'pld picture'} style={{maxWidth: '100%', height: 160}} src={SERVER_URL_ASSETS + props.pld.picture}/>
      </div>
      <p>Dernière mise a jour le</p>
      <p style={{fontWeight: 'bold'}}>{formatLongDate(new Date(props.pld.updated_date))}</p>
    </ClickableTile>
  );
};
