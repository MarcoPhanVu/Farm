export function RandomFromMinToMax(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

export function PosOrNeg() {
    return Math.random() < 0.5 ? 1 : -1;
}
