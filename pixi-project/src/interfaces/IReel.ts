import { ISymbol } from "./ISymbol";

export interface IReel {
    symbols: ISymbol[];
    reelPosition: number;
    isSpinning: boolean;
    addSymbol(symbol: ISymbol): void;
    removeSymbol(symbol: ISymbol): void;
    spin(): Promise<void>;
    stop(): void;

}