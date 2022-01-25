"use strict"

let newTodo = document.querySelector('.todo__input');
let todosList = document.querySelector('.todos-list');
let storage = JSON.parse(localStorage.getItem('todos-list')) || [];
let todoCount = document.querySelector('.todo-count__number');


// CREATE NEW ELEMENT
function createNewElement () {
        let listItem = document.createElement('li');
        listItem.className = "todos__item";

        let listItemCheckbox = document.createElement('input');
        listItemCheckbox.className = "todos__toggle";
        listItemCheckbox.setAttribute("type", "checkbox");
        listItem.append(listItemCheckbox)

        let listItemTitle = document.createElement('p');
        listItemTitle.className = "todos__title";
        listItemTitle.textContent = newTodo.value;
        listItem.append(listItemTitle);

        let listItemDelete = document.createElement('button');
        listItemDelete.className = "todos__delete";
        listItemDelete.innerHTML = '&#215;'
        listItem.append(listItemDelete);

        todosList.append(listItem)
}


// SORT TODOS DEPENDING SORT TYPE
function sortTasks(sortType, callback) {
        if(sortType == 'active') {
                sortType = false
        } else if(sortType == 'completed') {
                sortType = true
        }
                
        let allTasks = document.querySelectorAll('.todos__item')
        let activeTasks = [];
        allTasks.forEach(element => {
        if(element.querySelector('.todos__toggle').checked === sortType) {
                // activeTasks.push(element) 
                callback(element, activeTasks)
                }
        });
        
        return activeTasks
}


//CHANGE TODO COUNT
function changeTodoCount(){

        function collectElements(element, collector){
                collector.push(element) 
        }
       
        let activeTasks = sortTasks('active', collectElements);

        todoCount.textContent = activeTasks.length;

        let todoCountName = document.querySelector('.todo-count__name')
        if(activeTasks.length > 1) {
                todoCountName.textContent = 'items'
        } else{
                todoCountName.textContent = 'item'
        }
}


// EVENT ADD TODO ITEM
newTodo.addEventListener('keydown', function(event){
	if (event.keyCode === 13 && newTodo.value.trim() ) {

        let todoTask = {title: newTodo.value, completed : false}

        storage.push(todoTask)

        localStorage.setItem('todos-list', JSON.stringify(storage))

        createNewElement ();
        changeTodoCount()

        newTodo.value = '';


	}  
});


// EVENT DELETE TODO ITEM
todosList.addEventListener('click', event => {
        if( event.target.className == "todos__delete"){
                event.target.closest('.todos__item').remove()
        }
        changeTodoCount()
       
})

// INDICATE CHOSEN SORT BUTTON
let sortBtns = document.querySelector('.sort-btns');
sortBtns.addEventListener('click', event => {
        let allSortBtns = sortBtns.querySelectorAll('li');
        allSortBtns.forEach(item => {
                item.classList.remove("selected")
        })
        console.log(event.target)
        event.target.closest('li').classList.add("selected")
})


// SORT TODO LIST, LEFT ACTIVE TASKS
let sortActiveBtn = document.querySelector('.sort-btns .active') 
sortActiveBtn.addEventListener('click', event => {
        sortAllBtn.click()

        function hideCheckedItems(element, collector){
                element.classList.add('hide')
        }

        sortTasks('completed', hideCheckedItems);
})


// SORT TODO LIST, LEFT COMPLETED TASKS
let sortCompletedBtn = document.querySelector('.sort-btns .completed') 
sortCompletedBtn.addEventListener('click', event => {
        sortAllBtn.click()

        function hideActiveItems(element, collector){
                element.classList.add('hide')
        }
        
        sortTasks('active', hideActiveItems);
})


// SORT TODO LIST, LEFT ALL TASKS
let sortAllBtn = document.querySelector('.sort-btns .all') 
sortAllBtn.addEventListener('click', event => {
        let allTasks = document.querySelectorAll('.todos__item')
        allTasks.forEach(element => {
                element.classList.remove('hide')
        })
})



