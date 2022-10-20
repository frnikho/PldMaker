import { Column, Grid, SkeletonPlaceholder, SkeletonText, Tile } from "carbon-components-react";
import React from "react";
import { TileStyle } from "@pld/ui";

export const OrgItemSkeleton = () => {
  return (
    <Tile style={TileStyle.default}>
      <SkeletonText/>
      <br/>
      <div style={{width: '100%', textAlign: 'center', marginTop: 20, marginBottom: 20}}>
        <SkeletonPlaceholder style={{maxWidth: '100%', height: 160}}/>
      </div>
      <SkeletonText/>
      <SkeletonText/>
    </Tile>
  );
};

export const OrgListSkeleton = () => {

  return (
    <Grid>
      {[1, 2].map((a, index) =>
        <Column key={index} sm={4} md={8} lg={5}>
          <OrgItemSkeleton/>
        </Column>
      )}
    </Grid>
  )

}
