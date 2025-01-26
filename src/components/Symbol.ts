import { Container, BlurFilter } from "pixi.js"
import { ISymbol } from "../interfaces/ISymbol";
import { Spine } from '@esotericsoftware/spine-pixi-v8';
import { SYMBOLS_CONFIG } from "../config/symbolsConfig";

export class Symbol extends Container implements ISymbol {
    private _id: number;
    private _name: string;
    private _symbolSpine: Spine;
    private _animation: string
    private _isBlackOut: boolean;

    constructor(id: number, name: string, animation: string, skeleton: string, atlas: string) {
        super();
        this._id = id;
        this._name = name;
        this._animation = animation;
        this._isBlackOut = false;
        this._symbolSpine = Spine.from({ skeleton: skeleton, atlas: atlas });
        this._symbolSpine.state.setAnimation(0, animation, false);
        this._symbolSpine.state.timeScale = 0;
        this.addChild(this._symbolSpine);
    }

    get id(): number {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get symbolSpine(): Spine {
        return this._symbolSpine;
    }

    get isBlackOut(): boolean {
        return this._isBlackOut;
    }
    
    public setSymbolIndex(index: number): void {
        this._id = SYMBOLS_CONFIG[index].id;
        this._name = SYMBOLS_CONFIG[index].name;
        this._animation = SYMBOLS_CONFIG[index].animation;
        this._symbolSpine.state.setAnimation(0, SYMBOLS_CONFIG[index].animation, false);
        this._symbolSpine.state.timeScale = 0;
    }

    public setBlurEffect(isBlurred: boolean): void {
        if (isBlurred) {
            const blurFilter = new BlurFilter({ strengthX: 0, strengthY: 6 });
            this._symbolSpine.filters = [blurFilter];
        } else {
            this._symbolSpine.filters = [];
        }
    }

    public playWinAnimation(): void {
        const track = this._symbolSpine.state.setAnimation(0, this._animation, false);
        this._symbolSpine.state.timeScale = 1;
        track.trackTime = 0;
    }

    public stopWinAnimation(): void {
        this._symbolSpine.state.timeScale = 0;
    }

    public set isBlackOut(value: boolean) {
        if (value == false) {
            this._symbolSpine.tint = 0xfafafa
        } else {
            this._symbolSpine.tint = 0x3b3838;
        }
        this._isBlackOut = value;
    }
}