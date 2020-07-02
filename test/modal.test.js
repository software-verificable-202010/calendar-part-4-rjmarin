const modal = require('../src/scripts/utils/modalutils');
const $ = require('jquery');
const document = require('../src/helpers/helper');
document.body.innerHTML =
    '<button type="button" class="close" id="close-btn" aria-label="Close"></button>' +
    '<input type="text" name="title" id="title" />' +
    '<input type="text" name="description" id="description" />' +
    '<input type="text" name="starts_at" id="starts-at" />' +
    '<input type="text" name="ends_at" id="ends-at" />' +
    '<input type="text" name="guest" id="guest">' +
    '<button type="submit" class="btn btn-primary" id="save-event">Save changes</button>' +
    '<button type="button" class="btn btn-danger" disabled id="delete-event">Delete</button>' +
    '<div id="error"></div>' +
    '</div>';

it('should empty input', () => {
  expect(modal.emptyInputs()).toBe(0);
});

it('should get inputs values', () => {
  expect(modal.getInputValues()).toBe(false);
});

it('should  get close modal button', () => {
  closeModal = modal.closeModal();
  expect(closeModal).toBe(0);
});

it('should get delete event button', () => {
  deleteEvent = modal.deleteEvent();
  expect(deleteEvent).toBe(0);
});

it('get error element', () => {
  error = document.createElement('div');
  error.innerText = "error";
  error.style.color = 'red';
  expect(modal.errorMsg("error")).toEqual(error);
});

