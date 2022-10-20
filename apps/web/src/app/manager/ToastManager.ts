import { toast, ToastOptions } from "react-toastify";

export const successToast = (message: string, options?: ToastOptions) => {
  toast(message, {type: 'success', icon: () => '✅',  ...options});
}

export const errorToast = (message: string, options?: ToastOptions) => {
  toast(message, {type: 'success', icon: () => '❌',  ...options});
}

export const infoToast = (message: string, options?: ToastOptions) => {
  toast(message, {type: 'info', icon: () => '🏳',  ...options});
}
