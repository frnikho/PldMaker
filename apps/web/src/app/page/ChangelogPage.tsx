import { Changelog, ChangelogComponent } from "../component/changelog/ChangelogComponent";
import {Stack} from '@carbon/react';
import * as React from "react";
// eslint-disable-next-line @typescript-eslint/no-var-requires
export const changelog = require('../../assets/configs/changelog.json') as Changelog[];

export const ChangelogPage = () => {

  return (
    <Stack gap={8}>
      <h1 style={{fontWeight: 'bold'}}>Changelog</h1>
      <Stack gap={6}>
        {changelog.map((change, index) => <ChangelogComponent key={index} changelog={change}/>)}
      </Stack>
    </Stack>
  )
};
