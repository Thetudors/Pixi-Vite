import { Container, Text, TextStyle } from "pixi.js"
import { ReelManager } from "../managers/ReelManager"
import { WIN_LINES } from "../config/winLineConfig";
import gsap from 'gsap';

const style = new TextStyle({
    fontSize: 72,
    fontFamily: 'Arial Black',
    fill: '#FFD700', // Gold to orange gradient
    stroke: '#4a1850',
    dropShadow: {
        color: '#000000',
        blur: 4,
        angle: Math.PI / 6,
        distance: 6,
        alpha: 1
    },
    align: "center",
    fontWeight: 'bold'
})

export class WinLineController extends Container {
    private _reelManager: ReelManager;
    private _winText: Text = new Text;
    private _winningSymbols: { symbol: number, positions: number[][], winAmount: number }[] = [];
    private _isAnimating: boolean = false;
    private readonly WIN_LOOP_DELAY: number = 1.5;
    private _currentWinIndex: number = 0;



    constructor(reelManager: ReelManager, parentContainer: Container) {
        super();
        this._reelManager = reelManager;
        parentContainer.addChild(this);
        this._winningSymbols = WIN_LINES;
        this.initDisplay();
    }

    private initDisplay(): void {
        this._winText = new Text({ text: "", style });
        this._winText.anchor.set(0.5);
        this.addChild(this._winText);
    }

    private setWinText(winAmount: number): void {
        gsap.fromTo(this._winText.scale, { x: 1, y: 1 }, {
            x: 1.2,
            y: 1.2,
            duration: 0.3,
            ease: "power1.out",
            yoyo: true,
            repeat: 1,
        });
        this._winText.text ="$ "+winAmount;
    }

    public checkWins(): void {
        if (this._winningSymbols.length > 0) {
            this.startWinLoopAnimation();
        } else {
            this.stopWinLoopAnimation();
        }
    }

    private startWinLoopAnimation(): void {
        if (this._isAnimating) return;
        this._isAnimating = true;
        this.playNextWinAnimation();
    }

    private playNextWinAnimation(): void {

        this.stopCurrentWinAnimation();

        const currentWin = this._winningSymbols[this._currentWinIndex];
        this.playWinAnimation(currentWin);
        this.setWinText(currentWin.winAmount);
        this._currentWinIndex = (this._currentWinIndex + 1) % this._winningSymbols.length;

        gsap.delayedCall(this.WIN_LOOP_DELAY, () => {
            if (this._isAnimating) {
                this.playNextWinAnimation();
            }
        });
    }

    private playWinAnimation(win: { symbol: number, positions: number[][], winAmount: number }): void {
        this._reelManager.displaySymbols.forEach(row => {
            row.forEach(symbol => {
                if (symbol) {
                    symbol.isBlackOut = true;
                }
            });
        });
        win.positions.forEach(pos => {
            const [rIndex, cIndex] = pos;
            const symbol = this._reelManager.displaySymbols[rIndex][cIndex];
            if (symbol) {
                symbol.isBlackOut = false;
                symbol.playWinAnimation();
            }
        });
    }

    private stopCurrentWinAnimation(): void {
        // Stop previous symbol animations
        const previousWin = this._winningSymbols[this._currentWinIndex];
        if (previousWin) {
            previousWin.positions.forEach(pos => {
                const [rIndex, cIndex] = pos;
                const symbol = this._reelManager.displaySymbols[rIndex][cIndex];

                if (symbol) {
                    symbol.stopWinAnimation();
                }
            });
        }
    }

    public stopWinLoopAnimation(): void {
        if (this._isAnimating) {
            this.stopCurrentWinAnimation();
            this._reelManager.displaySymbols.forEach(row => {
                row.forEach(symbol => {
                    if (symbol) {
                        symbol.isBlackOut = false;
                    }
                });
            });
        }
        this._currentWinIndex = 0;
        this._isAnimating = false;
        this._winText.text = '';

    }

}