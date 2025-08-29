// API URL
const BASE_URL = "https://posts-f268c-default-rtdb.firebaseio.com/title";

// Global posts array
let posts = [];

// Load and render posts (GET)
const loadPosts = async () => {
    try {
        const response = await axios.get(`${BASE_URL}.json`);
        const data = response.data;
        posts = [];
        if (data) {
            Object.keys(data).forEach(key => {
                const title = data[key];
                if (title !== null && title !== undefined) {
                    posts.push({
                        id: parseInt(key),
                        title
                    });
                }
            });
        }

        // Render UI
        const tableBody = document.getElementById('postsTableBody');
        if (!tableBody) return;
        tableBody.innerHTML = '';

        posts.forEach(post => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="action-column">
                    <button class="delete-btn" onclick="deletePost(${post.id})" title="Delete post">
                        🗑️
                    </button>
                    <button class="edit-btn" onclick="editPost(${post.id})" title="Edit post">
                        ✏️
                    </button>
                </td>
                <td>${post.id}</td>
                <td>${post.title}</td>
            `;
            tableBody.appendChild(row);
        });

        if (posts.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td colspan="3" style="text-align: center; color: #888;">
                    No posts available. Click "Add New Post" to create one.
                </td>
            `;
            tableBody.appendChild(row);
        }
    } catch (error) {
        console.error('Error loading posts:', error);
        alert('Error loading posts from Firebase');
    }
};

// Save new post (PUT)
const savePost = async () => {
    const postId = document.getElementById('postId');
    const postTitle = document.getElementById('postTitle');

    if (!postId.value.trim() || !postTitle.value.trim()) {
        alert('Please fill in both ID and Title fields');
        return;
    }

    const id = parseInt(postId.value);
    const title = postTitle.value.trim();

    if (posts.find(post => post.id === id)) {
        alert('Post with this ID already exists!');
        return;
    }
    
    try {
        await axios.put(`${BASE_URL}/${id}.json`, JSON.stringify(title));
        postId.value = '';
        postTitle.value = '';
        alert(`Post saved successfully with ID: ${id}!`);
        window.location.href = 'viewPost.html';
    } catch (error) {
        console.error('Error saving post:', error);
        alert('Error saving post. Please try again.');
    }
};

// Delete post (DELETE)
const deletePost = async (postId) => {
    if (!confirm(`Are you sure you want to delete post with ID ${postId}?`)) return;
    try {
        await axios.delete(`${BASE_URL}/${postId}.json`);
        alert(`Post with ID ${postId} deleted successfully!`);
        loadPosts();
    } catch (error) {
        console.error('Error deleting post:', error);
        alert('Error deleting post. Please try again.');
    }
};

// Edit/Update post title (PUT)
const editPost = async (postId) => {
    const post = posts.find(p => p.id === postId);
    if (!post) {
        alert('Post not found!');
        return;
    }
    const newTitle = prompt('Edit post title:', post.title);
    if (newTitle === null || newTitle.trim() === '') return;
    try {
        await axios.put(`${BASE_URL}/${postId}.json`, JSON.stringify(newTitle.trim()));
        alert('Post updated successfully!');
        loadPosts();
    } catch (error) {
        console.error('Error updating post:', error);
        alert('Error updating post. Please try again.');
    }
};

// Navigation
const goToCreatePost = () => window.location.href = 'createPost.html';
const goToViewPost = () => window.location.href = 'viewPost.html';

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadPosts);


// Expose functions for onclick
window.savePost = savePost;
window.deletePost = deletePost;
window.editPost = editPost;
window.goToCreatePost = goToCreatePost;
window.goToViewPost = goToViewPost;