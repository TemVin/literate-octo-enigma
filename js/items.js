import Case from './case';
import renderTodoList from './render';
import getItemsElement from './getItemsElement';

const Items = function() {
	this.filter = 'ALL';
	this.todoList = [];
	this.checkState = false;
	this.element = getItemsElement();

	this.writeInput = this.element.querySelector('#mainWriteInput');
	this.leftItem = this.element.querySelector('#leftItem');
	this.writeCheck = this.element.querySelector('#writeCheck');
	this.filtersWrap = this.element.querySelector('.js-todo-filters');
	this.writeLabel = this.element.querySelector('.js-write-check-label');

	this.append = (elemContainer) => {
		elemContainer.appendChild(this.element);
	};

	this.filtersWrap.addEventListener('click', (evt) => {
		if (evt.target.classList.contains('js-filter-btn')) {  
			const btns = this.filtersWrap.querySelectorAll('.js-filter-btn');
			btns.forEach(function(el) {
				el.classList.remove('active');
			});
			evt.target.classList.add('active');
			this.changeStateFilter(evt.target.id);
			this.writeLocalMemory();
		}

		if (evt.target.classList.contains('js-btn-clear-completed')) {
			this.todoList = this.todoList.filter(function(element) {
				return !element.state;
			});
			this.changeStateFilter();
			this.writeLocalMemory();
		}
	});

	this.writeCheck.addEventListener('change', () => {
		if (this.leftCase.length > 0) {
			this.todoList.forEach((item) => {
				item.checkElement.checked = true;
				item.state = true;
			});
			this.checkState = true;
			this.changeLeftCase();
		}
		else {
			this.todoList.forEach((item) => {
				item.checkElement.checked = false;
				item.state = false;
			});
			this.checkState = false;
			this.changeLeftCase();
		}
		this.changeStateFilter()
		this.writeLocalMemory();
	});

	this.createChild = (data, state = false) => {
		
		const id = (this.todoList.length == 0) ? 1 : Number(this.todoList[this.todoList.length - 1].id) + 1;
		const newElement = new Case(data, id, state, this);
		this.pushTodoList(newElement);
		return newElement;
	};


	this.writeInput.addEventListener('keyup', (evt) => {
		if (evt.key == 'Enter') {
			const data = this.writeInput.value.trim();
			if (data) {
				this.createChild(data);
				this.writeInput.value = null;
				this.changeLeftCase();
				this.changeStateFilter();
				this.writeLocalMemory();
			}
		}
	});

	this.changeLeftCase = () => {
		this.leftCase = this.todoList.filter(function(element) {
			return !element.state;
		});

		this.leftItem.innerHTML = this.leftCase.length;
	};

	this.pushTodoList = (caseEl) => {
		this.todoList.push(caseEl);
	};

	this.renderFromStorage = (storage, storageAppState) => {
		storage.forEach((item) => {
			this.createChild(item.data, item.state);
		});
		this.changeLeftCase();
		this.changeStateFilter(storageAppState);
	};

	this.btnFilter = this.element.querySelectorAll('.js-filter-btn');
	this.changeStateFilter = (filterParam) => {
		if (filterParam) {
			this.filter = filterParam;
		}
		let newTodo;

		const todoItems = this.element.querySelector('#todoItems');

		switch (this.filter) {
			case 'ALL':
				renderTodoList(this.todoList, todoItems);
				break;
			case 'ACTIVE':
				newTodo = this.todoList.filter(function(element) {
					return !element.state;
				});
				renderTodoList(newTodo, todoItems);
				break;
			case 'COMPLETED':
				newTodo = this.todoList.filter(function(element) {
					return element.state;
				});
				renderTodoList(newTodo, todoItems);
				break;
		}

		this.btnFilter.forEach((item) => {
			if (item.id === `${this.filter}`) {
				item.classList.add('active');
			}
			else if (item.classList.contains('active')) {
				item.classList.remove('active');
			}
		});
	};

	this.writeLocalMemory = () => {
		localStorage.setItem('todoList', JSON.stringify(this.todoList));
		localStorage.setItem('AppState', this.filter);
	};
};

export default Items;