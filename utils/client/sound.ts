const audioCache: Map<string, HTMLAudioElement> = new Map();

export async function playSoundBrowser(url: string, volume: number = 1.0, cache: boolean = true): Promise<void> {
    try {
        // Check if the sound is already cached
        let audio = audioCache.get(url);

        if (!cache)
            audio = undefined;

        if (!audio) {
            // If not cached, create a new audio object and store it in the cache
            audio = new Audio(url);
            audioCache.set(url, audio);
        }

        // Set the volume (ensure it's within the valid range 0.0 to 1.0)
        audio.volume = Math.max(0, Math.min(volume, 1));

        // Reset the playback to start from the beginning
        audio.currentTime = 0;

        // Play the sound
        await audio.play();
        console.log(`Playing sound at volume: ${audio.volume}`);
    } catch (error) {
        console.error('Error playing sound:', error); // Handle errors
    }
}
