const randomstring = require('randomstring');

export function createCaseId() {
    const id = randomstring.generate({ length: 18, charset: 'numeric' });
    return id;
};