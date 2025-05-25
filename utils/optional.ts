export class Optional<T> {
    private constructor(
        private readonly value: T | null | undefined,
        private readonly errorMessage?: string
    ) {}

    static of<T>(value: T): Optional<T> {
        if (value === null || value === undefined) {
            throw new Error("Optional.of() cannot be called with null or undefined");
        }
        return new Optional(value);
    }

    static ofNullable<T>(value: T | null | undefined): Optional<T> {
        return new Optional(value);
    }

    static empty<T>(): Optional<T> {
        return new Optional<T>(null);
    }

    static success<T>(value: T): Optional<T> {
        return this.of(value);
    }

    static fail<T>(message?: string): Optional<T> {
        return new Optional<T>(null, message);
    }

    isPresent(): boolean {
        return this.value !== null && this.value !== undefined;
    }

    isEmpty(): boolean {
        return !this.isPresent();
    }

    get(): T {
        if (!this.isPresent()) {
            throw new Error(this.errorMessage || "No value present in Optional");
        }
        return this.value!;
    }

    getError(): string | undefined {
        return this.isEmpty() ? this.errorMessage : undefined;
    }

    orElse(other: T): T {
        return this.isPresent() ? this.value! : other;
    }

    orElseGet(supplier: () => T): T {
        return this.isPresent() ? this.value! : supplier();
    }

    orElseThrow(errorSupplier?: () => Error): T {
        if (this.isPresent()) {
            return this.value!;
        } else {
            throw errorSupplier?.() || new Error(this.errorMessage || "No value present in Optional");
        }
    }

    map<U>(mapper: (value: T) => U): Optional<U> {
        if (this.isPresent()) {
            return Optional.ofNullable(mapper(this.value!));
        } else {
            return Optional.fail<U>(this.errorMessage);
        }
    }

    ifPresent(consumer: (value: T) => void): void {
        if (this.isPresent()) {
            consumer(this.value!);
        }
    }
}