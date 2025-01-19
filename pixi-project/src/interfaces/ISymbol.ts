import { Spine } from "@esotericsoftware/spine-pixi-v8";

export interface ISymbol {   
    id:number;
    name:string;
    symbolSpine: Spine;
    playWinAnimation():void;
    playBlackoutAnimation():void;
}