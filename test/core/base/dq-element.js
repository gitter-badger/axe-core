/*global DqElement */
describe('DqElement', function () {
	'use strict';

	var fixture = document.getElementById('fixture');

	afterEach(function () {
		fixture.innerHTML = '';
	});

	it('should be a function', function () {
		assert.isFunction(DqElement);
	});

	it('should take a node as a parameter and return an object', function () {
		var node = document.createElement('div');
		var result = new DqElement(node);

		assert.isObject(result);
	});
	describe('element', function () {
		it('should store reference to the element', function () {
			var div = document.createElement('div');
			var dqEl = new DqElement(div);
			assert.equal(dqEl.element, div);
		});

		it('should not be present in stringified version', function () {
			var div = document.createElement('div');
			var dqEl = new DqElement(div);

			assert.isUndefined(JSON.parse(JSON.stringify(dqEl)).element);
		});
	});

	describe('source', function () {
		it('should include the outerHTML of the element', function () {
			fixture.innerHTML = '<div id="foo" class="bar">Hello!</div>';

			var result = new DqElement(fixture.firstChild);
			assert.equal(result.source, fixture.firstChild.outerHTML);
		});

		it('should truncate large elements', function () {
			var div = '<div class="foo" id="foo">';
			for (var i = 0; i < 300; i++) {
				div += i;
			}
			div += '</div>';
			fixture.innerHTML = div;

			var result = new DqElement(fixture.firstChild);
			assert.equal(result.source, '<div class="foo" id="foo">');
		});

		it('should use spec object over passed element', function () {
			fixture.innerHTML = '<div id="foo" class="bar">Hello!</div>';
			var result = new DqElement(fixture.firstChild, {
				source: 'woot'
			});
			assert.equal(result.source, 'woot');
		});
	});

	describe('selector', function () {

		it('should call utils.getSelector', function () {
			var orig = utils.getSelector;
			var success = false;
			var expected = { monkeys: 'bananas' };

			utils.getSelector = function (p) {
				success = true;
				assert.equal(fixture, p);
				return expected;
			};

			var result = new DqElement(fixture);
			assert.deepEqual(result.selector, [expected]);
			utils.getSelector = orig;

		});

		it('should prefer selector from spec object', function () {
			fixture.innerHTML = '<div id="foo" class="bar">Hello!</div>';
			var result = new DqElement(fixture.firstChild, {
				selector: 'woot'
			});
			assert.equal(result.selector, 'woot');
		});

	});

	describe('toJSON', function () {
		it('should only stringify selector and source', function () {
			var expected = {
				selector: 'foo > bar > joe',
				source: '<joe aria-required="true">'
			};
			var result = new DqElement('joe', expected);

			assert.deepEqual(JSON.stringify(result), JSON.stringify(expected));
		});
	});
});
