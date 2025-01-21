import { Container } from 'pixi.js';
import { Symbol } from './Symbol';
import { IReel } from '../interfaces/IReel';
import gsap from 'gsap';

export class Reel extends Container implements IReel {
    private _symbols: Symbol[] = [];
    private _reelPosition: number;
    private _isSpinning: boolean = false;
    private readonly symbolHeight: number = 180;
    private readonly SPIN_DURATION: number = 2;
    private readonly SPIN_DISTANCE: number = 1000;


    constructor() {
        super();
        this._reelPosition = 0;
        this.addChild(this);
    }

    get reelPosition(): number {
        return this._reelPosition;
    }

    get isSpinning(): boolean {
        return this._isSpinning;
    }

    get symbols(): Symbol[] {
        return this._symbols;
    }

    public addSymbol(symbol: Symbol): void {
        if (!symbol) return;

        this._symbols.push(symbol);
        this.addChild(symbol);
        this.updateSymbolPositions();
    }

    public removeSymbol(symbol: Symbol): void {
        if (!symbol) return;

        const index = this._symbols.findIndex(s => s.id === symbol.id);
        if (index > -1) {
            this._symbols.splice(index, 1);
            this.removeChild(symbol);
            this.updateSymbolPositions();
        }
    }

    private updateSymbolPositions(): void {
        this._symbols.forEach((symbol, index) => {
            symbol.position.set(0, index * this.symbolHeight);
        });
    }

    public async spin(): Promise<void> {
        return new Promise<void>((resolve) => {
            this._isSpinning = true;

            // Create spinning animation
            gsap.to(this, {
                duration: this.SPIN_DURATION,
                y: `+=${this.SPIN_DISTANCE}`,
                ease: "power1.inOut",
                stagger: {
                    each: 0.1,
                    from: "start",
                    repeat: 2
                },
                onComplete: () => {
                    this._isSpinning = false;
                    this.snapToGrid();
                    resolve();
                }
            });
        });
    }
    private snapToGrid(): void {
        this._symbols.forEach(symbol => {
            gsap.to(symbol, {
                duration: 0.2,
                y: Math.round(symbol.y / 200) * 200,
                ease: "power2.out"
            });
        });
    }

    public stop(): void {
        this._isSpinning = false;
    }
}