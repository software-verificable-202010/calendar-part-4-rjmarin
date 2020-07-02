const loginView = require('../src/scripts/login.js');
const $ = require('jquery');
const document = require('../src/helpers/helper');
document.body.innerHTML =
    '<div>' +
    '  <input type="text" class="form-control" id="user-name">' +
    '  <button class="btn btn-default next" id="btn-login">Login</button>' +
    '<div id="error"></div>' +
    '</div>';

it('should not enter', () => {
  login = loginView.login();
  $('#btn-login').click();
  expect(login).toBe(0);
});

it('get error element', () => {
  error = document.createElement('div');
  error.innerText = "error";
  error.style.color = 'red';
  expect(loginView.errorMsg("error")).toEqual(error);
});

