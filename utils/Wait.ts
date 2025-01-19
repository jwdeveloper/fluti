export async function wait(milliseconds: any) {
    if (typeof milliseconds === "number") {
        return new Promise(resolve => {
            setTimeout(resolve, milliseconds);
        });
    }
    return all(milliseconds)
}

export async function all(fn: any, time?: any, delay?: any) {

    if (delay !== undefined) {
        await wait(delay)
    }
    if (time === undefined)
        time = 600;

    await fn();
    await wait(time)
}