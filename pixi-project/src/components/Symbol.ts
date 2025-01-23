import { Container, BlurFilter } from "pixi.js"
import { ISymbol } from "../interfaces/ISymbol";
import { Spine } from '@esotericsoftware/spine-pixi-v8';
import { SYMBOLS_CONFIG } from "../config/symbolsConfig";

export class Symbol extends Container implements ISymbol {
    private _id: number;
    private _name: string;
    private _symbolSpine: Spine;
    private _animation: string

    constructor(id: number, name: string, animation: string, skeleton: string, atlas: string) {
        super();
        this._id = id;
        this._name = name;
        this._animation = animation;
        this._symbolSpine = Spine.from({ skeleton: skeleton, atlas: atlas });
        this._symbolSpine.state.setAnimation(0, animation, false);
        this._symbolSpine.state.timeScale = 0;
        this.addChild(this._symbolSpine);
    }

    // Required interface property implementations
    get id(): number {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get symbolSpine(): Spine {
        return this._symbolSpine;
    }

    public setSymbolIndex(index: number): void {
        this._id = SYMBOLS_CONFIG[index].id;
        this._symbolSpine.state.setAnimation(0, SYMBOLS_CONFIG[index].animation, false);
        this._symbolSpine.state.timeScale = 0;
    }

    public setBlurEffect(isBlurred: boolean): void {
        if (isBlurred) {
            const blurFilter = new BlurFilter({strengthX: 0, strengthY: 6 });
            this._symbolSpine.filters = [blurFilter];
        } else {
            this._symbolSpine.filters = [];
        }
    }

    playWinAnimation(): void {
        const track = this._symbolSpine.state.setAnimation(0, this._animation, false);
        this._symbolSpine.state.timeScale = 1;
        track.trackTime = 0;
    }

    playBlackoutAnimation(): void {
        throw new Error("Method not implemented.");
    }
}