(function () {
	'use strict';

	const mainTemplate = document.querySelector("#main-template");
	const elementToClone = mainTemplate.content.querySelector("#todo-item-template");

	const getCaseElement = (data, id) => {
		const element = elementToClone.cloneNode(true);
		element.querySelector('.todo-item__span').textContent = data;
		element.querySelector('.item-input-check').id = `itemCheck-${id}`;
		element.querySelector('.item-check-label').setAttribute('for', `itemCheck-${id}`);
		return element;
	};



	const Case = function(data, id, boolean = false, App){
		this.data = data;
		this.element = getCaseElement(this.data, id);

		this.state = boolean;

		this.checkElement = this.element.querySelector('.item-input-check');
		this.closeElement = this.element.querySelector('.todo-item__close');

		this.remove = () => {
			this.element.parentNode.removeChild(this.element);
			App.todoList = App.todoList.filter((el) => {
				return (el.element !== this.element);
			});
			App.changeLeftCase();
			App.writeLocalMemory();

		};

		this.changeState = (evt) => {
			if(evt.target.checked){
				this.state = true;
			}
			else {
				this.state = false;
			}
			App.changeLeftCase();
			App.changeStateFilter();
			App.writeLocalMemory();
		};
		

		this.spanElement = this.element.querySelector('.todo-item__span');

		/* редактирование case*/
		this.editingCase = (evt)=> {
			var input = this.element.parentNode.querySelector('.edit');
			this.element.classList.add("editing");
			if(input){
				input.parentNode.spanElement.innerHTML = input.value;
				input.parentNode.removeChild(input);
			}
			var newInput = document.createElement('input');
			newInput.className = 'edit';
			this.element.appendChild(newInput);
			newInput.value =  this.spanElement.innerHTML;
			newInput.focus();

			newInput.addEventListener("keyup", (evt) => {
				if(evt.key == "Enter"){
					this.spanElement.innerHTML = newInput.value;
					this.element.focus();
					App.todoList[id-1].data = this.spanElement.innerHTML; 	
					this.element.removeChild(newInput);
					this.element.classList.remove("editing");
					App.writeLocalMemory();
				}
			});

			newInput.addEventListener("blur", (evt) => {
				this.spanElement.innerHTML = newInput.value;
				App.todoList[id-1].data = this.spanElement.innerHTML; 
				newInput.className = 'hide';	
				App.writeLocalMemory();
				newInput.remove(document.querySelector(".hide"));
				this.element.classList.remove("editing");
			});
		};


		this.spanElement.addEventListener('dblclick', this. editingCase);
		this.closeElement.addEventListener('click', this.remove);
		this.checkElement.addEventListener('change', this.changeState);

	};



/* отрисовка todolist */
	const renderTodoList = (filterItems, pasteElement) => {		
		let container = document.createDocumentFragment();
		pasteElement.innerHTML = "";
		filterItems.forEach(function(item){
			item.checkElement.checked = item.state;
			container.appendChild(item.element);
		});
		pasteElement.appendChild(container);
	};



	const mainTemplate1 = document.querySelector("#main-template");
	const elementToClone1 = mainTemplate1.content.querySelector("#mainTodoapp");

	const getItemsElement = () => {
		const element = elementToClone1.cloneNode(true);
		return element;
	};



	const Items = function(){
		this.filter = "ALL";
		this.todoList = [];
		this.checkState = false;
		this.element = getItemsElement();

		this.writeInput = this.element.querySelector("#mainWriteInput");
		this.leftItem = this.element.querySelector('#leftItem');
		this.writeCheck = this.element.querySelector('#writeCheck');
		this.filtersWrap = this.element.querySelector(".todo-filters");
		this.writeLabel = this.element.querySelector(".write-check-label");
		

		this.append = (elemContainer) => {
			elemContainer.appendChild(this.element);
		};

		this.filtersWrap.addEventListener('click', (evt) => {
			if(evt.target.classList.contains('filter-btn')) {   //если класс filter-btn есть
				const btns = this.filtersWrap.querySelectorAll(".filter-btn");
				btns.forEach(function(el){
					el.classList.remove('active');
				});
				evt.target.classList.add('active');
				this.changeStateFilter(evt.target.id);
				this.writeLocalMemory();
			}

			if(evt.target.classList.contains('btn-clear-completed')){
				this.todoList = this.todoList.filter(function(element){
					return !element.state;
				});
				this.changeStateFilter();
				this.writeLocalMemory();
			}
		});

		this.writeCheck.addEventListener('change', () => { /*checkAll*/
				if(this.leftCase.length > 0){
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
			const newElement = new Case(data, this.todoList.length + 1, state, this);
			this.pushTodoList(newElement);
			return newElement;
		};


		this.writeInput.addEventListener("keyup", (evt) => {
			if(evt.key == "Enter"){
				const data = this.writeInput.value.trim();
				if(data){
					this.createChild(data);
					this.writeInput.value = null;
					this.changeLeftCase();
					this.changeStateFilter();
					this.writeLocalMemory();
				}
			}
		});

		this.changeLeftCase = () => {
			this.leftCase = this.todoList.filter(function(element){
				return !element.state;
			});

			this.leftItem.innerHTML = this.leftCase.length;
		};

		this.pushTodoList = (caseEl) => {
			this.todoList.push(caseEl);
		};
		/*отрисовка в пямять*/
		this.renderFromStorage = (storage, storageAppState) => {
			storage.forEach((item) => {
				this.createChild(item.data, item.state);
			});
			this.changeLeftCase();
			this.changeStateFilter(storageAppState);
			//this.writeLocalMemory();
		};
		this.btnFilter = this.element.querySelectorAll('.filter-btn');
		this.changeStateFilter = (filterParam) => {
			if(filterParam){
				this.filter = filterParam;
			}
			let newTodo;

			const todoItems = this.element.querySelector("#todoItems");

			switch (this.filter) {
				case 'ALL':
				renderTodoList(this.todoList, todoItems);
				break;
				case 'ACTIVE':
				newTodo = this.todoList.filter(function(element){
					return !element.state;
				});
				renderTodoList(newTodo, todoItems);
				break;
				case 'COMPLETED':
				newTodo = this.todoList.filter(function(element){
					return element.state;
				});
				renderTodoList(newTodo, todoItems);
				break;
			}
			this.btnFilter.forEach((item) => {

				if(item.id === `${this.filter}`) {
					item.classList.add('active');
				}
				else if(item.classList.contains('active')){
					item.classList.remove('active');
				}
			});
		};

		this.writeLocalMemory = () => {
			localStorage.setItem("todoList", JSON.stringify(this.todoList));
			localStorage.setItem("AppState", this.filter);
		};
	};



	const mainAppContainer = document.querySelector('.main-content');
	let App = new Items();
	App.append(mainAppContainer);

	const storage = JSON.parse(localStorage.getItem("todoList"));
	const storageAppState = localStorage.getItem("AppState");

	const initApp = () => {
		if(storage){
			App.renderFromStorage(storage, storageAppState);
			//App.changeStateFilter();
			App.changeLeftCase();
		}
		else {
			return false;
		}
	}
	initApp();

}());