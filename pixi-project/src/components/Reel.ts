import { Container } from 'pixi.js';
import { Symbol } from './Symbol';
import { IReel } from '../interfaces/IReel';
import gsap from 'gsap';
import { REELS_CONFIG } from '../config/reelConfig';

export class Reel extends Container implements IReel {
    private _symbols: Symbol[] = [];
    private _reelIndex: number = 0;
    private _reelPosition: number;
    private _isSpinning: boolean = false;
    private readonly symbolHeight: number = 180;

    private isDataReceived: boolean = false;

    constructor(reelIndex: number) {
        super();
        this._reelIndex = reelIndex;
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
        setTimeout(() => {
            this.isDataReceived = true;
        }, 500);
        return new Promise<void>((resolve) => {
            this._isSpinning = true;
            let reelOrigin = this.position.y;
            let loopTween = gsap.to(this, {
                duration: 0.05, y: `+=${this.symbolHeight}`, ease: "none", onComplete: () => {
                    if (!this.isDataReceived) {
                        this.swapSymbol();
                        loopTween.restart();
                    } else {
                        // this.position.y -= this.symbolHeight;
                        let stopTween = gsap.fromTo(this, { y: reelOrigin }, {
                            duration: 0.55, y: `+=${this.symbolHeight}`, ease: "back.out(1.7)",
                            onStart: () => {
                                this.setLastSymbolIndexs();
                            },
                            onComplete: () => {
                                // this.position.y = reelOrigin;
                            }
                        })
                    }
                    this._isSpinning = false;
                    resolve();
                }
            });
        });
    }

    private swapSymbol(): void {
        const lastSymbol = this._symbols.pop()!;
        lastSymbol.y = 0;
        lastSymbol.setSymbolIndex(Math.floor(Math.random() * 6));
        this._symbols.forEach((symbol) => {
            symbol.y += this.symbolHeight;
        });
        this._symbols.unshift(lastSymbol);
    }

    private setLastSymbolIndexs(): void {
        for (let i = 0; i < this._symbols.length - 1; i++) {
            this._symbols[i].setSymbolIndex(REELS_CONFIG[this._reelIndex][i + 1]);
            this.isDataReceived = false;
        }
    }

    public stop(): void {
        this._isSpinning = false;
    }
}