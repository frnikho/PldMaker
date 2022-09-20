import React from "react";
import {RequiredUserContextProps} from "../../context/UserContext";
import {Organization, Pld, PldStatus, Dod} from "@pld/shared";
import {MeterChart} from "@carbon/charts-react";

import {Stack} from '@carbon/react';

export type ChartsDashboardProps = {
  org: Organization[];
  pld: Pld[];
  dod: Dod[];
} & RequiredUserContextProps;

export type ChartsDashboardState = unknown

export class ChartsDashboard extends React.Component<ChartsDashboardProps, ChartsDashboardState> {

  constructor(props) {
    super(props);
  }

  override componentDidMount() {
    //
  }

  private getActivePld(): Pld[] {
    return this.props.pld.filter((pld) => pld.status !== PldStatus.signed && new Date(pld.startingDate) > new Date() && new Date(pld.endingDate) < new Date());
  }

  private showDodStatusChart(pld: Pld) {
    if (this.props.dod.length === 0)
      return;
    const orgOfPld = this.props.org.find((org) => org._id === pld.owner._id);
    if (orgOfPld === undefined)
      return;

    const dod = this.props.dod.filter((dod) => (dod.pldOwner as Pld)._id === pld._id);
    const data: any[] = [];
    orgOfPld.dodColors.forEach((dodColors) => {
      const dods = dod.filter((d) => d.status === dodColors.name);
      data.push({
        group: dodColors.name,
        value: dods.length
      })
    })
    return (
      <>
        <MeterChart
          data={data}
          options={{
            title: pld.title,
            height: "130px",
            meter: {
              proportional: {
                total: dod.length,
                unit: "Dods"
              }
            },
          }}/>
      </>
    )
  }

  override render() {
    return (
      <Stack>
        <h1>Avancement des PLDs</h1>
        {this.getActivePld().map((pld) => this.showDodStatusChart(pld))}
      </Stack>
    );
  }

}
