import * as React from "react";
import {
  ButtonSkeleton,
  NumberInputSkeleton,
  SelectSkeleton,
  TextAreaSkeleton,
  TextInputSkeleton,
  Tile
} from "carbon-components-react";

import { Stack } from '@carbon/react';

import { TileStyle } from "../../../style/TileStyle";
import {PldRevisionsSkeleton} from "./PldRevisionsSkeleton";

export const PldInfoSkeleton = () => {

  return (
    <Tile style={TileStyle.default}>
      <Stack gap={4}>
        <TextInputSkeleton />
        <TextAreaSkeleton/>
        <NumberInputSkeleton/>
        <SelectSkeleton/>
        <ButtonSkeleton/>
        <PldRevisionsSkeleton/>
        <ButtonSkeleton/>
      </Stack>
    </Tile>
  );
};
