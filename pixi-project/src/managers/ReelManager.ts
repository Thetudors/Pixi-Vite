import { Container } from 'pixi.js';
import { Reel } from '../components/Reel';
import { Symbol } from '../components/Symbol';
import { SYMBOLS_CONFIG } from '../config/symbolsConfig';
import { REELS_CONFIG } from '../config/reelConfig';

export class ReelManager {
    private reels: Reel[] = [];
    private reelContainer: Container;
    private readonly REEL_COUNT = 5;
    private readonly SYMBOLS_PER_REEL = 4;
    private readonly REEL_SPACING = 250;
    private isSpinning: boolean = false;

    constructor(container: Container) {
        this.reelContainer = container;
        this.initReels();
    }

    private initReels(): void {
        this.createReels();
        this.positionReels();
    }

    private createReels(): void {
        for (let i = 0; i < this.REEL_COUNT; i++) {
            const reel = new Reel({ x: 0, y: 0 });

            for (let j = 0; j < this.SYMBOLS_PER_REEL; j++) {
                const randomConfig = SYMBOLS_CONFIG[REELS_CONFIG[i][j]];

                const symbol = new Symbol(
                    randomConfig.id,
                    randomConfig.name,
                    randomConfig.animation,
                    "symbols-json",
                    "symbols-atlas"
                );
                reel.addSymbol(symbol);
            }

            this.reels.push(reel);
            this.reelContainer.addChild(reel);
        }
    }

    private positionReels(): void {
        this.reels.forEach((reel, index) => {
            reel.x = index * this.REEL_SPACING;
            reel.y = 0;
        });
    }

    public async spin(): Promise<void> {
        if (this.isSpinning) return;

        this.isSpinning = true;

        const spinPromises = this.reels.map((reel, index) => {
            return new Promise<void>(resolve => {
                setTimeout(() => {
                    reel.spin().then(() => resolve());
                }, index * 200);
            });
        });

        await Promise.all(spinPromises);
        this.isSpinning = false;
    }

    public getReels(): Reel[] {
        return this.reels;
    }

    public centerReels(screenWidth: number, screenHeight: number): void {
        this.reelContainer.x = screenWidth / 2 - (this.REEL_COUNT * this.REEL_SPACING) / 2;
        this.reelContainer.y = screenHeight / 2 - 200;
    }
}