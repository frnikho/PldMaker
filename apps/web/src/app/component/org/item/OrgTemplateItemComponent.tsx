import { Template } from "@pld/shared";
import { SERVER_URL_ASSETS } from "../../../util/User";
import { formatLongDate } from "@pld/utils";
import { ClickableTile } from "carbon-components-react";
import React from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  template: Template;
};

export const OrgTemplateItemComponent = (props: Props) => {

  const navigate = useNavigate();

  return (
    <ClickableTile onClick={() => navigate(`template/${props.template._id}`)} style={{borderRadius: 10}}>
      <p style={{fontWeight: 600, fontSize: 26}}>{props.template.title}</p>
      <br/>
      <div style={{width: '100%', textAlign: 'center', marginTop: 20, marginBottom: 20}}>
        <img style={{maxWidth: '100%', height: 160}} src={props.template.picture}/>
      </div>
      <p>Dernière mise a jour le</p>
      <p style={{fontWeight: 'bold'}}>{formatLongDate(new Date(props.template.updatedDate))}</p>
    </ClickableTile>
  )
};
