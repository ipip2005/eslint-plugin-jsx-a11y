/**
 * @fileoverview Enforce aria role attribute is valid.
 * @author Ethan Cohen
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

import rule from '../../../src/rules/aria-role';
import { RuleTester } from 'eslint';

const parserOptions = {
  ecmaVersion: 6,
  ecmaFeatures: {
    jsx: true
  }
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester();

const errorMessage = {
  message: 'Elements with ARIA roles must use a valid, non-abstract ARIA role.',
  type: 'JSXAttribute'
};

import ROLES from '../../../src/util/attributes/role';

const validRoles = Object.keys(ROLES).filter(role => ROLES[role].abstract === false);
const invalidRoles = Object.keys(ROLES).filter(role => ROLES[role].abstract === true);

const createTests = roles => roles.map(role => ({
  code: `<div role="${role.toLowerCase()}" />`,
  parserOptions
}));

const validTests = createTests(validRoles);
const invalidTests = createTests(invalidRoles).map(test => {
  test.errors = [ errorMessage ];
  return test;
});

ruleTester.run('aria-role', rule, {
  valid: [
    // Variables should pass, as we are only testing literals.
    { code: '<div />', parserOptions },
    { code: '<div></div>', parserOptions },
    { code: '<div role={role} />', parserOptions },
    { code: '<div role={role || "button"} />', parserOptions },
    { code: '<div role={role || "foobar"} />', parserOptions },
    { code: '<div role="tabpanel row" />', parserOptions },
    { code: '<div role="doc-abstract" />', parserOptions },
    { code: '<div role="doc-appendix doc-bibliography" />', parserOptions },
    { code: '<Bar baz />', parserOptions }
  ].concat(validTests),

  invalid: [
    { code: '<div role="foobar" />', errors: [ errorMessage ], parserOptions },
    { code: '<div role="datepicker"></div>', errors: [ errorMessage ], parserOptions },
    { code: '<div role="range"></div>', errors: [ errorMessage ], parserOptions },
    { code: '<div role=""></div>', errors: [ errorMessage ], parserOptions },
    { code: '<div role="tabpanel row foobar"></div>', errors: [ errorMessage ], parserOptions },
    { code: '<div role="tabpanel row range"></div>', errors: [ errorMessage ], parserOptions },
    { code: '<div role="doc-endnotes range"></div>', errors: [ errorMessage ], parserOptions },
    { code: '<div role />', errors: [ errorMessage ], parserOptions },
    { code: '<div role={null}></div>', errors: [ errorMessage ], parserOptions }
  ].concat(invalidTests)
});
