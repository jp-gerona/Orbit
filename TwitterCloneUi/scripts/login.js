import handleInput from './utils/inputUtils.js';
import { postLogIn } from './fetchAPI.js';

// todo: validation for api in login
/*async function usernameExists(username) {
  const response = await fetch('/api/v1/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({username}) 
  });
  
  if (response.status === 400) {
    // 400 means user already exists
    return true; 
  } else {
    return false;
  }
}

async function validatePassword(username, password) {
  const response = await fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({username, password})
  });

  if (response.status === 200) {
    // 200 means login success
    return true;
  } else {
    // 401 means invalid credentials
    return false; 
  }
}

const validateForm = async (formSelector) => {
  const formElement = document.querySelector(formSelector);
  const username = form.username.value;
  const password = form.password.value;
  const usernameValid = await usernameExists(username); 
  const passwordValid = await validatePassword(username, password);

  const validationOptions = [
    {
      attribute: 'usernameExists',
      isValid: input => input.usernameValid,
      errorMessage: (input, placeholder) => `${placeholder.textContent}  does not exist.`
    },
    {
      attribute: 'validPassword',
      isValid: input => input.passwordValid,
      errorMessage: (input, placeholder) => `${placeholder.textContent}  is not correct.`
    }
  ];

  const validateSingleFormGroup = async formGroup => {
    const textField = formGroup.querySelector('.text-field');
    const placeholder = formGroup.querySelector('.text-field .placeholder');
    const input = formGroup.querySelector('input');
    const helper = formGroup.querySelector('.text-field .helper');
  
    let formGroupError = false;
    let validationResults = {};
    for (const option of validationOptions) {
      if (input.hasAttribute(option.attribute)) {
        try {
          const isValid = await option.isValid(input.value);
          if (!isValid) {
            helper.textContent = option.errorMessage;
            textField.classList.add('error');
            textField.classList.remove('success');
            formGroupError = true;
            validationResults[option.attribute] = false;
          } else {
            validationResults[option.attribute] = true;
          }
        } catch (error) {
          console.error('Validation error:', error);
          validationResults[option.attribute] = false;
        }
      }
    }
  
    if (!formGroupError) {
      helper.textContent = '';
      textField.classList.add('success');
      textField.classList.remove('error');
    }
  
    return {
      isValid: !formGroupError,
      validationResults: validationResults
    };
  };

  formElement.setAttribute('novalidate', '');

  const validateAllFormGroups = formToValidate => {
    const formGroups = Array.from(formToValidate.querySelectorAll('.JS-formGroup'));

    return formGroups.every(formGroup => validateSingleFormGroup(formGroup));
  };

  formElement.addEventListener('submit', event => {
    const formValid = validateAllFormGroups(formElement);
    event.preventDefault();

    if (formValid) {
      console.log('Success! User logged in.');
    }
  });
};

validateForm('#JS-loginForm'); */
const formElement = document.querySelector('#JS-loginForm');

formElement.addEventListener('submit', async event => {
  event.preventDefault();
  console.log('Success! Valid form submitted.');
  await postLogIn();
});

handleInput('.text-field input');