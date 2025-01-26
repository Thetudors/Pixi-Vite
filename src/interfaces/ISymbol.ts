import { Spine } from "@esotericsoftware/spine-pixi-v8";

export interface ISymbol {
    id: number;
    name: string;
    symbolSpine: Spine;
    isBlackOut:boolean;
    playWinAnimation(): void;
    stopWinAnimation(): void;
    setSymbolIndex(index: number): void;
    setBlurEffect(isBlured: boolean): void;
    stopWinAnimation(): void;
}