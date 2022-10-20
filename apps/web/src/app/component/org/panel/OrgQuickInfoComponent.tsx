import * as React from "react";
import { Tile } from "carbon-components-react";
import { formatLongDate } from "@pld/utils";

import {Stack} from '@carbon/react';
import { Organization } from "@pld/shared";
import { TileStyle } from "@pld/ui";

type Props = {
  org: Organization;
};
export const OrgQuickInfoComponent = (props: Props) => {
  return (
    <Tile style={TileStyle.default}>
      <Stack gap={6}>
        <Stack gap={1}>
          <h4 style={{fontWeight: 600}}>Date de création :</h4>
          <p>{formatLongDate(new Date(props.org.created_date ?? ""))}</p>
        </Stack>
        <Stack gap={1}>
          <h4 style={{fontWeight: 600}}>Date de mise à jour :</h4>
          <p>{formatLongDate(new Date(props.org.updated_date ?? ""))}</p>
        </Stack>
      </Stack>
    </Tile>
  );
};
