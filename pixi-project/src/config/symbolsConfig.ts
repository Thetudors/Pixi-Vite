export interface ISymbolConfig {
    id: number;
    name: string;
    animation: string;
    value: number;
    odds: number;
}

export const SYMBOLS_CONFIG: ISymbolConfig[] = [
    {//0 
        id: 1, 
        name: "bell", 
        animation: "bell_win", 
        value: 500,
        odds: 20
    },
    {//1
        id: 2, 
        name: "cherry", 
        animation: "cherry_win", 
        value: 100,
        odds: 40
    },
    {//2
        id: 3, 
        name: "lemon", 
        animation: "lemon_win", 
        value: 1000,
        odds: 10
    },
    {//3
        id: 4, 
        name: "moneybag", 
        animation: "money_bag_win", 
        value: 300,
        odds: 30
    },
    { 
        id: 5, 
        name: "orange", 
        animation: "orange_win", 
        value: 300,
        odds: 30
    },
    { 
        id: 6, 
        name: "plum", 
        animation: "plum_win", 
        value: 300,
        odds: 30
    }
];

export const getRandomSymbol = (): ISymbolConfig => {
    return SYMBOLS_CONFIG[Math.floor(Math.random() * SYMBOLS_CONFIG.length)];
};