import { ButtonSkeleton, Column, FileUploaderSkeleton, Grid, SelectSkeleton, TextInputSkeleton, Tile } from "carbon-components-react";
import React from "react";

import {Stack} from '@carbon/react';

export function UserInfoSkeleton() {
  return (
    <Tile>
      <Grid>
        <Column xlg={6}>
          <TextInputSkeleton/>
          <TextInputSkeleton/>
          <TextInputSkeleton/>
        </Column>
        <Column xlg={8}>
          <Stack orientation={"vertical"}>
            <FileUploaderSkeleton/>
          </Stack>
        </Column>
      </Grid>
      <TextInputSkeleton/>
      <TextInputSkeleton/>
      <SelectSkeleton/>
      <SelectSkeleton/>
      <div style={{marginTop: 24}}>
        <ButtonSkeleton/>
      </div>
    </Tile>
  )
}
