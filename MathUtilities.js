export default class MathUtilities {
    static median(...args)
    {
        const sorted = [...args].sort((a, b) => a - b);
        const isOdd = sorted.length % 2 === 0;
        if(!isOdd) {
            const index = Math.floor(sorted.length / 2);
            return [sorted[index], sorted, index];
        }
        const baseIndex = sorted.length / 2;
        const m1 = sorted[baseIndex - 1];
        const m2 = sorted[baseIndex];
        return [(m1 + m2) / 2, sorted, baseIndex - 0.5];
    } 
}
