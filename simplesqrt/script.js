/**
 * RadicalSign result
 * @typedef {Object} RadicalSign
 * @property {number} radicand 被開平数
 * @property {number} coefficient 係数
 */

/**
 * @param {number} n 
 * @returns {RadicalSign}
 */
function calcSimpleSqrt(n) {
    if (!Number.isInteger(n) || n < 0) return null;

    for (let i = Math.floor(Math.sqrt(n)); i >= 1; i--) {
        const square = i * i;
        if (n % square === 0) {
            return {
                coefficient: i,
                radicand: n / square
            };
        }
    }
    return null;
}

/**
 * @param {RadicalSign} result 
 * @returns {string}
 */
function resultToString(result) {
    if (!result) {
        return "エラー";
    }
    let str = "";
    const { coefficient, radicand } = result;
    const coefficientSq = coefficient * coefficient;

    if (coefficient === 1) {
        str += (`=√${radicand}`);
        return str;
    }
    if (radicand === 1) {
        str += (`=√${coefficientSq}\n`);
        str += (`=${coefficient}`);
        return str;
    }

    str += (`=√${coefficientSq}x√${radicand}\n`);
    str += (`=${coefficient}√${radicand}`);
    return str;
}



function onClickCalcBtn() {
    const result = calcSimpleSqrt(getInputValue());
    setAboutValue(resultToString(result));
}

function getInputValue() {
    // cast to number
    return +document.getElementById("input").value;
}
function setOutputValue(value) {
    return document.getElementById("output").value = value;
}
function setAboutValue(value) {
    return document.getElementById("about").value = value;
}

document.addEventListener("keydown", e => {
    if (e.key != "Enter") return;
    document.getElementById("calcBtn").click();
})