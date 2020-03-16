/**
* Insert new No to the Tree
* 
* @param {number} number
* @return {number} number.toFixed(2)
*/
function fixDouble(number) {
    try {
        return parseFloat(number.toFixed(2));
    } catch (e) {
        return parseFloat((parseFloat(number)).toFixed(2));
    }
}

/**
* Apply simple Code on number
* 
* @param {number} number
* @param {boolean} width (true to wsz, false to hsz, or null to sz)
* @returns {string} number or sz(number)
*/
function sz(number, width) {
    number = fixDouble(number);
    let tag = width == null ? '' : width ? 'w' : 'h';
    const withSimpleCode = !false;
    if (withSimpleCode && number > 0) {
        return tag + `sz(${number})`;
    }
    return `${number}`;
}


function formatDartCode(dartCode) {
    dartCode = dartCode.split('[').join('[\n');
    dartCode = dartCode.split(',').join(',\n');
    dartCode = dartCode.split(':').join(': ');
    return dartCode;
}

function tab(depth) {
    let res = ``;
    for (let i = 0; i < depth; i++) {
        res += `  `;
    }
    return res;
}

module.exports = {
    fixDouble: fixDouble,
    formatDartCode: formatDartCode,
    sz: sz,
    tab: tab,
};