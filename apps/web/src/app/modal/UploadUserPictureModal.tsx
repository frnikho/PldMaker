import { Button, FileUploaderDropContainer, Modal } from "carbon-components-react";
import { UserApiController } from "../controller/UserApiController";
import { toast } from "react-toastify";
import { useState } from "react";
import { useAuth } from "../hook/useAuth";
import { ModalProps } from "../util/Modal";
import { ErrorLabel } from "../util/Label";

type Props = {

} & ModalProps;

export const UploadUserPictureModal = (props: Props) => {

  const {accessToken} = useAuth();
  const [selectedFile, setSelectedFile] = useState<undefined | File>(undefined)
  const [fileData, setFileData] = useState<undefined | string>(undefined);
  const [error, setError] = useState<boolean>(false);

  const onClickUpload = () => {
    if (selectedFile === undefined)
      return;
    const formData = new FormData();
    formData.append('file', selectedFile, selectedFile?.name);
    UserApiController.uploadProfilePicture(accessToken, formData, (user, error) => {
      if (error) {
        toast('Une erreur est survenue', {type: 'error'});
      } else {
        props.onSuccess();
      }
    });
  }

  const onImageUpload = (file: File[]) => {
    if ((file[0] as any).invalidFileType) {
      setSelectedFile(undefined);
      setFileData(undefined);
      return setError(true);
    }
    setSelectedFile(file[0])
    setError(false);
    const reader = new FileReader();
    reader.readAsDataURL(file[0]);
    reader.addEventListener("load", () => {
        const url = reader.result;
        if (url !== null) {
          setFileData(url as string);
        }
      },
      false
    );
  }

  const showPicture = () => {
    if (selectedFile === undefined || fileData === undefined)
      return;

    return (
      <div>
        <p>{selectedFile?.name}</p>
        <img style={{padding: 12, objectFit: 'cover', width: 200}} src={fileData} alt={'Hello World'}></img>
      </div>
    )
  }

  return (
    <Modal open={props.open} onRequestClose={props.onDismiss} passiveModal>
      <h4 style={{fontWeight: 'bold'}}>Mettre à jour votre photo de profile</h4>
      <p className="cds--label-description">Le photo doit être au format .png, .jpg ou .jpeg</p>
      <FileUploaderDropContainer accept={['.png', '.jpg', '.jpeg']} onAddFiles={(event, {addedFiles}) => onImageUpload(addedFiles)}/>
      {showPicture()}
      <div>
        <ErrorLabel show={error} message={"Fichier non valide !"}/>
      </div>
      <Button disabled={selectedFile === undefined || fileData === undefined} onClick={onClickUpload}>Valider</Button>
    </Modal>
  );
};
