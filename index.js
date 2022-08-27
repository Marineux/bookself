const judulInput = document.getElementById('judul');
const penulisInput = document.getElementById('penulis');
const tahunInput = document.getElementById('tahun');
const todoButton = document.querySelector('.todo-btn');
const todoList = document.querySelector('.todo-list');
const filterOption = document.querySelector('.filter-todo');
const searchBooks = document.getElementById('searchbox');

const todos = [];
const RenderApps = 'render-todo';
const SaveEvent = 'saved-todo';
const StorageKey = 'BOOKS-SELF';

filterOption.addEventListener('click', filterBook);
searchBooks.addEventListener('input', liveSearch);
searchBooks.addEventListener('keyup', () => {
	let typeTimer;
	let typeInterval = 500;
	clearTimeout(typeTimer);
	typeInterval = setTimeout(liveSearch, typeInterval);
});

document.addEventListener('DOMContentLoaded', () => {
	const submitForm = document.querySelector('form');
	submitForm.addEventListener('submit', (e) => {
		e.preventDefault();
		prepareBook();
	});
});

document.addEventListener(RenderApps, () => {
	const uncompletedBooksSelf = todoList;
	uncompletedBooksSelf.innerHTML = '';

	todos.forEach((todo) => {
		const todoElement = makeBook(todo);
		uncompletedBooksSelf.appendChild(todoElement);
	});
});

const generatedId = () => {
	return +new Date();
};

const generateTodoObj = (id, judul, penulis, tahun, completed) => {
	return {
		id,
		judul,
		penulis,
		tahun,
		isCompleted: completed,
	};
};

const prepareBook = () => {
	const judul = judulInput.value;
	const penulis = penulisInput.value;
	const tahun = tahunInput.value;

	const generatedID = generatedId();
	const todoObj = generateTodoObj(generatedID, judul, penulis, tahun, false);
	todos.push(todoObj);

	document.dispatchEvent(new Event(RenderApps));
	saveData();
};

const makeBook = (todoObj) => {
	const container = document.createElement('div');
	container.classList.add('todo');

	container.innerHTML = `
       <div class="todo-item">
        <h2 class="judul">${todoObj.judul}</h2>
        <p>${todoObj.penulis}</p>
        <p>${todoObj.tahun}</p>
      </div>
      `;

	if (todoObj.isCompleted) {
		const undoBtn = document.createElement('button');
		container.classList.add('completed');
		undoBtn.classList.add('undo-btn');

		undoBtn.addEventListener('click', () => {
			backBook(todoObj.id);
		});

		const trashBtn = document.createElement('button');
		trashBtn.classList.add('trash-btn');

		trashBtn.addEventListener('click', () => {
			if (confirm('Are you sure want to delete this book?')) {
				DeleteBook(todoObj.id);
			}
		});

		const editBtn = document.createElement('button');
		editBtn.classList.add('edit-btn');
		editBtn.addEventListener('click', () => {
			editBook(todoObj.id);
		});

		const containerBtn = document.createElement('div');
		containerBtn.classList.add('container-btn');
		containerBtn.appendChild(undoBtn);
		containerBtn.appendChild(trashBtn);
		containerBtn.appendChild(editBtn);

		container.appendChild(containerBtn);
	} else {
		const completeBtn = document.createElement('button');
		completeBtn.classList.add('fa-solid', 'fa-check', 'remove');

		const trashBtn = document.createElement('button');
		trashBtn.classList.add('trash-btn');

		trashBtn.addEventListener('click', () => {
			if (confirm('Are you sure want to delete this book?')) {
				DeleteBook(todoObj.id);
			}
		});

		completeBtn.addEventListener('click', () => {
			Completed(todoObj.id);
		});

		const editBtn = document.createElement('button');
		editBtn.classList.add('edit-btn');
		editBtn.addEventListener('click', () => {
			editBook(todoObj.id);
		});

		const containerBtn = document.createElement('div');
		containerBtn.classList.add('container-btn');
		containerBtn.appendChild(completeBtn);
		containerBtn.appendChild(trashBtn);
		containerBtn.appendChild(editBtn);

		container.appendChild(containerBtn);
	}

	return container;
};

