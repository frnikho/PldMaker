import * as React from "react";
import ReactMarkdown from "react-markdown";

import {Stack} from '@carbon/react';

export type Changelog = {
  name: string;
  version: string;
  date: string;
  contents: string;
}

type Props = {
  changelog: Changelog;
};
export const ChangelogComponent = (props: Props) => {
  return (
    <Stack gap={2}>
      <h4 style={{fontWeight: 'bold', fontSize: 22}}>{props.changelog.version} {props.changelog.name}</h4>
      <p style={{marginBottom: 18}}>date: {props.changelog.date}</p>
      <ReactMarkdown>
        {props.changelog.contents}
      </ReactMarkdown>
    </Stack>
  );
};
