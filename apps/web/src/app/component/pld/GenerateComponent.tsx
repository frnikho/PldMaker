import React from "react";
import { Organization, Pld, Dod, DodStatus } from "@pld/shared";
import {Button} from "carbon-components-react";

import * as docx from 'docx';
import {PldGenerator} from "../../docx/PldGenerator";

import {DocumentView} from '@carbon/icons-react'

export type GenerateComponentProps = {
  org: Organization;
  pld: Pld;
  dod: Dod[];
  dodStatus: DodStatus[];
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
  });
}


export class GenerateComponent extends React.Component<GenerateComponentProps, GenerateComponentState> {

  constructor(props) {
    super(props);
    this.onClickCreatePreview = this.onClickCreatePreview.bind(this);
  }

  private onClickCreatePreview() {
    const generator: PldGenerator = new PldGenerator(this.props.pld, this.props.dod, this.props.org, this.props.dodStatus);
    PldGenerator.getBlobFromDoc(generator.generate(), (blob) => {
      window.open(URL.createObjectURL(blob));
    });
  }

  override render() {
    return (
     <Button style={{borderRadius: 6}} renderIcon={DocumentView} onClick={this.onClickCreatePreview}>Générer une preview du PLD </Button>
    );
  }

}
