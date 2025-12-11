import type { Operation, CalculatorState } from './types.js';
export declare const addCharToInput: (state: CalculatorState, char: string) => CalculatorState;
export declare const performOperation: (state: CalculatorState) => CalculatorState;
export declare const clearState: (state: CalculatorState) => CalculatorState;
export declare const deleteLastChar: (state: CalculatorState) => CalculatorState;
export declare const setOperation: (state: CalculatorState, op: Operation) => CalculatorState;
export declare const handleSqrt: (state: CalculatorState) => CalculatorState;
export declare const isValidNumber: (input: string) => boolean;
//# sourceMappingURL=utils.d.ts.map