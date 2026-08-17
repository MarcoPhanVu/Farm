export function RandomFromMinToMax(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

export function PosOrNeg() {
    return Math.random() < 0.5 ? 1 : -1;
}

export function RandomObjectFromObjectList(objList) {
    return objList[
        Object.keys(objList)[RandomFromMinToMax(0, Object.keys(objList).length)]
    ];
}
