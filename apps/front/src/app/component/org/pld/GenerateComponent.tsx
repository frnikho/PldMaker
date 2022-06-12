import React from "react";
import {Organization} from "../../../../../../../libs/data-access/organization/Organization";
import {Pld} from "../../../../../../../libs/data-access/pld/Pld";
import {Button} from "carbon-components-react";

import * as docx from 'docx';
import {PldGenerator} from "../../../docx/PldGenerator";
import {Dod} from "../../../../../../../libs/data-access/pld/dod/Dod";

export type GenerateComponentProps = {
  org: Organization;
  pld: Pld;
  dod: Dod[]
}

export type GenerateComponentState = unknown

function generate() {
  const doc = new docx.Document({
    sections: [
      {
        properties: {},
        children: [
          new docx.Paragraph({
            children: [
              new docx.TextRun("Hello World"),
              new docx.TextRun({
                text: "Foo Bar",
                bold: true
              }),
              new docx.TextRun({
                text: "\tGithub is the best",
                bold: true
              })
            ]
          })
        ]
      }
    ]
  });

  docx.Packer.toBlob(doc).then((blob) => {
    console.log(blob);
    console.log(URL.createObjectURL(blob));
    console.log("Document created successfully");
  });
}


export class GenerateComponent extends React.Component<GenerateComponentProps, GenerateComponentState> {

  constructor(props) {
    super(props);
    this.onClickCreatePreview = this.onClickCreatePreview.bind(this);
  }

  private onClickCreatePreview() {
    const generator: PldGenerator = new PldGenerator(this.props.pld, this.props.dod, this.props.org);
    PldGenerator.getBlobFromDoc(generator.generate(), (blob) => {
      window.open(URL.createObjectURL(blob));
    });
  }

  override render() {
    return (
      <>
        <br/>
        <br/>
        <br/>
       <Button onClick={this.onClickCreatePreview}>Générer un preview du PLD </Button>
        <br/>
        <br/>
        <br/>
      </>
    );
  }

}
