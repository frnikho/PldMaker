import { useCallback, useMemo } from "react";

export type NestedKeyOf<ObjectType extends object> =
  {[Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`
  }[keyof ObjectType & (string | number)];

export function useStorage<T extends object>() {

  const getItem = useCallback(<Z = string>(key: NestedKeyOf<T>): Z => {
      const item = localStorage.getItem(key);
      try {
        return JSON.parse(item ?? '') as Z;
      } catch (ex) {
        return item as Z;
      }
    }, []);

  const setItem = useCallback((key: NestedKeyOf<T>, value: string | object) => {
      if (typeof value === 'object') {
        localStorage.setItem(key, JSON.stringify(value));
      } else {
        localStorage.setItem(key, value);
      }
    }, []);

  const hasItem = useCallback((key: NestedKeyOf<T>) => {
      return localStorage.getItem(key) !== undefined;
    }, []);

  return {
    setItem,
    getItem,
    hasItem,
  }
}
