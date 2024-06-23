

export type Optional<T> = T | undefined | null;

export type OptionalString = Optional<string>;
export type OptionalNumber = Optional<number>;
export type OptionalBoolean = Optional<boolean>;
export type OptionalDate = Optional<Date>;
export type OptionalArray<T> = Optional<T[]>;
export type OptionalObject<T> = Optional<T>;
