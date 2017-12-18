function NoValidInputJSONError(message) {
    this.name = 'NoValidInputJSONError';
    this.message = message || 'The provided arguments are not valid JSON-objects.';
}

module.exports = exports = function jsonDiff(objA, objB) {
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
    if (!((typeof objA === 'object' || typeof objA === 'Array') && (typeof objB === 'object' || typeof objB === 'Array'))) {
        throw new NoValidInputJSONError('Cannot compare arguments that are not of type \'object\' or \'Array\'.');
    }

    // Check for distinct argument types
    if (typeof objA !== typeof objB) {
        throw new NoValidInputJSONError('Cannot compare argument of type \'' + typeof objA + '\' with argument of type \'' + typeof objB + '\'.');
    }
}