import { Container } from 'pixi.js';
import { Symbol } from './Symbol';
import { IReel } from '../interfaces/IReel';

export class Reel extends Container implements IReel {
    private _symbols: Symbol[] = [];
    private _reelPosition: number;
    private _isSpinning: boolean = false;
    private readonly symbolHeight: number = 180;

    constructor(position:{x:number,y:number}) {
        super();
        this._reelPosition = 0;
        this.position.set(position.x, position.y);
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
        return new Promise((resolve) => {
            this._isSpinning = true;
            setTimeout(() => {
                this.stop();
                resolve();
            }, 2000);
        });
    }

    public stop(): void {
        this._isSpinning = false;
    }
}