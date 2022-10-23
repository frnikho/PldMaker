import * as React from "react";
import { Tile } from "carbon-components-react";
import { formatLongDate } from "@pld/utils";

import {Stack} from '@carbon/react';
import { Organization } from "@pld/shared";
import { TileStyle } from "@pld/ui";
import { useLanguage } from "../../../hook/useLanguage";

type Props = {
  org: Organization;
};
export const OrgQuickInfoComponent = (props: Props) => {

  const {translate} = useLanguage();

  return (
    <Tile style={TileStyle.default}>
      <Stack gap={6}>
        <Stack gap={1}>
          <h4 style={{fontWeight: 600}}>{translate('lexical.createdDate')}</h4>
          <p>{formatLongDate(new Date(props.org.created_date ?? ""))}</p>
        </Stack>
        <Stack gap={1}>
          <h4 style={{fontWeight: 600}}>{translate('lexical.lastUpdateDate')}</h4>
          <p>{formatLongDate(new Date(props.org.updated_date ?? ""))}</p>
        </Stack>
      </Stack>
    </Tile>
  );
};
