import { Container, Sprite } from 'pixi.js';
import { Engine } from '../core/engine';
import { ReelManager } from './ReelManager';
import { WinLineController } from '../components/WinLineController';

export class GameManager {
    private engine: Engine;
    private _gameContainer: Container;
    private _reelManager: ReelManager;
    private _winLineController: WinLineController;
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

        //Create WinLineCotroller
        this._winLineController = new WinLineController(this._reelManager, this._gameContainer);
    }

    public async spin(): Promise<void> {
        if (this._reelManager.isSpinning)
            return;
        this._winLineController.stopWinLoopAnimation();
        await this._reelManager.spin();
        this._winLineController.checkWins();
    }

    public stop(): void {
        this._reelManager.stop();
    }

}