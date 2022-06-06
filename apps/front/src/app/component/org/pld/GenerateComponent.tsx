import React from "react";
import {Organization} from "../../../../../../../libs/data-access/organization/Organization";
import {Pld} from "../../../../../../../libs/data-access/pld/Pld";
import {Button} from "carbon-components-react";

import * as docx from 'docx';

export type GenerateComponentProps = {
  org: Organization;
  pld: Pld;
}

export type GenerateComponentState = {

}

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
    generate();
  }

  override render() {
    return (
      <>
       <Button onClick={this.onClickCreatePreview}>Générer un preview du PLD </Button>
      </>
    );
  }

}
