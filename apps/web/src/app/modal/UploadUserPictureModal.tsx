import { ModalComponent, ModalComponentProps } from "../util/Modal";
import { RequiredUserContextProps } from "../context/UserContext";
import { Button, FileUploaderDropContainer } from "carbon-components-react";
import { UserApiController } from "../controller/UserApiController";
import { toast } from "react-toastify";

export type UploadUserPictureModalProps = {

} & RequiredUserContextProps & ModalComponentProps;

export type UploadUserPictureModalState = {
  selectedFile?: File;
}

export class UploadUserPictureModal extends ModalComponent<UploadUserPictureModalProps, UploadUserPictureModalState> {

  constructor(props) {
    super(props, {passiveModal: true});
    this.state = {

    }
    this.onClickUpload = this.onClickUpload.bind(this);
  }

  protected override onOpen() {
    this.setState({selectedFile: undefined});
  }

  private onClickUpload() {
    if (this.state.selectedFile === undefined)
      return;
    const formData = new FormData();
    formData.append('file', this.state.selectedFile, this.state.selectedFile?.name);
    UserApiController.uploadProfilePicture(this.props.userContext.accessToken, formData, (user, error) => {
      if (error) {
        toast('Une erreur est survenue', {type: 'error'});
      } else {
        console.log(user);
        this.props.onSuccess();
      }
    });
  }

  renderModal(): React.ReactNode {
    return (<>
      <p className="cds--file--label">
        Upload files
      </p>
      <p className="cds--label-description">
        Le photo doit être au format .png, .jpg ou .jpeg
      </p>
      <FileUploaderDropContainer accept={['png', 'jpg', 'jpeg']} onAddFiles={(event, {addedFiles}) => this.setState({selectedFile: addedFiles[0]})}/>
      <p>{this.state.selectedFile?.name}</p>
      <Button onClick={this.onClickUpload}>Valider</Button>
    </>);
  }

}
