var NoValidInputJSONError = require('./NoValidInputJSONError');

/**
 * Compares two JSON-objects and returns an array of JSON-patch-operations that represents the difference between the two objects.
 * @param {*} objA
 * @param {*} objB
 */
function jsonDiff(objA, objB) {
    // Check for null arguments
    if (objA == null ||  objB == null) {
        throw new NoValidInputJSONError('Cannot compare arguments that are NULL or UNDEFINED.');
    }

    // Check for string arguments
    if (typeof objA === 'string' || typeof objB === 'string') {
        throw new NoValidInputJSONError('Cannot compare arguments of type \'string\'.');
    }

    // Stringify and parse arguments to eliminate non-JSON properties.
    // Catch circular references and objects that evaluate to null or undefined when stringified
    try {
        objA = JSON.parse(JSON.stringify(objA));
        objB = JSON.parse(JSON.stringify(objB));
    } catch (e) {
        if (e.name === 'TypeError') {
            throw new NoValidInputJSONError('Cannot compare objects with circular references.');
        } else if (e.name === 'SyntaxError') {
            throw new NoValidInputJSONError();
        }
        throw e;
    }

    // Check for non-object and non-array arguments
    if (!((typeof objA === 'object' || objA.constructor === Array) && (typeof objB === 'object' || objB.constructor === Array))) {
        throw new NoValidInputJSONError('Cannot compare arguments that are not of type \'object\' or \'Array\'.');
    }

    // Check for distinct argument types
    if (typeof objA !== typeof objB || objA.constructor !== objB.constructor) {
        throw new NoValidInputJSONError('Cannot compare argument of type \'' + typeof objA + '\' with argument of type \'' + typeof objB + '\'.');
    }

    var patches = [];
    _compare.bind(patches)(objA, objB, '');
    return patches;
}

function _compare(objA, objB, path) {
    if (isPrimitive(objA)) {
        if (isPrimitive(objB) && typeof objA === typeof objB) {
            if (objA !== objB) {
                this.push({
                    op: 'replace',
                    path: path,
                    value: objB
                });
            }
        } else {
            this.push({
                op: 'replace',
                path: path,
                value: objB
            });
        }
    } else if (objA.constructor === Array || objB.constuctor === Array) {
        var arraysEqual = false;
        if (objA.length === objB.length) {
            for (var i = 0; i < objA.length; i++) {
                _compare.bind(this)(objA[i], objB[i], path + '/' + i);
            }
        } else {
            this.push({
                op: 'replace',
                path: path + '/' + i,
                value: objB
            });
        }
    } else {
        var keysA = Object.keys(objA);
        var keysB = Object.keys(objB);

        for (var i = 0; i < keysA.length; i++) {
            if (keysB.indexOf(keysA[i]) === -1 || (objA[keysA[i]] != null && objB[keysA[i]] == null)) {
                this.push({
                    op: 'remove',
                    path: path + '/' + keysA[i]
                });
            } else {
                _compare.bind(this)(objA[keysA[i]], objB[keysA[i]], path + '/' + keysA[i]);
            }
        }

        for (var i = 0; i < keysB.length; i++) {
            if (keysA.indexOf(keysB[i]) === -1 || (objB[keysB[i]] != null && objA[keysB[i]] == null)) {
                this.push({
                    op: 'add',
                    path: path + '/' + keysB[i],
                    value: objB[keysB[i]]
                });
            }
        }
    }
}

function isPrimitive(value) {
    if (typeof value === 'boolean') {
        return true;
    }
    if (typeof value === 'number') {
        return true;
    }
    if (typeof value === 'string') {
        return true;
    }
    if (value == null) {
        return true;
    }
    return false;
}

module.exports = exports = jsonDiff;