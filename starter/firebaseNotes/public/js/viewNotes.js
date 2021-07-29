let googleUserId;

window.onload = (event) => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('Logged in as: ' + user.displayName);
      googleUserId = user.uid;
      getNotes(googleUserId);
    } else {
      // If not logged in, navigate back to login page.
      window.location = 'index.html'; 
    };
  });
};

const getNotes = (userId) => {
  const notesRef = firebase.database().ref(`users/${userId}`);
  notesRef.on('value', (snapshot) => {
    const data = snapshot.val();
    renderData(data);
  });
};

const renderData = (data) => {
    const destination = document.querySelector('#app');
    destination.innerHTML = "";
    for (let key in data) {
        const note = data[key];
        //adds text on to the string already
        destination.innerHTML += createCard(note, key);
    }
};



const createCard = (note, noteId) => {
    return `<div class="column is-one-quarter">
                <div class="card" id="noteId"> 
                    <header class="card-header"> 
                        <p class="card-header-title"> 
                            ${note.title} 
                        </p> 
                    </header> 
                    <div class="card-content"> 
                        <div class="content">
                            ${note.text} 
                        </div>
                        <div class = "card-footer">

                             <a href="#"
                               class= "card-footer-item"
                               onclick="editNote('${noteId}')">
                                Edit</a>

                            <a href="#"
                               class= "card-footer-item"
                               onclick="deleteNote('${noteId}')">
                                Delete</a>
                                
                        </div>


                    </div> 
                </div>
            </div>`;
};

const deleteNote = (noteId) => {
    
    const noteToDelete = firebase.database().ref(`users/${googleUserId}/${noteId}`);
    console.log("function worked");
     noteToDelete.remove();

}



const editNote = (noteId) => {
    //console.log("edit" + noteId);
    const noteToEdit = firebase.database().ref(`users/${googleUserId}/${noteId}`);
    noteToEdit.on("value", (snapshot) => {
        const note = snapshot.val();
        const editNoteModal = document.querySelector("#editNoteModal");
        const editNoteTitleInput = document.querySelector("#editNoteTitleInput");
        const editNoteTextInput = document.querySelector("#editNoteTextInput");

        document.querySelector("#editNoteId").value = noteId;        
    
    editNoteModal.classList.add("is-active");
    });
};

const closeModal = (noteId) => {
    //console.log("edit" + noteId);
    const closeNoteModal = document.querySelector("#editNoteModal");
    editNoteModal.classList.remove("is-active");
};


const saveChanges = () => {
    //console.log("edit" + noteId);
    const editNoteTitleInput = document.querySelector("#editNoteTitleInput");
    const editNoteTextInput = document.querySelector("#editNoteTextInput");
    const editNoteId = document.querySelector("#editNoteId");

    const title = editNoteTitleInput.value;
    const text = editNoteTextInput.value;
    const noteId = editNoteId.value;

    const noteToEdit = firebase.database().ref(`users/${googleUserId}/${noteId}`);
    noteToEdit.update({
        title: title,
        text: text,
    });

    closeModal();
};
