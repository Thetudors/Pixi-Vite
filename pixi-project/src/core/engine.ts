import { Application, Container, Assets } from 'pixi.js';
import { resize } from './resize/resize';

export class Engine {
    private _app: Application;
    private mainContainer: Container = new Container();
    private gameWidth: number = 1920;
    private gameHeight: number = 1080;
    private minWidth: number = 800;
    private minHeight: number = 600;

    constructor() {
        this._app = new Application();
        (globalThis as any).__PIXI_APP__ = this._app;// For debugging purposes
    }

    async init() {
        await this._app.init({ background: '#1099bb', resizeTo: window });
        document.getElementById("pixi-container")!.appendChild(this._app.canvas);

        this.mainContainer = new Container();
        this._app.stage.addChild(this.mainContainer);

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
            this.gameWidth,
            this.gameHeight,
            this.minWidth,
            this.minHeight,
            true  // preserveAspectRatio'yu true yapıyoruz
        );

        // Update renderer size
        this._app.renderer.resize(width, height);

        // Calculate scale for the container
        const scale = Math.min(
            width / this.gameWidth,
            height / this.gameHeight
        );

        // Update container position and scale
        this.mainContainer.scale.set(scale);
        this.mainContainer.x = width / 2;
        this.mainContainer.y = height / 2;

    }

    public addChild(object: any) {
        // Position sprite relative to mainContainer
        object.position.set(0, 0); // This will be center since mainContainer is centered
        this.mainContainer.addChild(object);
    }

    public get app() {
        return this._app;
    }
}