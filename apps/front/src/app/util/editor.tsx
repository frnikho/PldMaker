import React from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import List from '@editorjs/list';
import Checklist from '@editorjs/checklist';
import Header from '@editorjs/header';

export const EDITOR_HOLDER_ID = 'editorjs';

export type EditorProps = {
  onChange?: (editorJs: EditorJS) => void,
  onReady?: (editorJs: EditorJS) => void,
  onSave?: (content: OutputData) => void,
}

export type EditorState = {
  content?: OutputData
}

export class Editor extends React.Component<EditorProps, EditorState> {

  private editor: EditorJS;

  constructor(props: EditorProps) {
    super(props);
    this.state = {
      content: undefined
    }
    this.editor = new EditorJS({
      holder: EDITOR_HOLDER_ID,
      tools: {
        checklist: {
          class: Checklist,
          inlineToolbar: true,
        },
        list: {
          class: List,
          inlineToolbar: true
        },
        header: {
          class: Header,
        },
      },
      data: this.state.content,
      onChange: () => this.props.onChange ? this.props.onChange(this.editor) : null,
      onReady: () => this.props.onReady ? this.props.onReady(this.editor) : null,
    });
  }

  override componentDidMount() {
    /*Object.keys(window).forEach(key => {
      if (/^on/.test(key)) {
        window.addEventListener(key.slice(2), event => {
          console.log(event);
        });
      }
    });*/
  }

  override render() {
    return (
      <div onKeyDown={async (event)=> {
        if (event.ctrlKey && event.key === 's') {
          event.preventDefault();
          if (this.props.onSave)
            this.props.onSave(await this.editor.save());
        }
      }}>
        <div id={EDITOR_HOLDER_ID}></div>
      </div>
    )
  }

}
