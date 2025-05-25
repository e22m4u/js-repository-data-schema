/**
 * Callable type with the "new" operator
 * that allows class and constructor types.
 */
export interface Constructor<T = unknown> {
    new (...args: any[]): T;
}
