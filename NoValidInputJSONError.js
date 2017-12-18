module.exports = exports = function NoValidInputJSONError(message) {
    this.name = 'NoValidInputJSONError';
    this.message = message || 'The provided arguments are not valid JSON-objects.';
}