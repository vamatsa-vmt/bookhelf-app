// Memuat data buku dari localStorage jika ada
const loadBooksFromStorage = () => {
  const books = localStorage.getItem("books");
  return books ? JSON.parse(books) : [];
};

// Menyimpan data buku ke localStorage
const saveBooksToStorage = (books) => {
  localStorage.setItem("books", JSON.stringify(books));
};

// Menambahkan buku baru
const addBook = (event) => {
  event.preventDefault();

  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = document.getElementById("bookFormYear").value;
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  if (!title || !author || !year) return;

  const newBook = {
    id: new Date().getTime(),
    title,
    author,
    year: parseInt(year, 10),
    isComplete,
  };

  const books = loadBooksFromStorage();
  books.push(newBook);
  saveBooksToStorage(books);
  renderBooks();
  document.getElementById("bookForm").reset();
};

// Menghapus buku
const deleteBook = (bookId) => {
  const books = loadBooksFromStorage().filter((book) => book.id !== bookId);
  saveBooksToStorage(books);
  renderBooks();
};

// Memindahkan buku antar rak
const toggleBookCompletion = (bookId) => {
  const books = loadBooksFromStorage();
  const book = books.find((book) => book.id === bookId);
  if (book) {
    book.isComplete = !book.isComplete;
    saveBooksToStorage(books);
    renderBooks();
  }
};

// Mengedit buku
const editBook = (bookId) => {
  const books = loadBooksFromStorage();
  const book = books.find((book) => book.id === bookId);

  if (book) {
    document.getElementById("bookFormTitle").value = book.title;
    document.getElementById("bookFormAuthor").value = book.author;
    document.getElementById("bookFormYear").value = book.year;
    document.getElementById("bookFormIsComplete").checked = book.isComplete;

    // Menyembunyikan tombol "Tambah" dan menggantinya dengan tombol "Update"
    const submitButton = document.getElementById("bookFormSubmit");
    submitButton.textContent = "Update Buku";

    // Menambahkan event listener untuk update buku
    submitButton.removeEventListener("click", addBook);
    submitButton.addEventListener("click", (event) =>
      updateBook(event, bookId)
    );
  }
};

// Memperbarui buku
const updateBook = (event, bookId) => {
  event.preventDefault();

  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = document.getElementById("bookFormYear").value;
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  if (!title || !author || !year) return;

  const books = loadBooksFromStorage();
  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex !== -1) {
    books[bookIndex] = {
      id: bookId,
      title,
      author,
      year: parseInt(year, 10),
      isComplete,
    };
    saveBooksToStorage(books);
    renderBooks();
    document.getElementById("bookForm").reset();

    // Mengubah kembali tombol "Update" menjadi "Tambah"
    const submitButton = document.getElementById("bookFormSubmit");
    submitButton.textContent = "Masukkan Buku ke rak belum selesai dibaca";

    // Menghapus event listener "Update" dan mengganti ke "Tambah"
    submitButton.removeEventListener("click", (event) =>
      updateBook(event, bookId)
    );
    submitButton.addEventListener("click", addBook);
  }
};

// Menampilkan buku pada rak yang sesuai
const renderBooks = () => {
  const incompleteBooksSection = document.getElementById("incompleteBookList");
  const completeBooksSection = document.getElementById("completeBookList");
  const books = loadBooksFromStorage();

  incompleteBooksSection.innerHTML = "";
  completeBooksSection.innerHTML = "";

  books.forEach((book) => {
    const bookElement = document.createElement("div");
    bookElement.classList.add("book-item");
    bookElement.setAttribute("data-bookid", book.id);
    bookElement.setAttribute("data-testid", "bookItem");

    bookElement.innerHTML = `
          <h3 data-testid="bookItemTitle">${book.title}</h3>
          <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
          <p data-testid="bookItemYear">Tahun: ${book.year}</p>
          <div>
            <button data-testid="bookItemIsCompleteButton" onclick="toggleBookCompletion(${
              book.id
            })">
              ${book.isComplete ? "Selesai dibaca" : "Belum selesai dibaca"}
            </button>
            <button data-testid="bookItemEditButton" onclick="editBook(${
              book.id
            })">Edit buku</button>
            <button data-testid="bookItemDeleteButton" onclick="deleteBook(${
              book.id
            })">Hapus buku</button>
          </div>
        `;

    if (book.isComplete) {
      completeBooksSection.appendChild(bookElement);
    } else {
      incompleteBooksSection.appendChild(bookElement);
    }
  });
};

// Mencari buku berdasarkan judul
const searchBooks = (event) => {
  event.preventDefault();

  const searchQuery = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();
  const books = loadBooksFromStorage();

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery)
  );

  const incompleteBooksSection = document.getElementById("incompleteBookList");
  const completeBooksSection = document.getElementById("completeBookList");

  incompleteBooksSection.innerHTML = "";
  completeBooksSection.innerHTML = "";

  filteredBooks.forEach((book) => {
    const bookElement = document.createElement("div");
    bookElement.classList.add("book-item");
    bookElement.setAttribute("data-bookid", book.id);
    bookElement.setAttribute("data-testid", "bookItem");

    bookElement.innerHTML = `
          <h3 data-testid="bookItemTitle">${book.title}</h3>
          <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
          <p data-testid="bookItemYear">Tahun: ${book.year}</p>
          <div>
            <button data-testid="bookItemIsCompleteButton" onclick="toggleBookCompletion(${
              book.id
            })">
              ${book.isComplete ? "Selesai dibaca" : "Belum selesai dibaca"}
            </button>
            <button data-testid="bookItemDeleteButton" onclick="deleteBook(${
              book.id
            })">Hapus buku</button>
          </div>
        `;

    if (book.isComplete) {
      completeBooksSection.appendChild(bookElement);
    } else {
      incompleteBooksSection.appendChild(bookElement);
    }
  });
};

const init = () => {
  document.getElementById("bookForm").addEventListener("submit", addBook);
  document.getElementById("searchBook").addEventListener("submit", searchBooks);
  renderBooks();
};
window.onload = init;
