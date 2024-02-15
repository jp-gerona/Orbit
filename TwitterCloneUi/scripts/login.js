import handleInput from './utils/inputUtils.js';
import { postLogIn } from './fetchAPI.js';

const formElement = document.querySelector('#JS-loginForm');

formElement.addEventListener('submit', async event => {
  event.preventDefault();
  console.log('Success! Valid form submitted.');
  await postLogIn();
});

handleInput('.text-field input');