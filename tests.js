var assert = require('assert');
var jsonDiffPatch = require('./index');
var NoValidInputJSONError = require('./NoValidInputJSONError');

(function() {
    var sValid = { prop: 'Test' }

    this.testInputValidation = function() {
        console.log('\x1b[36m%s\x1b[0m', 'Testing input validation...');
        // Test for null-arguments
        assert.throws(function() { jsonDiffPatch(null, null) }, NoValidInputJSONError);
        assert.throws(function() { jsonDiffPatch(undefined, undefined) }, NoValidInputJSONError);
        assert.throws(function() { jsonDiffPatch() }, NoValidInputJSONError);
        assert.throws(function() { jsonDiffPatch(sValid) }, NoValidInputJSONError);
        assert.throws(function() { jsonDiffPatch(null, sValid) }, NoValidInputJSONError);

        // Test for string arguments
        assert.throws(function() { jsonDiffPatch('Test', 'Test') }, NoValidInputJSONError);
        assert.throws(function() { jsonDiffPatch('Test', sValid) }, NoValidInputJSONError);
        assert.throws(function() { jsonDiffPatch(sValid, 'Test') }, NoValidInputJSONError);

        // Test for number arguments
        assert.throws(function() { jsonDiffPatch(1, 1) }, NoValidInputJSONError);
        assert.throws(function() { jsonDiffPatch(1, sValid) }, NoValidInputJSONError);
        assert.throws(function() { jsonDiffPatch(sValid, 1) }, NoValidInputJSONError);

        // Test for boolean arguments
        assert.throws(function() { jsonDiffPatch(true, true) }, NoValidInputJSONError);
        assert.throws(function() { jsonDiffPatch(true, sValid) }, NoValidInputJSONError);
        assert.throws(function() { jsonDiffPatch(sValid, true) }, NoValidInputJSONError);

        // Test for arguments containing circular references
        var cR = {};
        cR.prop = cR;
        assert.throws(function() { jsonDiffPatch(cR, cR) }, NoValidInputJSONError);
        assert.throws(function() { jsonDiffPatch(cR, sValid) }, NoValidInputJSONError);
        assert.throws(function() { jsonDiffPatch(sValid, cR) }, NoValidInputJSONError);

        // Test for function arguments
        assert.throws(function() { jsonDiffPatch(function() {}, function() {}) }, NoValidInputJSONError);
        assert.throws(function() { jsonDiffPatch(function() {}, sValid) }, NoValidInputJSONError);
        assert.throws(function() { jsonDiffPatch(sValid, function() {}) }, NoValidInputJSONError);

        // Test for mismatching types
        assert.throws(function() { jsonDiffPatch({}, []) }, NoValidInputJSONError);
        assert.throws(function() { jsonDiffPatch([], {}) }, NoValidInputJSONError);

        // Test for valid input
        assert.doesNotThrow(function() { jsonDiffPatch([], []) }, NoValidInputJSONError);
        assert.doesNotThrow(function() { jsonDiffPatch({}, {}) }, NoValidInputJSONError);

        console.log('\x1b[32m%s\x1b[0m', 'Input validation tests passed!');
    }

    this.testEmptyPatchSets = function() {
        console.log('\x1b[36m%s\x1b[0m', 'Testing empty patch sets...');

        assert.deepStrictEqual(jsonDiffPatch([], []), []);
        assert.deepStrictEqual(jsonDiffPatch([1, 2, 3], [1, 2, 3]), []);
        assert.deepStrictEqual(jsonDiffPatch(['A', 'B', 'C'], ['A', 'B', 'C']), []);
        assert.deepStrictEqual(jsonDiffPatch([{
            propA: 'Test',
            propB: 123,
            propC: []
        }], [{
            propA: 'Test',
            propB: 123,
            propC: []
        }]), []);

        assert.deepStrictEqual(jsonDiffPatch({}, {}), []);
        assert.deepStrictEqual(jsonDiffPatch({ prop: 'Test' }, { prop: 'Test' }), []);
        assert.deepStrictEqual(jsonDiffPatch({ prop: 123 }, { prop: 123 }), []);


        assert.deepStrictEqual(jsonDiffPatch([null], [null]), []);
        assert.deepStrictEqual(jsonDiffPatch([null], [undefined]), []);
        assert.deepStrictEqual(jsonDiffPatch([undefined], [undefined]), []);

        assert.deepStrictEqual(jsonDiffPatch([null, 1], [null, 1]), []);
        assert.deepStrictEqual(jsonDiffPatch([null, 1], [undefined, 1]), []);
        assert.deepStrictEqual(jsonDiffPatch([undefined, 1], [undefined, 1]), []);

        assert.deepStrictEqual(jsonDiffPatch({ prop: null }, { prop: null }), []);
        assert.deepStrictEqual(jsonDiffPatch({ prop: undefined }, { prop: undefined }), []);

        console.log('\x1b[32m%s\x1b[0m', 'Empty patch set tests passed!');
    }

    this.testPatchSets = function() {
        console.log('\x1b[36m%s\x1b[0m', 'Testing patch sets...');

        assert.deepStrictEqual(jsonDiffPatch({ prop: null }, { prop: undefined }), [{
            op: 'remove',
            path: '/prop'
        }]);

        assert.deepStrictEqual(jsonDiffPatch({ prop: null }, { prop: undefined }), [{
            op: 'remove',
            path: '/prop'
        }]);

        console.log('\x1b[32m%s\x1b[0m', 'Patch set tests passed!');
    }

    for (var key in this) {
        this[key]();
    }

    console.log('\x1b[32m%s\x1b[0m', 'All tests successfully passed!');
}.bind({}))();