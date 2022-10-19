import * as React from "react";
import {ButtonSkeleton, SkeletonPlaceholder, Tile} from "carbon-components-react";
import { IncompleteStatusIcon } from "../../../icon/IncompleteStatusIcon";
import {Toggletip, ToggletipButton, ToggletipContent} from '@carbon/react';
import {Information, CheckmarkOutline, Incomplete} from '@carbon/icons-react';
import { TileStyle } from "../../../style/TileStyle";


export const PldStepsSkeleton = () => {

  return (
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
      <SkeletonPlaceholder style={{height: 200, marginTop: 20}}/>
      <div style={{marginTop: 18}}>
        <ButtonSkeleton/>
      </div>
    </Tile>
  )
};
