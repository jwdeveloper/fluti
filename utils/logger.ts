export function DEV_LOGGER(a: any, b?: any, c?: any, d?: any, e?: any): void {
    const publicEnv = String(import.meta.env.PUBLIC_ENV ?? "").trim().toLowerCase();
    if (publicEnv !== "prod") {
        console.log(a, b, c, d, e);
    }
}
