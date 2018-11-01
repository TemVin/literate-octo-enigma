	import Items from './items';
	
	const mainAppContainer = document.querySelector('.js-main-content');
	let App = new Items();
	App.append(mainAppContainer);

	const storage = JSON.parse(localStorage.getItem('todoList'));
	const storageAppState = localStorage.getItem('AppState');
	const initApp = () => {
		if (storage) {
			App.renderFromStorage(storage, storageAppState);
			App.changeLeftCase();
		}
		else {
			return false;
		}
	}
	initApp();