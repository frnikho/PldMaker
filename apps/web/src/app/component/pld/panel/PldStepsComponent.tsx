import * as React from "react";
import { Button, ProgressIndicator, ProgressStep, Tile } from "carbon-components-react";
import { IncompleteStatusIcon } from "../../../icon/IncompleteStatusIcon";
import { Organization, Pld } from "@pld/shared";
import {Toggletip, ToggletipButton, ToggletipContent} from '@carbon/react';
import {Information, CheckmarkOutline, Incomplete, Classification} from '@carbon/icons-react';
import { useState } from "react";
import { UpdatePldTypeModal } from "../../../modal/pld/ChangePldTypeModal";
import { TileStyle } from "@pld/ui";
import { ButtonStyle } from "@pld/ui";

type Props = {
  pld: Pld;
  org: Organization;
  onPldStepUpdated: () => void;
};
export const PldStepsComponent = (props: Props) => {

  const [modal, setModal] = useState<boolean>(false);

  const onUpdated = () => {
    setModal(false);
    props.onPldStepUpdated();
  }

  return (
    <>
      <UpdatePldTypeModal
        org={props.org}
        pld={props.pld}
        open={modal}
        onDismiss={() => setModal(false)}
        onSuccess={onUpdated}/>
      <Tile style={TileStyle.default}>
        <div style={{display: 'flex'}}>
          <h4 style={{fontWeight: 'bold'}}>État d'avancement</h4>
          <div style={{marginLeft: 'auto', marginTop:'auto', marginBottom: 'auto', display: 'flex', justifyContent: 'center'}}>
            <Toggletip>
              <ToggletipButton>
                <Information size={16} />
              </ToggletipButton>
              <ToggletipContent>
                <div style={{display: 'flex'}}>
                  <CheckmarkOutline size={14} style={{marginRight: '14px', marginTop: 'auto', marginBottom: 'auto'}}/>
                  <p>Completer</p>
                </div>
                <div style={{display: 'flex'}}>
                  <Incomplete size={14} style={{marginRight: '14px', marginTop: 'auto', marginBottom: 'auto'}}/>
                  <p>En cours</p>
                </div>
                <div style={{display: 'flex'}}>
                  <IncompleteStatusIcon size={14} style={{marginRight: '14px', marginTop: 'auto', marginBottom: 'auto'}}/>
                  <p>Pas commencer</p>
                </div>
              </ToggletipContent>
            </Toggletip>
          </div>
        </div>
        <ProgressIndicator style={{marginTop: '20px'}} vertical>
          <ProgressStep
            complete
            label="Création"
          />
          {props.pld.steps.map((step, index) => {
            if (props.pld === undefined)
              return null;
            const currentIndex = props.pld.steps.findIndex((step) => step === props.pld.currentStep);
            return (<ProgressStep
              key={index}
              complete={index < currentIndex || new Date(props.pld.endingDate).getTime() < new Date().getTime()}
              current={currentIndex === index}
              label={`Édition (${step})`}
            />);
          }).filter((e) => e !== null)}
          <ProgressStep
            complete={new Date(props.pld.endingDate).getTime() < new Date().getTime()}
            label="Signé"
          />
        </ProgressIndicator>
        <div style={{marginTop: 18}}>
          <Button disabled={new Date(props.pld.endingDate).getTime() < new Date().getTime()} style={ButtonStyle.default} renderIcon={Classification} onClick={() => setModal(true)}>Changer l'état d'avancement</Button>
        </div>
      </Tile>
    </>
  )
};
