const watchlist = [];
const RENDER_EVENT = "render-watchlist";
const STORAGE_KEY = 'watchlist_storage';

function isStorageExist() {
    if(typeof(Storage) === undefined) {
        alert('Gk bisa nih, Browser kamu gk support local storage');
        return false;
    }

    return true;
}

function generateId() {
    return +new Date();
}

function generateWatchObject(id, title, episode, timestamp, isWatched) {
    return {
        id,
        title,
        episode,
        timestamp,
        isWatched
    }
}

function findWatchItem(itemId) {
    for(let watchItem of watchlist) {
        if(watchItem.id === itemId) {
            return watchItem;
        }
    }
}
function findWatchItemIndex(itemId) {
    for(index in watchlist){
        if(watchlist[index].id === itemId){
            return index
        }
    }
    return -1
}

function makeWatchlist(watchObject) {

    const {id, title, episode, timestamp, isWatched} = watchObject;

    const textTitle = document.createElement("h2");
    textTitle.innerText = title;

    const textEpisode = document.createElement("p");
    textEpisode.innerText = `Episode: ${episode}`;

    // const textTimestamp = document.createElement("p");
    // textTimestamp.innerText = new Date() - timestamp;

    const textContainer = document.createElement("div");
    textContainer.classList.add("inner")
    textContainer.append(textTitle, textEpisode/*, textTimestamp*/);

    const container = document.createElement("div");
    container.classList.add("item", "shadow")
    container.append(textContainer);
    container.setAttribute("id", `watchlist-${id}`);
    
    if(isWatched){

        const undoButton = document.createElement("button");
        undoButton.classList.add("undo-button");
        undoButton.addEventListener("click", function () {
            undoCompletedWatch(id);
        });

        const trashButton = document.createElement("button");
        trashButton.classList.add("trash-button");
        trashButton.addEventListener("click", function () {
            removeWatchItem(id);
        });

        container.append(undoButton, trashButton);
    } else {

        const checkButton = document.createElement("button");
        checkButton.classList.add("check-button");
        checkButton.addEventListener("click", function () {
            addToCompletedWatchlist(id);
        });

        container.append(checkButton);
    }

    return container;
}

function addWatchList() {
    const tittle = document.getElementById("title").value;
    const episode = document.getElementById("episode").value;
    const timestamp = new Date();

    const generatedID = generateId();
    const watchObject = generateWatchObject(generatedID, tittle, episode, timestamp, false)
    watchlist.push(watchObject)
    
    document.dispatchEvent(new Event(RENDER_EVENT))

    // close form
    var showFormButton = document.querySelector('.show-input-form');
    var inputFormContainer = document.getElementById('add-todo');
    
    showFormButton.hidden = false;
    inputFormContainer.hidden = true;

    // saveData();
}

function addToCompletedWatchlist(watchItemId) {

    const watchItemTarget = findWatchItem(watchItemId);
    if(watchItemTarget == null) return;

    watchItemTarget.isWatched = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    // saveData();
}

function removeWatchItem(wathItemId) {
    const watchItemTarget = findWatchItemIndex(wathItemId);
    if(watchItemTarget === -1) return;
    watchlist.splice(watchItemTarget, 1);
    
    document.dispatchEvent(new Event(RENDER_EVENT));
    // saveData();
}

function undoCompletedWatch(watchItemId){

    const watchItemTarget = findWatchItem(watchItemId);
    if(watchItemTarget == null) return;

    watchItemTarget.isWatched = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    // saveData();
}

// Event Listener
document.addEventListener("DOMContentLoaded", function () {

    const submitForm  = document.getElementById("form");

    submitForm.addEventListener("submit", function (event) {
        event.preventDefault();
        addWatchList();
    });

    // if(isStorageExist()){
    //     loadDataFromStorage();
    // }
});

document.addEventListener(RENDER_EVENT, function () {
    const UncompletedWatchlist = document.getElementById("watch-list");
    const CompletedWatchList = document.getElementById("completed-list");

    // clearing list item
    UncompletedWatchlist.innerHTML = ""
    CompletedWatchList.innerHTML = ""

    for(watchItem of watchlist){
        const watchlistElement = makeWatchlist(watchItem);

        if(watchItem.isWatched){
            CompletedWatchList.append(watchlistElement);
        } else {
            UncompletedWatchlist.append(watchlistElement);
        }
    }
})

document.querySelector('.show-input-form').addEventListener('click', function(){
    var showFormButton = document.querySelector('.show-input-form');
    var inputFormContainer = document.getElementById('add-todo');
    
    showFormButton.hidden = true;
    inputFormContainer.hidden = false;
});

document.getElementById('cancel-input').addEventListener('click', function(){
    var showFormButton = document.querySelector('.show-input-form');
    var inputFormContainer = document.getElementById('add-todo');
    
    showFormButton.hidden = false;
    inputFormContainer.hidden = true;
});