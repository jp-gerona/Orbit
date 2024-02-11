import handleInput from './utils/inputUtils.js';
import { postCreateUser } from './fetchAPI.js';
/*
 * Validates the form matched by the provided selector. 
 * Loops through all validation rules defined in validationOptions, 
 * checks if the input passes each rule, and shows an error if not.
 * Handles real-time validation on blur and on submit.
 */
const validateForm = (formSelector, callback) => {
  const formElement = document.querySelector(formSelector);

  /*
   * validationOptions - Array of validation rule objects to check form inputs against.
   * Each object has:
   * - attribute - The attribute to check on the input (e.g. minlength). 
   * - isValid - Validation function that returns true if valid.
   * - errorMessage - Function to generate error message if invalid.
   */
  const validationOptions = [
    {
      attribute: 'minlength',
      isValid: input => input.value && input.value.length >= parseInt(input.minLength, 10),
      errorMessage: (input, placeholder) => `${placeholder.textContent} must be at least ${input.minLength} characters.`
    },
    {
      attribute: 'match',
      isValid: input => {
        const matchSelector = input.getAttribute('match');
        const matchedElement = formElement.querySelector(`#${matchSelector}`);
        return matchedElement && matchedElement.value.trim() === input.value.trim();
      },
      errorMessage: (input, placeholder) => {
        const matchSelector = input.getAttribute('match');
        const matchedElement = formElement.querySelector(`#${matchSelector}`);
        const matchedLabel = matchedElement.parentElement.querySelector('.placeholder');

        return `${placeholder.textContent} should match ${matchedLabel.textContent}`
      }
    },
    {
      attribute: 'required',
      isValid: input => input.value.trim() !== '',
      errorMessage: (input, placeholder) => `${placeholder.textContent} is required.`
    }
  ];

  /*
   * Validates a single form group by checking its input element against 
   * the validation options rules. Shows error message on failure or 
   * success message on pass. Returns true if valid.
   * formGroup - The form group element to validate
  */
  const validateSingleFormGroup = formGroup => {
    const textField = formGroup.querySelector('.text-field');
    const placeholder = formGroup.querySelector('.text-field .placeholder');
    const input = formGroup.querySelector('input');
    const helper = formGroup.querySelector('.text-field .helper');

    let formGroupError = false;
    for (const option of validationOptions) {
      if (input.hasAttribute(option.attribute) && !option.isValid(input)) {
        helper.textContent = option.errorMessage(input, placeholder);
        textField.classList.add('error');
        textField.classList.remove('success');
        formGroupError = true;
      }
    }

    if (!formGroupError) {
      helper.textContent = '';
      textField.classList.add('success');
      textField.classList.remove('error');
    }

    return !formGroupError;
  };

  /*
   * Disables HTML5 form validation by setting the novalidate attribute on the form element.
   * This allows us to handle validation manually with JavaScript instead.
   */
  formElement.setAttribute('novalidate', '');

  Array.from(formElement.elements).forEach(element => {
    element.addEventListener('blur', event => {
      validateSingleFormGroup(event.srcElement.parentElement.parentElement)
    });
  });

   /*
   * Validates all form groups in a form.
   * Loops through all the form groups in the provided form 
   * and validates each one using validateSingleFormGroup().
   * Returns true if all form groups are valid, false otherwise.
   */
  const validateAllFormGroups = formToValidate => {
    const formGroups = Array.from(formToValidate.querySelectorAll('.JS-formGroup'));

    return formGroups.every(formGroup => validateSingleFormGroup(formGroup));
  };

  formElement.addEventListener('submit', event => {
    const formValid = validateAllFormGroups(formElement);
    event.preventDefault();

    if (formValid) {
      callback(formElement);
    }
  });
};

const handlePostCreateUserResult = async (formElement, result) => {
  const usernameTextField = formElement.querySelector('#username').parentNode;
  const usernamePlaceholder = usernameTextField.querySelector('.placeholder');
  const usernameHelper = usernameTextField.querySelector('.helper');

  // todo I dont know how to make this persist because it gets overidden by the validateSingleFormGroup.
  if (!result) {
    usernameHelper.textContent = `${usernamePlaceholder.textContent} already exists.`;
    usernameTextField.classList.add('error');
    usernameTextField.classList.remove('success');
  }
};

const sendtoAPI =  async (formElement) => {
  const formObject = Array.from(formElement.elements)
    .filter(element => element.type !== 'submit' && element.id !== 'confirmPassword')
    .reduce((accumulator, element) => ({
      ...accumulator, [element.id]: element.value
    }), {});

    try {
      const result = await postCreateUser(formObject);
      await handlePostCreateUserResult(formElement, result);
    } catch (error) {
      console.error('Error occurred while creating user:', error);
      // Handle error if necessary
    }
}

validateForm('#JS-signupForm', sendtoAPI);
handleInput('.text-field input');