const editBook = (todoId) => {
	const todo = todos.find((todo) => todo.id === todoId);
	judulInput.value = todo.judul;
	penulisInput.value = todo.penulis;
	tahunInput.value = todo.tahun;
	todoButton.innerHTML = 'Edit';

	todoButton.addEventListener('click', (e) => {
		e.preventDefault();
		updateBook(todoId);
		todoButton.innerHTML = 'Masukan';
		location.reload();
	});
};

const updateBook = (todoId) => {
	const todoTarget = findBook(todoId);

	if (todoTarget == null) return;

	todoTarget.judul = judulInput.value;
	todoTarget.penulis = penulisInput.value;
	todoTarget.tahun = tahunInput.value;

	document.dispatchEvent(new Event(RenderApps));
	saveData();

	todoTarget.judul = '';
	todoTarget.penulis = '';
	todoTarget.tahun = '';
};

const Completed = (todoId) => {
	const todoTarget = findBook(todoId);

	if (todoTarget == null) return;

	todoTarget.isCompleted = true;

	document.dispatchEvent(new Event(RenderApps));
	saveData();
};

const findIndex = (todoId) => {
	for (const index in todos) {
		if (todos[index].id === todoId) {
			return index;
		}
	}

	return -1;
};

const DeleteBook = (todoId) => {
	const todoTarget = findIndex(todoId);

	if (todoTarget === -1) return;

	todos.splice(todoTarget, 1);
	document.dispatchEvent(new Event(RenderApps));
	saveData();
};

const backBook = (todoId) => {
	const todoTarget = findBook(todoId);

	if (todoTarget === null) return;

	todoTarget.isCompleted = false;
	document.dispatchEvent(new Event(RenderApps));
	document.dispatchEvent(new Event(RenderApps));
	saveData();
};

const findBook = (todoId) => {
	for (const todoItem of todos) {
		if (todoItem.id === todoId) {
			return todoItem;
		}
	}
	return null;
};

function filterBook(e) {
	const todos = todoList.childNodes;
	todos.forEach((todo) => {
		switch (e.target.value) {
			case 'all':
				todo.style.display = 'flex';
				break;
			case 'completed':
				todo.style.display = todo.classList.contains('completed') ? 'flex' : 'none';
				break;
			case 'uncompleted':
				todo.style.display = todo.classList.contains('completed') ? 'none' : 'flex';
				break;
		}
	});
}

function liveSearch() {
	let books = document.querySelectorAll('.todo');
	let searchKey = searchBooks.value;

	books.forEach((book) => {
		if (book.innerHTML.toLocaleLowerCase().includes(searchKey.toLocaleLowerCase())) {
			book.style.cssText = `
			position: relative;
			opacity: 1;
			transform: translateY(0);
			visibility: visible;
			transition: all 400ms ease;
			`;
		} else {
			book.style.cssText = `
			position: absolute;
			opacity: 0;
			transform: translateY(100%);
			visibility: hidden;
			transition: all 400ms ease;
			`;
		}
	});
}

const checkLocalStorage = () => {
	if (typeof Storage === undefined) {
		alert('Browser tidak mendukung local storage');
		return false;
	}
	return true;
};

const saveData = () => {
	if (checkLocalStorage()) {
		const parsed = JSON.stringify(todos);
		localStorage.setItem(StorageKey, parsed);
		document.dispatchEvent(new Event(SaveEvent));
	}
};

const loadData = () => {
	const serializedData = localStorage.getItem(StorageKey);
	let data = JSON.parse(serializedData);

	if (data !== null) {
		for (const todo of data) {
			todos.push(todo);
		}
	}
	document.dispatchEvent(new Event(RenderApps));
};

document.addEventListener('DOMContentLoaded', () => {
	if (checkLocalStorage()) loadData();
});
