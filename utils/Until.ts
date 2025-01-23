export async function until(condition: () => boolean, {interval = 100, timeout = 5000} = {}) {

    const start = Date.now();
    while (true) {
        if (!condition()) {
            return true;
        }
        if (Date.now() - start >= timeout) {
            throw new Error("Timeout exceeded while waiting for the condition to be met.");
        }
        await new Promise((resolve) => setTimeout(resolve, interval));
    }
}