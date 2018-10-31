	const mainTemplate = document.querySelector('#main-template');
	const elementToClone = mainTemplate.content.querySelector('#todo-item-template');

	const getCaseElement = (data,id) => {
		const element = elementToClone.cloneNode(true);
		element.querySelector('.todo-item__span').textContent = data;
		element.querySelector('.item-input-check').id = `itemCheck-${id}`;
		element.querySelector('.item-check-label').setAttribute('for', `itemCheck-${id}`);	
		return element;
	};

	export default getCaseElement;