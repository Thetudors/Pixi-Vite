import { Container } from 'pixi.js';
import { Symbol } from './Symbol';
import { IReel } from '../interfaces/IReel';
import gsap from 'gsap';
import { REELS_CONFIG, RANDOM_REELS_CONFIG } from '../config/reelConfig';

export class Reel extends Container implements IReel {
    private _symbols: Symbol[] = [];
    private _reelIndex: number = 0;
    private _reelPosition: number;
    private _isSpinning: boolean = false;
    private readonly SYMBOL_HEIGHT: number = 180;
    private readonly REEL_ORIGIN_POSITION: number = -445;
    private readonly SPIN_DURATION: number = 3000;

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
            symbol.position.set(0, index * this.SYMBOL_HEIGHT);
        });
    }

    public async spin(): Promise<void> {
        setTimeout(() => {
            this.isDataReceived = true;
        }, this.SPIN_DURATION);
        return new Promise<void>((resolve) => {
            this._isSpinning = true;
            let spinStartTween = gsap.to(this, {
                duration: 0.25, y: `+=${this.SYMBOL_HEIGHT}`, ease: "power4.in",
                onComplete: () => {
                    this.setBlurEffectSymbols(true);
                    let loopTween = gsap.fromTo(this, { y: this.REEL_ORIGIN_POSITION }, {
                        duration: 0.04, y: `+=${this.SYMBOL_HEIGHT}`, ease: "none", onComplete: () => {
                            if (!this.isDataReceived) {
                                this.swapSymbol();
                                loopTween.restart();
                            } else {
                                let stopTween = gsap.fromTo(this, { y: this.REEL_ORIGIN_POSITION - this.SYMBOL_HEIGHT }, {
                                    duration: 0.55, y: `+=${this.SYMBOL_HEIGHT}`, ease: "back.out(1.7)",
                                    onStart: () => {
                                        this.setBlurEffectSymbols(false);
                                        this.setLastSymbolIndexs();
                                    },
                                    onComplete: () => {
                                        this._isSpinning = false;
                                        resolve();
                                    }
                                })
                            }

                        }
                    });
                }
            })

        });
    }

    private swapSymbol(): void {
        const lastSymbol = this._symbols.pop()!;
        lastSymbol.y = 0;
        lastSymbol.setSymbolIndex(RANDOM_REELS_CONFIG[this._reelIndex][Math.floor(Math.random() * RANDOM_REELS_CONFIG[this._reelIndex].length)]);
        this._symbols.forEach((symbol) => {
            symbol.y += this.SYMBOL_HEIGHT;
        });
        this._symbols.unshift(lastSymbol);
    }

    private setLastSymbolIndexs(): void {
        for (let i = 0; i < this._symbols.length - 1; i++) {
            this._symbols[i].setSymbolIndex(REELS_CONFIG[this._reelIndex][i]);
            this.isDataReceived = false;
        }
    }

    private setBlurEffectSymbols(isBlurred: boolean): void {
        this._symbols.forEach((symbol) => {
            symbol.setBlurEffect(isBlurred);
        });
    }

    public stop(): void {
        this._isSpinning = false;
        this.isDataReceived = false;
    }
}