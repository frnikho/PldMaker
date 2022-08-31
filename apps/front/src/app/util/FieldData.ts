export type FieldData<T> = {
  value: T;
  error?: string;
  loading?: boolean;
}

export type FieldError = {
  error?: string;
  id?: string;
  loading?: boolean;
}

export const onEnter = (event: any, func: any) => {
  if (event.key === 'Enter') {
    func();
  }
}
