export function RandomFromMinToMax(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function PosOrNeg() {
    return Math.random() < 0.5 ? 1 : -1;
}

export function getRandomValueFromObject(objList) {
    const keys = Object.keys(objList);

    if (keys.length === 0) {
        return null;
    }

    return objList[keys[RandomFromMinToMax(0, keys.length - 1)]];
}
