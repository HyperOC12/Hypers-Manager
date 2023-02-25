const randomstring = require('randomstring');

function createCaseId() {
    const id = randomstring.generate({ length: 18, charset: 'numeric' });
    return id;
};

module.exports = {
    createCaseId
};
