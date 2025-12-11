export interface CalculatorState {
    display: string;
    currentInput: string;
    previousInput: string;
    operation: string | null;
    result: number | null;
    lastOperation: string | null;
    isResult: boolean;
    history: string[];
}
export type Operation = '+' | '-' | '*' | '/' | '^' | 'sqrt';
export type Mode = 'full' | 'basic';
export interface ErrorState {
    message: string;
    gifUrl: string;
    recoverState: () => void;
}
//# sourceMappingURL=types.d.ts.map