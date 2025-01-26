import { ISymbol } from "./ISymbol";

export interface IReel {
    symbols: ISymbol[];
    reelIndex: number;
    isSpinning: boolean;
    isDataReceived: boolean;
    addSymbol(symbol: ISymbol): void;
    removeSymbol(symbol: ISymbol): void;
    spin(): Promise<void>;
    stop(): void;
}