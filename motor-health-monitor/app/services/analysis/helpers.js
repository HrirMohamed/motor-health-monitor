
function average(values) {

    const valid = values.filter(v => Number.isFinite(v));

    if (valid.length === 0)
        return 0;

    return valid.reduce((a, b) => a + b, 0) / valid.length;
}

function maximum(values) {

    const valid = values.filter(v => Number.isFinite(v));

    if (valid.length === 0)
        return 0;

    return Math.max(...valid);
}

module.exports = {
    average,
    maximum
};