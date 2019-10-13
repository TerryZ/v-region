// require("@babel/register");
require('jsdom-global')();
/**
 * this line code is to fix 'TypeError: Super expression must either be null or a function' issues
 * @link https://github.com/vuejs/vue-test-utils/issues/936
 */
//window.Date = Date;

//global.expect = require('chai').expect;