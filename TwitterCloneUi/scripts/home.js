import likePost from './utils/likeUtils.js';
import { postCreatePost, getPosts } from './fetchAPI.js';

const textarea = document.getElementById('writePost');

textarea.addEventListener('input', function() {
  this.style.height = 'auto';
  this.style.height = this.scrollHeight + 'px';
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
likePost('.like-btn');