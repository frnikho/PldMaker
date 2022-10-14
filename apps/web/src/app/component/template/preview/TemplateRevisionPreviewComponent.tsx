import * as React from "react";
import { Organization, Pld, PldRevision } from "@pld/shared";
import { TemplateSettingsForm } from "../create/CreateTemplateSettingsComponent";
import { getPlaceholder } from "../../../util/Placeholders";
import { Text } from "../../../util/Dom";

type Props = {
  org: Organization;
  pld: Pld;
  settings: TemplateSettingsForm;
};

export const TemplateRevisionPreviewComponent = (props: Props) => {

  const createRevisionRow = (revision: PldRevision, index: number) => {
    return (
      <tr key={index}>
        <td style={style(props.settings).titleCell}>
          <Text>{getPlaceholder(props.settings.revision.date.content.text, {org: props.org, pld: props.pld, revision: revision})}</Text>
        </td>
        <td style={style(props.settings).titleCell}>
          <Text>{getPlaceholder(props.settings.revision.version.content.text, {org: props.org, pld: props.pld, revision: revision})}</Text>
        </td>
        <td style={style(props.settings).titleCell}>
          <Text>{getPlaceholder(props.settings.revision.author.content.text, {org: props.org, pld: props.pld, revision: revision})}</Text>
        </td>
        <td style={style(props.settings).titleCell}>
          <Text>{getPlaceholder(props.settings.revision.sections.content.text, {org: props.org, pld: props.pld, revision: revision})}</Text>
        </td>
        <td style={style(props.settings).titleCell}>
          <Text>{getPlaceholder(props.settings.revision.comments.content.text, {org: props.org, pld: props.pld, revision: revision})}</Text>
        </td>
      </tr>
    )
  }

  return (
    <table>
      <tbody>
      <tr>
        <td style={style(props.settings).titleCell}>
          <Text>{getPlaceholder(props.settings.revision.date.title.text, {org: props.org, pld: props.pld})}</Text>
        </td>
        <td style={style(props.settings).titleCell}>
          <Text>{getPlaceholder(props.settings.revision.version.title.text, {org: props.org, pld: props.pld})}</Text>
        </td>
        <td style={style(props.settings).titleCell}>
          <Text>{getPlaceholder(props.settings.revision.author.title.text, {org: props.org, pld: props.pld})}</Text>
        </td>
        <td style={style(props.settings).titleCell}>
          <Text>{getPlaceholder(props.settings.revision.sections.title.text, {org: props.org, pld: props.pld})}</Text>
        </td>
        <td style={style(props.settings).titleCell}>
          <Text>{getPlaceholder(props.settings.revision.comments.title.text, {org: props.org, pld: props.pld})}</Text>
        </td>
      </tr>
      {props.pld.revisions.map((r, index) => createRevisionRow(r, index))}
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
    borderColor: 'black',
    width: '20%'
  },
  subtitleColorCell: {
    backgroundColor: settings.color.mainColor,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'black',
    width: '50%',
  },
  subtitleCell: {
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
