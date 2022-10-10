import * as React from "react";
import { Tile } from "carbon-components-react";
import { Pld } from "@pld/shared";

import {Stack} from '@carbon/react';

type Props = {
  pld: Pld;
};
export const PldStateComponent = (props: Props) => {
  return (
    <Tile style={style.tile}>
      <Stack gap={6}>
        <h4>Status : {props.pld.status.toUpperCase() ?? ""}</h4>
        {/*{this.showSignButton()}*/}
      </Stack>
    </Tile>
  )
};

const style = {
  tile: {
    borderRadius: 10,
  },
  button: {
    borderRadius: 6,
  }
}
