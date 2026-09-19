export function RandomFromMinToMax(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function PosOrNeg() {
    return Math.random() < 0.5 ? 1 : -1;
}

/**
 *
 * @param {Object} objList - is this shit working?
 * @returns
 */
export function getRandomKeyFromObject(objList) {
    const keys = Object.keys(objList);

    if (keys.length === 0) {
        return null;
    }

    return objList[keys[RandomFromMinToMax(0, keys.length - 1)]];
}

export function getRandomElementFromArray(arr) {
    return array[Math.floor(Math.random() * array.length)];
}
