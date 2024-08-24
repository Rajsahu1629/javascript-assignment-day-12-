const booksUrl = "https://library-management-cacdc-default-rtdb.firebaseio.com/books.json";
const membersUrl = "https://library-management-cacdc-default-rtdb.firebaseio.com/members.json";

async function fetchBooks() {
    const response = await fetch(booksUrl);
    const books = await response.json();    
    return Object.keys(books).map(key => ({ id: key, ...books[key] }));
}

async function fetchMembers() {
    const response = await fetch(membersUrl);
    const members = await response.json();
    
    return Object.keys(members).map(key => ({ id: key, ...members[key] }));
}

async function addBook(book) {
    let tempbooks = await fetchBooks()
    await fetch(`https://library-management-cacdc-default-rtdb.firebaseio.com/books/${tempbooks.length}.json`, {
        method: 'PUT',
        body: JSON.stringify(book),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    loadBooks();
}

async function updateBook(id, updatedBook) {
    await fetch(`https://library-management-cacdc-default-rtdb.firebaseio.com/books/${id}.json`, {
        method: 'PUT',
        body: JSON.stringify(updatedBook),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    loadBooks();
}

async function deleteBook(id) {
    await fetch(`https://library-management-cacdc-default-rtdb.firebaseio.com/books/${id}.json`, {
        method: 'DELETE',
    });
    loadBooks();
}

async function addMember(member) {
    let tempmember = await fetchMembers()
    await fetch(`https://library-management-cacdc-default-rtdb.firebaseio.com/members/${tempmember.length}.json`, {
        method: 'PUT',
        body: JSON.stringify(member),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    loadMembers();
}

async function updateMember(id, updatedMember) {
    await fetch(`https://library-management-cacdc-default-rtdb.firebaseio.com/members/${id}.json`, {
        method: 'PUT',
        body: JSON.stringify(updatedMember),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    loadMembers();
}

async function deleteMember(id) {
    await fetch(`https://library-management-cacdc-default-rtdb.firebaseio.com/members/${id}.json`, {
        method: 'DELETE',
    });
    loadMembers();
}

function loadBooks() {
    fetchBooks().then(books => {
        const bookList = document.getElementById('book-list');
        bookList.innerHTML = books.map(book => `
            <div>
                <h3>${book.title}</h3>
                <p>${book.author} - ${book.genre} (${book.publishedYear})</p>
                <p>Available: ${book.available ? 'Yes' : 'No'}</p>
                <button onclick="editBook('${book.id}')">Edit</button>
                <button onclick="deleteBook('${book.id}')">Delete</button>
            </div>
        `).join('');
    });
}

function loadMembers() {
    fetchMembers().then(members => {
        const memberList = document.getElementById('member-list');
        memberList.innerHTML = members.map(member => `
            <div>
                <h3>${member.name}</h3>
                <p>Joined: ${new Date(member.membershipDate).toLocaleDateString()}</p>
                <p>Active: ${member.active ? 'Yes' : 'No'}</p>
                <button onclick="editMember('${member.id}')">Edit</button>
                <button onclick="deleteMember('${member.id}')">Delete</button>
            </div>
        `).join('');
    });
}

document.getElementById('book-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const id = document.getElementById('book-id').value;
    const book = {
        title: document.getElementById('book-title').value,
        author: document.getElementById('book-author').value,
        genre: document.getElementById('book-genre').value,
        publishedYear: parseInt(document.getElementById('book-year').value),
        available: document.getElementById('book-available').checked,
    };
    if (id) {
        updateBook(id, book);
    } else {
        addBook(book);
    }
    document.getElementById('book-form').reset();
});

document.getElementById('member-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const id = document.getElementById('member-id').value;
    const member = {
        name: document.getElementById('member-name').value,
        membershipDate: document.getElementById('member-date').value,
        active: document.getElementById('member-active').checked,
    };
    if (id) {
        updateMember(id, member);
    } else {
        addMember(member);
    }
    document.getElementById('member-form').reset();
});

function editBook(id) {
    fetchBooks().then(books => {
        const book = books.find(b => b.id === id);
        document.getElementById('book-id').value = book.id;
        document.getElementById('book-title').value = book.title;
        document.getElementById('book-author').value = book.author;
        document.getElementById('book-genre').value = book.genre;
        document.getElementById('book-year').value = book.publishedYear;
        document.getElementById('book-available').checked = book.available;
    });
}

function editMember(id) {
    fetchMembers().then(members => {
        const member = members.find(m => m.id === id);
        document.getElementById('member-id').value = member.id;
        document.getElementById('member-name').value = member.name;
        document.getElementById('member-date').value = member.membershipDate;
        document.getElementById('member-active').checked = member.active;
    });
}

// Load initial data
loadBooks();
loadMembers();
