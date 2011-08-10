var testCase = require('nodeunit').testCase,
    parser = require('../lib/parser');

exports.Tags = testCase({
    'undefined tag throws error': function (test) {
        test.throws(function () {
            parser.parse('{% foobar %}', {});
        }, Error);
        test.done();
    },

    'basic tag': function (test) {
        var output = parser.parse('{% blah %}', { blah: {} });
        test.deepEqual([{ type: parser.TOKEN_TYPES.LOGIC, name: 'blah', args: [], compile: {} }], output);

        output = parser.parse('{% blah "foobar" %}', { blah: {} });
        test.deepEqual([{ type: parser.TOKEN_TYPES.LOGIC, name: 'blah', args: ['"foobar"'], compile: {} }], output, 'args appended');

        output = parser.parse('{% blah "foobar" barfoo %}', { blah: {} });
        test.deepEqual([{ type: parser.TOKEN_TYPES.LOGIC, name: 'blah', args: ['"foobar"', 'barfoo'], compile: {} }], output, 'multiple args appended');

        test.done();
    },

    'basic tag with ends': function (test) {
        var output = parser.parse('{% blah %}{% end %}', { blah: { ends: true } });
        test.deepEqual([{ type: parser.TOKEN_TYPES.LOGIC, name: 'blah', args: [], compile: { ends: true }, tokens: [] }], output);
        test.done();
    },

    'throws if requires end but no end found': function (test) {
        test.throws(function () {
            parser.parse('{% blah %}', { blah: { ends: true }});
        }, Error);
        test.done();
    },

    'throws if not end but end found': function (test) {
        test.throws(function () {
            parser.parse('{% blah %}{% end %}', { blah: {}});
        }, Error);
        test.done();
    },

    'tag with contents': function (test) {
        var output = parser.parse('{% blah %}hello{% end %}', { blah: { ends: true } });
        test.deepEqual([{ type: parser.TOKEN_TYPES.LOGIC, name: 'blah', args: [], compile: { ends: true }, tokens: ['hello'] }], output);
        test.done();
    }
});

exports.Comments = testCase({
    'empty strings are ignored': function (test) {
        var output = parser.parse('');
        test.deepEqual([], output);

        output = parser.parse(' ');
        test.deepEqual([], output);

        output = parser.parse(' \n');
        test.deepEqual([], output);

        test.done();
    },

    'comments are ignored': function (test) {
        var output = parser.parse('{# foobar #}');
        test.deepEqual([], output);
        test.done();
    }
});

exports.Variable = testCase({
    'basic variable': function (test) {
        var output = parser.parse('{{ foobar }}');
        test.deepEqual([{ type: parser.TOKEN_TYPES.VAR, name: 'foobar', filters: [] }], output, 'with spaces');

        output = parser.parse('{{foobar}}');
        test.deepEqual([{ type: parser.TOKEN_TYPES.VAR, name: 'foobar', filters: [] }], output, 'without spaces');

        test.done();
    },

    'dot-notation variable': function (test) {
        var output = parser.parse('{{ foo.bar }}');
        test.deepEqual([{ type: parser.TOKEN_TYPES.VAR, name: 'foo.bar', filters: [] }], output);
        test.done();
    },

    'variable with filter': function (test) {
        var output = parser.parse('{{ foobar|awesome }}');
        test.deepEqual([{ type: parser.TOKEN_TYPES.VAR, name: 'foobar', filters: [{ name: 'awesome', args: [] }] }], output, 'filter by name');

        output = parser.parse('{{ foobar|awesome("param", 2) }}');
        test.deepEqual([{ type: parser.TOKEN_TYPES.VAR, name: 'foobar', filters: [{ name: 'awesome', args: ['param', 2] }] }], output, 'filter with params');

        test.done();
    },

    'multiple filters': function (test) {
        var output = parser.parse('{{ foobar|baz(1)|rad|awesome("param", 2) }}');
        test.deepEqual([{ type: parser.TOKEN_TYPES.VAR, name: 'foobar', filters: [
            { name: 'baz', args: [1] },
            { name: 'rad', args: [] },
            { name: 'awesome', args: ['param', 2] }
        ] }], output);

        test.done();
    },

    'filters do not carry over': function (test) {
        var output = parser.parse('{{ foo|baz }}{{ bar }}');
        test.deepEqual([
            { type: parser.TOKEN_TYPES.VAR, name: 'foo', filters: [{ name: 'baz', args: [] }] },
            { type: parser.TOKEN_TYPES.VAR, name: 'bar', filters: [] }
        ], output);
        test.done();
    }
});

exports.Compiling = testCase({
    // TODO: fill in tests for compiling
});
