import * as React from "react";
import {
  Accordion,
  DataTableSkeleton,
} from "carbon-components-react";

import { Stack } from '@carbon/react';

export const PldRevisionsSkeleton = () => {
  return (
    <Accordion>
      <Stack gap={5}>
        <DataTableSkeleton compact columnCount={5} rowCount={3} showToolbar={false}/>
      </Stack>
    </Accordion>
  )
}


