import { Container, Graphics } from 'pixi.js';
import { Reel } from '../components/Reel';
import { Symbol } from '../components/Symbol';
import { SYMBOLS_CONFIG } from '../config/symbolsConfig';
import { REELS_CONFIG } from '../config/reelConfig';
import gsap from 'gsap';

export class ReelManager {
    private reels: Reel[] = [];
    private _reelContainer: Container;
    private _parentContainer: Container;
    private _displaySymbols: Symbol[][] = [];
    private readonly REEL_COUNT = 5;
    private readonly SYMBOLS_PER_REEL = 6;
    private readonly REEL_POSITION = { x: 500, y: -445 };
    private readonly REEL_SPACING = 250;
    private _isSpinning: boolean = false;
    private _reelMask: Graphics = new Graphics();
    constructor(parentContainer: Container) {
        this._parentContainer = parentContainer;
        this._reelContainer = new Container({ label: 'reelContainer' });
        parentContainer.addChild(this._reelContainer);
        this.initReels();
    }

    private initReels(): void {
        this.createReels();
        this.positionReels();
    }

    private createReels(): void {
        this._reelMask = new Graphics().rect(-600, -360, 1200, 725).fill(0x000000);
        this._reelMask
        this._parentContainer.addChild(this._reelMask);
        this._reelContainer.mask = this._reelMask;
        for (let i = 0; i < this.REEL_COUNT; i++) {
            const reel = new Reel(i);

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
            this._reelContainer.addChild(reel);
        }
    }

    private positionReels(): void {
        this.reels.forEach((reel, index) => {
            reel.x = (index * this.REEL_SPACING) - this.REEL_POSITION.x;
            reel.y = this.REEL_POSITION.y;
        });
    }
    public async spin(): Promise<void> {
        if (this._isSpinning) return;
        this._isSpinning = true;


        const spinPromises = this.reels.map((reel, index) => {
            return new Promise<void>(resolve => {
                gsap.delayedCall(index * 0.2, () => {
                    reel.spin().then(() => resolve());
                });
            });
        });

        await Promise.all(spinPromises);
        this.updateDisplaySymbols();
        this._isSpinning = false;
    }

    private updateDisplaySymbols(): void {
        for (let reelIndex = 0; reelIndex < this.reels.length; reelIndex++) {
            this._displaySymbols[reelIndex] = [];
            for (let symbolIndex = 1; symbolIndex < this.reels[reelIndex].symbols.length - 1; symbolIndex++) {
                this._displaySymbols[reelIndex].push(this.reels[reelIndex].symbols[symbolIndex]);
            }
        }
    }

    public stop(): void {
        this.reels.forEach(reel => reel.stop());
    }

    public getReels(): Reel[] {
        return this.reels;
    }

    public get displaySymbols(): Symbol[][] {
        return this._displaySymbols;
    }

    public get isSpinning(): boolean {
        return this._isSpinning
    }

    public centerReels(screenWidth: number, screenHeight: number): void {
        this._reelContainer.x = screenWidth / 2 - (this.REEL_COUNT * this.REEL_SPACING) / 2;
        this._reelContainer.y = screenHeight / 2 - 200;
    }
}