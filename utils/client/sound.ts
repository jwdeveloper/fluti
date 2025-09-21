const audioCache: Map<string, string> = new Map(); // cache just the URL or source

export async function playSoundBrowser(
    url: string,
    volume: number = 1.0,
    cache: boolean = true
): Promise<void> {
    try {
        // Optionally cache the URL
        if (cache && !audioCache.has(url)) {
            audioCache.set(url, url);
        }

        // Always create a new Audio element for simultaneous playback
        const audio = new Audio(url);
        audio.volume = Math.max(0, Math.min(volume, 1));

        // Play the audio
        await audio.play();
    } catch (error) {
        console.error('Error playing sound:', error);
    }
}