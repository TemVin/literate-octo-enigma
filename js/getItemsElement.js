	const mainTemplate1 = document.querySelector('#main-template');
	const elementToClone1 = mainTemplate1.content.querySelector('#mainTodoapp');

	const getItemsElement = () => {
		const element = elementToClone1.cloneNode(true);
		return element;
	};


export default getItemsElement;