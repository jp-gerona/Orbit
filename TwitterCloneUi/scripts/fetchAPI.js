import likePost from './utils/likeUtils.js';

export async function postCreateUser(formObject) {
    let username = formObject.username;
    let password = formObject.password;
  
    const res = await fetch("http://localhost:3000/api/v1/auth/register", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "username": username,
            "password": password
        })
    })
    if(res.ok){
        window.location.replace("index.html");
        return true;
    } else {
        return false;
    }
}

  export async function postLogIn() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
  
    const res = await fetch('http://localhost:3000/api/v1/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "username": username,
            "password": password
        })
    })
    if(res.ok){
        console.log('successful')
        const userToken = await res.text();
        console.log(`User token: ${userToken}`);
        localStorage.setItem("token", userToken)
        console.log(localStorage)
        window.location.replace("home.html");
    } else {
        console.log('login fails')
    }
  }

export let sendToken = {
  token: localStorage.getItem("token")
};

  export async function postCreatePost() {
    var post = document.getElementById("writePost").value;
    let token = localStorage.getItem("token");

    const res = await fetch('http://localhost:3000/api/v1/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            "content": post
        })
    });

    if (res.ok) {
        console.log('successful');
    } else {
        console.log('failed');
    }
}

  
  // export async function postCreatePost() {
  //     var post = document.getElementById('popupInput').value;
  //     let token = localStorage.getItem("token");
    
  //     const res = await fetch('http://localhost:3000/api/v1/posts', {
  //         method: 'POST',
  //         headers: {
  //             'Content-Type': 'application/json',
  //             'Authorization': `Bearer ${token}`
  //         },
  //         body: JSON.stringify({
  //             "content": post
  //         })
  //     })
  //     if(res.ok){
  //         console.log('successful')
  //     } else {
  //         console.log('failed')
  //     }
  // }

  export async function getPosts() {
    let token = localStorage.getItem("token");
  
    try {
      const res = await fetch('http://localhost:3000/api/v1/posts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
  
      if (!res.ok) {
        throw new Error('Failed to fetch posts');
      }
  
      const data = await res.json();
  
      console.log(data); // Log the data to check the structure and content
  
      // Select the posts-feed container
      const postsFeedContainer = document.querySelector(".posts-feed");
  
      // Clear existing posts
      postsFeedContainer.innerHTML = '';
  
      // Loop through each post data
      data.forEach(post => {
        // Create a new post element
        const postCard = createPostElement(post.postedBy, post.content, post.timestamp);
  
        // Append the new post element at the beginning of the posts-feed container
        postsFeedContainer.prepend(postCard);
        likePost('.feed-card .like-btn');
      });
  
    } catch (error) {
      console.error('Error occurred while fetching posts:', error);
    }
  }
  
  // Function to create post element
  const createPostElement = (username, postText, timestamp) => {
    const postDiv = document.createElement("div");
    postDiv.className = "feed-card";
    
  
    postDiv.innerHTML = `
      <div class="profile-photo">
        <img src="./images/profile-photo-1.png" alt="Profile Photo">
      </div>
      <div class="post-container">
        <div class="user">
          <h5>${username} <span class="handle muted">@OrbitUser</span></h5>
          <p class="primary">${timestamp}</p>
        </div>
        <div class="post-content">${postText}</div>
        <div class="like-btn">
          <input type="checkbox" />
          <div class="like-btn-content">
            <i class="ri-heart-line"></i>
            <label>Like Post</label>
          </div>
        </div>
      </div>
      <div class="post-logo">
        <i class="ri-chat-smile-2-line"></i>
      </div>
    `;
  
    return postDiv;
  };
  
  export async function fetchUserList() {
    let token = localStorage.getItem("token");
    const res = await fetch("http://localhost:3000/api/v1/users", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
    if(res.ok){
      const userList = await res.json();
      displayUserList(userList)
    }
  }
  
  async function displayUserList(users) {
    let token = localStorage.getItem("token");
    const followDiv = document.querySelector('.suggest-follows-card');
  
    const res = await fetch('http://localhost:3000/api/v1/posts', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await res.json();
    
    
    // Type Errors on new User! reason: no posts
    const userName = data[0].postedBy;
  
    users.forEach(user => {
      if (user !== userName) {
        const listItem = document.createElement("li");
        listItem.textContent = user;
  
        const followButton = document.createElement("button");
        followButton.textContent = "Follow";
        followButton.classList.add("follow-btn");
        followButton.setAttribute("data-username", user);
  
        listItem.appendChild(followButton);
        followDiv.appendChild(listItem);
        
        followButton.addEventListener('click', function () {
          const usernameToFollow = this.getAttribute('data-username');
          // Persistency Check here
          // if (usernameToFollow in followingList) {
          //   console.log(`Unfollow button clicked for ${usernameToFollow} by ${userName}`);
          //   unfollowUser(userName,usernameToFollow);
          //   followButton.getAttribute = "Follow";
          // }
          if (followButton.innerText === "Follow") {
            console.log(`Follow button clicked for ${usernameToFollow} by ${userName}`);
            followUser(userName,usernameToFollow);
            followButton.innerText = "Unfollow";
          } else {
            console.log(`Unfollow button clicked for ${usernameToFollow} by ${userName}`);
            unfollowUser(userName,usernameToFollow);
            followButton.innerText = "Follow";
          }
        });
      } else {
        console.log("username was segregated!")
      }
    });
  }
  
  async function followUser(user,following) { 
    let token = localStorage.getItem("token");
    const res = await fetch("http://localhost:3000/api/v1/users/"+user+"/following/"+following, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
  }
  
  async function unfollowUser(user,following) { 
    let token = localStorage.getItem("token");
    const res = await fetch("http://localhost:3000/api/v1/users/"+user+"/following/"+following, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
  }
  
  async function followCheck(user) {
    let token = localStorage.getItem("token");
    const res = await fetch("http://localhost:3000/api/v1/users/"+user+"/following/", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
    let followingList = [];
    const data = await res.json();
  }