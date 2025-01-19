import { Container, Sprite, Assets } from 'pixi.js';
import { Engine } from '../core/engine';
import { ReelManager } from './ReelManager';

export class GameManager {
    private engine: Engine;
    private gameContainer: Container;
    private reelManager: ReelManager;
    private background: Sprite;

    constructor(engine: Engine) {
        this.engine = engine;
        this.gameContainer = new Container();
        this.engine.addChild(this.gameContainer);

        // Create background
        this.background = Sprite.from('reels');
        this.background.anchor.set(0.5);
        this.gameContainer.addChild(this.background);

        // Initialize reels after background
        this.reelManager = new ReelManager(this.gameContainer);
        this.initGame();
    }

    private initGame(): void {
        // this.centerGame();
    }

    public async spin(): Promise<void> {
        await this.reelManager.spin();
        this.checkWin();
    }

    private checkWin(): void {
        const reels = this.reelManager.getReels();
        // Implement win checking logic
    }

}