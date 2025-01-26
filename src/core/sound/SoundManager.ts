import { Sound } from '@pixi/sound';

export class SoundManager {
    private static _instance: SoundManager;
    private _sounds: { [key: string]: Sound } = {};

    private constructor() {}

    public static get instance(): SoundManager {
        if (!SoundManager._instance) {
            SoundManager._instance = new SoundManager();
        }
        return SoundManager._instance;
    }

    public async loadSounds(soundList: { alias: string; url: string }[]): Promise<void> {
        for (const soundData of soundList) {
            const sound = await Sound.from({
                url: soundData.url,
                preload: true,
            });
            this._sounds[soundData.alias] = sound;
        }
    }

    public playSound(alias: string, options?: { loop?: boolean; volume?: number }): void {
        const sound = this._sounds[alias];
        if (sound) {
            sound.play(options);
        } else {
            console.warn(`Sound with alias "${alias}" not found.`);
        }
    }

    public stopSound(alias: string): void {
        const sound = this._sounds[alias];
        if (sound) {
            sound.stop();
        } else {
            console.warn(`Sound with alias "${alias}" not found.`);
        }
    }

    public setVolume(alias: string, volume: number): void {
        const sound = this._sounds[alias];
        if (sound) {
            sound.volume = volume;
        } else {
            console.warn(`Sound with alias "${alias}" not found.`);
        }
    }
}