import getCaseElement from './getCaseElement';
import renderTodoList from './render';


const Case = function(data, id, boolean = false, App){
	this.data = data;
	this.id = id;
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

	this.getIndexById = () =>{
		let ind;
		for (var i = 0; i < App.todoList.length; i++){
			if (App.todoList[i].id == id){
				ind = i;
				break;
			}
		}
		return ind;
	}

	this.editingCase = (evt) => {

		this.element.classList.add('editing');

		var newInput = document.createElement('input');
		newInput.classList.add('edit');
		this.element.appendChild(newInput);
		newInput.value =  this.spanElement.innerHTML;
		newInput.focus();

		newInput.addEventListener('keyup', (evt) => {
			if (evt.key == 'Enter'){
				const data = newInput.value.trim();
				let ind = this.getIndexById();
				if(data){	
					this.element.focus();
					App.todoList[ind].data = data;
					this.spanElement.innerHTML = data; 
				}
				else {
					App.todoList[ind].remove();
				}
				App.writeLocalMemory();	
				newInput.remove(document.querySelector('.edit'));		
				this.element.classList.remove('editing');			
			}
		});

		newInput.addEventListener('blur', (evt) => {
			const data = newInput.value.trim();
			let ind = this.getIndexById();
			if(data){
				App.todoList[ind].data = data; 
				this.spanElement.innerHTML = data;
			}
			else{
				App.todoList[ind].remove();
			}
			App.writeLocalMemory();
			newInput.remove(document.querySelector('.edit'));
			this.element.classList.remove('editing');
		});
	};


	this.spanElement.addEventListener('dblclick', this.editingCase);
	this.closeElement.addEventListener('click', this.remove);
	this.checkElement.addEventListener('change', this.changeState);

};

export default Case;