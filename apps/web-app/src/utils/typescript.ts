export type NonUndefined<T> = T extends undefined ? never : T;

export type NonNullable<T> = T extends null | undefined ? never : T;
