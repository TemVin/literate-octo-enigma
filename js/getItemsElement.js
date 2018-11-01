	const mainTemplate = document.querySelector('#main-template');
	const cloneTodoApp = mainTemplate.content.querySelector('#mainTodoapp');

	const getItemsElement = () => {
		const element = cloneTodoApp.cloneNode(true);
		return element;
	};

export default getItemsElement;