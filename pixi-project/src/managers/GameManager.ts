import { Container, Sprite } from 'pixi.js';
import { Engine } from '../core/engine';
import { ReelManager } from './ReelManager';

export class GameManager {
    private engine: Engine;
    private _gameContainer: Container;
    private _reelManager: ReelManager;
    private _background: Sprite;

    constructor(engine: Engine) {
        this.engine = engine;
        this._gameContainer = new Container();
        this._gameContainer.label = 'gameContainer';
        this.engine.addChild(this._gameContainer);

        // Create background
        this._background = Sprite.from('reels');
        this._background.anchor.set(0.5);
        this._gameContainer.addChild(this._background);

        // Initialize reels after background
        this._reelManager = new ReelManager(this._gameContainer);
        this.initGame();
    }

    private initGame(): void {
        // this.centerGame();
    }

    public async spin(): Promise<void> {
        await this._reelManager.spin();
        this.checkWin();
    }

    public  stop(): void {
        this._reelManager.stop();
    }

    private checkWin(): void {
        // const reels = this.reelManager.getReels();
        // Implement win checking logic
    }

}