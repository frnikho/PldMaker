import { ClickableTile, SkeletonPlaceholder, SkeletonText } from "carbon-components-react";
import React from "react";
import { TileStyle } from "@pld/ui";

export const OrgCalendarItemSkeleton = () => {

  return (
    <ClickableTile style={TileStyle.default}>
      <SkeletonText style={{height: 40}}/>
      <SkeletonText/>
      <SkeletonPlaceholder style={{height: 250, width: 'auto'}}/>
    </ClickableTile>
  );
};
