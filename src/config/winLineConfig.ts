interface WinLine {
    symbol: number;
    positions: number[][];
    winAmount: number
}

export const WIN_LINES: WinLine[] = [
    { symbol: 1, positions: [[0, 3], [1, 3], [2, 3]], winAmount: 5 },
    { symbol: 2, positions: [[0, 0], [1, 2], [2, 0], [3, 2]], winAmount: 10 },
    { symbol: 3, positions: [[0, 2], [1, 1], [2, 2], [3, 1], [4, 2]], winAmount: 15 }
];