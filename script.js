"use strict"

let newTodo = document.querySelector('.todo__input');




newTodo.addEventListener('keydown', function(event){
	if (event.keyCode === 13 ) {
        let storage = []

        let todoTask = {title: newTodo.value, completed : false}

        storage = JSON.parse(localStorage.getItem('todos-list')) || []
        // console.log(storage)

        storage.push(todoTask)

        localStorage.setItem('todos-list', JSON.stringify(storage))

        newTodo.value = '';
	}
});


let todosList = document.querySelector('.todos-list')