import { postCreatePost, getPosts, fetchUserList } from './fetchAPI.js';
import followUser from './utils/followUtils.js';

const textarea = document.getElementById('writePost');
const charCount = document.querySelector('.char-count');
postButton.disabled = true;

textarea.addEventListener('input', function() {
  this.style.height = 'auto';
  this.style.height = this.scrollHeight + 'px';
});

const updateCharCount = () => {
  const remainingChars = 300 - textarea.value.length;
  charCount.innerHTML = remainingChars > 0 ? `${remainingChars} / 300 characters <i class="ri-quill-pen-line"></i>` : '';
};

textarea.addEventListener('input', updateCharCount);
textarea.addEventListener('focus', updateCharCount);
textarea.addEventListener('blur', function() {
  if (this.value.trim() === '') {
      charCount.textContent = '';
  }
});


const validateForm = (formSelector, callback) => {
  const formElement = document.querySelector(formSelector);

  formElement.addEventListener('keyup', event => {
    const textarea = formElement.querySelector('#writePost');
    const postButton = formElement.querySelector('#postButton');
    
    if (!textarea.value.trim()) {
      postButton.disabled = true;
    } else {
      postButton.disabled = false;
    }
  });

  formElement.addEventListener('submit', event => {
    event.preventDefault();
    const textarea = formElement.querySelector('#writePost');
    charCount.textContent = '';
    postButton.disabled = true;

    if (textarea.value.trim()) {
      callback(formElement, event);
    }
  });
};

const sendtoAPI = async (formElement, event) => {
  const textarea = formElement.querySelector('#writePost');
  const text = textarea.value.trim();

  try {
    console.log(text);
    // todo await API here
    postCreatePost(formElement);
    getPosts();
    textarea.value = '';
    event.preventDefault();
  } catch (error) {
    console.error('Error occurred while posting:', error);
  }
}

document.addEventListener("DOMContentLoaded", getPosts);
validateForm('#JS-createPost', sendtoAPI);
followUser('.follow-btn');
fetchUserList(); //fetch Users upon load