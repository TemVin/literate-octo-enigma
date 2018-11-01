	const mainTemplate = document.querySelector('#main-template');
	const cloneTodoItem = mainTemplate.content.querySelector('#todo-item-template');

	const getCaseElement = (data,id) => {
		const element = cloneTodoItem.cloneNode(true);
		element.querySelector('.js-todo-item__span').textContent = data;
		element.querySelector('.js-item-input-check').id = `itemCheck-${id}`;
		element.querySelector('.js-item-check-label').setAttribute('for', `itemCheck-${id}`);	
		return element;
	};

	export default getCaseElement;