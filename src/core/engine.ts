import { Application, Container, Assets } from 'pixi.js';
import { resize } from './resize/resize';

export class Engine {
    private _app: Application;
    private _mainContainer: Container = new Container();
    private _gameWidth: number = 1920;
    private _gameHeight: number = 1080;
    private _minWidth: number = 800;
    private _minHeight: number = 600;
    private readonly _backgroudColor: string = '#14042b';

    constructor() {
        this._app = new Application();
        (globalThis as any).__PIXI_APP__ = this._app;// For debugging purposes
    }

    async init() {
        await this._app.init({ background: this._backgroudColor, resizeTo: window });
        document.getElementById("pixi-container")!.appendChild(this._app.canvas);

        this._mainContainer = new Container();
        this._app.stage.addChild(this._mainContainer);

        // Add resize event listener
        window.addEventListener('resize', this.handleResize.bind(this));
        this.handleResize(); // Initial resize
        await this.loadAssets();
        return this;
    }

    private async loadAssets() {
        await Assets.load([
            { alias: "symbols-atlas", src: "/assets/symbols_win.atlas" },
            { alias: "symbols-json", src: "/assets/symbols_win.json" },
            { alias: "reels", src: "/assets/reels.jpg" },
        ]);
    }

    private handleResize(): void {
        const { width, height } = resize(
            this._gameWidth,
            this._gameHeight,
            this._minWidth,
            this._minHeight,
            true  // preserveAspectRatio'yu true yapıyoruz
        );

        // Update renderer size
        this._app.renderer.resize(width, height);

        // Calculate scale for the container
        const scale = Math.min(
            width / this._gameWidth,
            height / this._gameHeight
        );

        // Update container position and scale
        this._mainContainer.scale.set(scale);
        this._mainContainer.x = width / 2;
        this._mainContainer.y = height / 2;

    }

    public addChild(object: any) {
        object.position.set(0, 0); // This will be center since mainContainer is centered
        this._mainContainer.addChild(object);
    }

    public get app() {
        return this._app;
    }
}