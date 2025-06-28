// Like java.util.function.Supplier<T>
export type Supplier<T> = (args?: any) => T;
export type AsyncSupplier<T> = () => Promise<T>;

// Like java.util.function.Consumer<T>
export type Consumer<T> = (input: T) => void;

// Like java.util.function.Function<T, R>
export type Function<T, R> = (input: T) => R;

// Like java.util.function.Predicate<T>
export type Predicate<T> = (input: T) => boolean;

// Like java.util.Comparator<T> (returns -1, 0, 1)
export type Comparator<T> = (a: T, b: T) => number;

// Like java.lang.Comparable<T>
export interface Comparable<T> {
    compareTo(other: T): number;
}

// Like java.util.function.BiFunction<T, U, R>
export type BiFunction<T, U, R> = (a: T, b: U) => R;

// Like java.util.function.BiConsumer<T, U>
export type BiConsumer<T, U> = (a: T, b: U) => void;

// Like java.util.function.BiPredicate<T, U>
export type BiPredicate<T, U> = (a: T, b: U) => boolean;

