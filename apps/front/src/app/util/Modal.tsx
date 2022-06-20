export type ModalProps = {
  open: boolean;
  onDismiss: (...args: unknown[]) => void;
  onSuccess: (...args: unknown[]) => void;
}
