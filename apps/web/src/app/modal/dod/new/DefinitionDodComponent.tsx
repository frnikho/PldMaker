import { Button, Column, FormLabel, Grid, TextInput } from "carbon-components-react";
import React from "react";

import {Stack} from '@carbon/react';

import {Close} from '@carbon/icons-react';

type Props = {
  definitions: string[];
  onDefinitionEdited: (index: number, definition: string) => void;
  onDefinitionDeleted: (index: number) => void;
};
export const DefinitionDodComponent = (props: Props) => {

  return (
    <Stack gap={2}>
      <FormLabel>Definitions of Done</FormLabel>
      {props.definitions.map((dod, index) => {
        return (
        <Grid key={index} style={{marginTop: '0px'}}>
          <Column lg={11} md={10}>
            <TextInput
            required id={"dod-"} labelText={""} hideLabel={true} value={dod} onChange={(e) => props.onDefinitionEdited(index, e.currentTarget.value)}/>
          </Column>
          <Column lg={1} style={{marginTop: 'auto', marginBottom: 'auto'}}>
            <Stack gap={2} orientation={"horizontal"}>
              <Button iconDescription={'Supprimer'} size={'md'} kind={"ghost"} hasIconOnly renderIcon={Close} onClick={() => props.onDefinitionDeleted(index)}/>
            </Stack>
          </Column>
        </Grid>
        )
      })}
    </Stack>
  )
};
