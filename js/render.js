const renderTodoList = (filterItems, pasteElement) => {		
	let container = document.createDocumentFragment();
	pasteElement.innerHTML = '';
	filterItems.forEach(function(item) {
		item.checkElement.checked = item.state;
		container.appendChild(item.element);
	});
	pasteElement.appendChild(container);
};


export default renderTodoList;
