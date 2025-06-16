// Configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds
const MAX_REQUESTS = 100; // Max requests per IP per window

// Store request counts (use Redis or another persistent store for production)
const requestCounts = new Map();

function rateLimiter() {
    //@ts-ignore
    return (event, next) => {
        const clientIP = event.request.headers.get('x-forwarded-for') || event.request.socket.remoteAddress;

        // Initialize rate limit tracking for the IP if not already present
        if (!requestCounts.has(clientIP)) {
            requestCounts.set(clientIP, { count: 1, startTime: Date.now() });
        } else {
            const clientData = requestCounts.get(clientIP);
            const elapsedTime = Date.now() - clientData.startTime;

            if (elapsedTime < RATE_LIMIT_WINDOW) {
                // Increment the request count if within the time window
                clientData.count++;

                // If limit exceeded, block the request
                if (clientData.count > MAX_REQUESTS) {
                    return new Response('Rate limit exceeded. Try again later.', { status: 429 });
                }
            } else {
                // Reset the count and start time if the time window has expired
                clientData.count = 1;
                clientData.startTime = Date.now();
            }
        }

        return next(event); // Proceed to the next middleware or handler
    };
}
