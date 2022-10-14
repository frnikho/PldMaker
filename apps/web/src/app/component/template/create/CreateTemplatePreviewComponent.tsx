import * as React from "react";
import { useEffect } from "react";
import { Dod, DodStatus, Organization, Pld, Review, User, UserDomain } from "@pld/shared";
import { Accordion, AccordionItem, Tile } from "carbon-components-react";
import { TemplateSettingsForm } from "./CreateTemplateSettingsComponent";
import { createFakeDod, createFakeOrg, createFakePld, createFakeReview, createFakeUser, createFakeWorkTime } from "../../../util/Factory";
import { TemplateDodPreviewComponent } from "../preview/TemplateDodPreviewComponent";
import { TemplateReportPreviewComponent } from "../preview/TemplateReportPreviewComponent";
import { TemplateRevisionPreviewComponent } from "../preview/TemplateRevisionPreviewComponent";
import { TemplateDescriptionPreviewComponent } from "../preview/TemplateDescriptionPreviewComponent";

type Props = {
  org: Organization;
  dodStatus: DodStatus[];
  settings?: TemplateSettingsForm;
};
export const CreateTemplatePreviewComponent = (props: Props) => {

  const review: Review = createFakeReview();
  const user: User = createFakeUser();
  const org: Organization = createFakeOrg(user);
  const pld: Pld = createFakePld(org);
  const DoDs: Dod[] = props.dodStatus.map((status, index) => createFakeDod({status: status, version: `1.${index}`, title: `Nom de la DoD ${index}`, estimatedWorkTime: [createFakeWorkTime([user])]}));

  const showPreview = () => {
    if (!props.settings)
      return;
    return (<Accordion>
      <AccordionItem title={<h4 style={style.title}>Description du document</h4>}>
        <TemplateDescriptionPreviewComponent org={org} pld={pld} settings={props.settings}/>
      </AccordionItem>
      <AccordionItem title={<h4 style={style.title}>Tableau des révisions</h4>}>
        <TemplateRevisionPreviewComponent org={org} pld={pld} settings={props.settings}/>
      </AccordionItem>
      <AccordionItem title={<h4 style={style.title}>User Stories</h4>}>
        {DoDs.map((d, index) => <TemplateDodPreviewComponent key={index} org={props.org} dod={d} settings={props.settings!}/>)}
      </AccordionItem>
      <AccordionItem title={<h4 style={style.title}>Rapport d'avancement:</h4>}>
        <TemplateReportPreviewComponent dods={DoDs} status={props.dodStatus} org={org} pld={pld} settings={props.settings} review={review}/>
      </AccordionItem>
    </Accordion>);
  }

  return (
    <Tile>
      {showPreview()}
    </Tile>
  );
};

const style = {
  title: {
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 16,
  }
}
