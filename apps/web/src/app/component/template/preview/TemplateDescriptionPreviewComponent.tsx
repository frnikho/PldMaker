import * as React from "react";
import { Organization, Pld } from "@pld/shared";
import { TemplateSettingsForm } from "../create/CreateTemplateSettingsComponent";
import { Text } from "../../../util/Dom";
import { getPlaceholder } from "../../../util/Placeholders";

type Props = {
  org: Organization;
  pld: Pld;
  settings: TemplateSettingsForm;
};
export const TemplateDescriptionPreviewComponent = (props: Props) => {

  const createRow = (title: string, content: string) => {
    return (
      <tr>
        <td style={style(props.settings).subtitleColorCell}>
          <Text>{getPlaceholder(title, {org: props.org, pld: props.pld})}</Text>
        </td>
        <td style={style(props.settings).subtitleCell}>
          <Text>{getPlaceholder(content, {org: props.org, pld: props.pld})}</Text>
        </td>
      </tr>
    )
  }

  return (
    <table style={{width: '100%'}}>
      <tbody>
        {createRow(props.settings.description.title.title.text, props.settings.description.title.content.text)}
        {createRow(props.settings.description.object.title.text, props.settings.description.object.content.text)}
        {createRow(props.settings.description.author.title.text, props.settings.description.author.content.text)}
        {createRow(props.settings.description.manager.title.text, props.settings.description.manager.content.text)}
        {createRow(props.settings.description.email.title.text, props.settings.description.email.content.text)}
        {createRow(props.settings.description.keywords.title.text, props.settings.description.keywords.content.text)}
        {createRow(props.settings.description.promotion.title.text, props.settings.description.promotion.content.text)}
        {createRow(props.settings.description.updatedDate.title.text, props.settings.description.updatedDate.content.text)}
        {createRow(props.settings.description.version.title.text, props.settings.description.version.content.text)}
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
