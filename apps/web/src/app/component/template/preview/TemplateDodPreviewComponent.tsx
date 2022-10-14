import * as React from "react";
import { Dod, Organization } from "@pld/shared";
import { TemplateSettingsForm } from "../create/CreateTemplateSettingsComponent";
import { Text } from "../../../util/Dom";
import { getPlaceholder, getUserPlaceholders } from "../../../util/Placeholders";

type Props = {
  dod: Dod;
  org: Organization;
  settings: TemplateSettingsForm;
};
export const TemplateDodPreviewComponent = (props: Props) => {

  return (
    <table width={'100%'} style={style(props.dod, props.settings).dod}>
      <tbody>
      <tr>
        <td style={style(props.dod, props.settings).titleCell} colSpan={2}>
          <Text>{getPlaceholder(props.settings.dod.title.text, {org: props.org, dod: props.dod})}</Text>
        </td>
      </tr>
      <tr>
        <td style={style(props.dod, props.settings).subtitleCell}>
          <Text>{getPlaceholder(props.settings.dod.skinOf.title.text, {org: props.org, dod: props.dod})}</Text>
        </td>
        <td style={style(props.dod, props.settings).subtitleCell}>
          <Text>{getPlaceholder(props.settings.dod.wantTo.title.text, {org: props.org, dod: props.dod})}</Text>
        </td>
      </tr>
      <tr>
        <td style={style(props.dod, props.settings).twoColumns}>
          <Text>
            {getPlaceholder(props.settings.dod.skinOf.content.text, {org: props.org, dod: props.dod})}
          </Text>
        </td>
        <td style={style(props.dod, props.settings).twoColumns}>
          <Text>
            {getPlaceholder(props.settings.dod.wantTo.content.text, {org: props.org, dod: props.dod})}
          </Text>
        </td>
      </tr>
      <tr>
        <td style={style(props.dod, props.settings).subtitleCell} colSpan={2}>
          <Text>
            {getPlaceholder(props.settings.dod.description.title.text, {org: props.org, dod: props.dod})}
          </Text>
          <Text>
            {getPlaceholder(props.settings.dod.description.content.text, {org: props.org, dod: props.dod})}
          </Text>
        </td>
      </tr>
      <tr>
        <td style={style(props.dod, props.settings).contentCell} colSpan={2}>
          <Text>
            {getPlaceholder(props.settings.dod.definitionOfDone.title.text, {org: props.org, dod: props.dod})}
          </Text>
          {props.dod.descriptionOfDone.map((d, index) =>
            <Text key={index}>
              {getPlaceholder(props.settings.dod.definitionOfDone.content.text, {org: props.org, dod: props.dod, definition: d})}
            </Text>)
          }
        </td>
      </tr>
      <tr>
        <td style={style(props.dod, props.settings).subtitleCell}>
          <Text>
            {getPlaceholder(props.settings.dod.estimatedWorkTime.title.text, {org: props.org, dod: props.dod})}
          </Text>
        </td>
        <td style={style(props.dod, props.settings).subtitleCell}>
          {props.dod.estimatedWorkTime.map((wt, index) => {
            const users = wt.users.map((u) => getUserPlaceholders(props.settings.dod.estimatedWorkTime.content.text, u)).join(', ');
            return <Text key={index}>{getPlaceholder(users, {org: props.org, dod: props.dod, workTime: wt})}</Text>;
          })}
        </td>
      </tr>
      </tbody>
    </table>
  )
};


const style = (dod: Dod, settings: TemplateSettingsForm) => ({
  dod: {
    marginBottom: 20,
  },
  titleCell: {
    backgroundColor: `#${dod.status.color}`,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'black'
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
