import * as React from "react";
import { TemplateSettingsForm } from "../create/CreateTemplateSettingsComponent";
import { getPlaceholder } from "../../../util/Placeholders";
import { Dod, DodStatus, Organization, Pld, Review, User } from "@pld/shared";
import { Fragment } from "react";
import { Text } from "../../../util/Dom";

type Props = {
  org: Organization;
  pld: Pld;
  dods: Dod[];
  status: DodStatus[];
  settings: TemplateSettingsForm;
  review: Review;
};
export const TemplateReportPreviewComponent = (props: Props) => {

  const getDodReport = (user: User, dods: Dod[]) => {
    return props.settings.rapport.generateDodWithStatus.map((status, index) => {
      const currentStatus = props.status.find((s) => s._id === status.id);
      if (currentStatus === undefined) {
        return;
      }
      const filteredDods = dods.filter((d) => d.status._id === status.id);
      return (
        <Fragment key={index}>
          <Text>
            {getPlaceholder(props.settings.rapport.userDod.status.text, {org: props.org, pld: props.pld, dodStatus: currentStatus})}
          </Text>
          {filteredDods.map((dod, index) =>
              <Text key={index}>{getPlaceholder(props.settings.rapport.userDod.dods.text, {dod: dod, org: props.org, pld: props.pld})}</Text>
            )}
        </Fragment>
      )
    })
  }

  const getUserReport = () => {
    const members = [...props.org.members, props.org.owner].map((u) => ({
      user: u,
      dod: props.dods.filter((d) => d.estimatedWorkTime.some((wt) => wt.users.some((wtu) => u._id === wtu._id)))
    }));
    return members.map((u, index) => {
      return (
        <tr key={index}>
          <td style={style(props.settings).subtitleCell}>
            <Text>{getPlaceholder(props.settings.rapport.userDod.user.text, {org: props.org, user: u.user, pld: props.pld})}</Text>
          </td>
          <td style={style(props.settings).subtitleCell}>
            {getDodReport(u.user, u.dod)}
          </td>
        </tr>
      )
    })
  }

  return (
    <table>
      <tbody>
      <tr>
        <td style={style(props.settings).mainTitleCell} colSpan={2}>
          <Text style={{textAlign: 'center'}}>{getPlaceholder(props.settings.rapport.title.text, {org: props.org, pld: props.pld})}</Text>
          <Text style={{textAlign: 'center'}}>{getPlaceholder(props.settings.rapport.subtitle, {org: props.org})}</Text>
        </td>
      </tr>
      <tr>
        <td style={style(props.settings).titleCell} colSpan={2}>
          <Text style={{width: '100%'}}>{getPlaceholder(props.settings.rapport.globalProgress.title.text, {org: props.org, pld: props.pld})}</Text>
        </td>
      </tr>
      <tr>
        <td style={style(props.settings).contentCell} colSpan={2}>
          {props.review.domains.filter((a) => props.settings.rapport.globalProgress.generateSections.find((b) => a.domain === b)).map((s, index) =>
            <Text key={index}>
              {`${s.domain}: ${s.advancement}`}
            </Text>)}
        </td>
      </tr>
      <tr>
        <td style={style(props.settings).subtitleColorCell}>
          <Text>{getPlaceholder(props.settings.rapport.progress.title.text, {org: props.org, pld: props.pld})}</Text>
        </td>
        <td style={style(props.settings).subtitleColorCell}>
          <Text>{getPlaceholder(props.settings.rapport.progress.subtitle.text, {org: props.org, pld: props.pld})}</Text>
        </td>
      </tr>
      {getUserReport()}
      <tr>
        <td style={style(props.settings).mainTitleCell} colSpan={2}>
          <Text style={{textAlign: 'center'}}>{getPlaceholder(props.settings.rapport.blockingPoint.text, {org: props.org})}</Text>
        </td>
      </tr>
      <tr>
        <td style={style(props.settings).titleCell} colSpan={2}>
          <Text>{props.review.blockingPoint}</Text>
        </td>
      </tr>
      <tr>
        <td style={style(props.settings).mainTitleCell} colSpan={2}>
          <Text style={{textAlign: 'center'}}>{getPlaceholder(props.settings.rapport.globalComment.text, {org: props.org})}</Text>
        </td>
      </tr>
      <tr>
        <td style={style(props.settings).titleCell} colSpan={2}>
          <Text>{props.review.blockingPoint}</Text>
        </td>
      </tr>
      </tbody>
    </table>
  );
};

const style = (settings: TemplateSettingsForm) => ({
  dod: {
    marginBottom: 20,
  },
  mainTitleCell: {
    backgroundColor: `${settings.color.mainColor}`,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'black',
  },
  titleCell: {
    backgroundColor: `#${settings.color.mainColor}`,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'black'
  },
  subtitleColorCell: {
    backgroundColor: settings.color.mainColor,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'black',
    width: '50%',
  },
  subtitleCell: {
    backgroundColor: settings.color.secondaryColor,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'black',
    width: '50%',
  },
  contentCell: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'black',
  },
  twoColumns: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'black',
    width: '50%',
  }
})
