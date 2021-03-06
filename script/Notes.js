class Notes {

   static localData = JSON.parse(localStorage.getItem('notes')) || [];
   static COUNT_NOTES = Notes.getHightId(Notes.localData);
   static allw = false;

   static getHightId(localData) {
      let a = 0;
      localData.forEach((item) => {
         if (+item.id > a) a = +item.id + 1

         else if (a === +item.id) a++
      })
      return a
   }

   constructor(selector) {
      this.$selector = document.querySelector(selector)
      this.$createNewNote = this.$selector.querySelector('.createNewNote')
      this.allowConfig = true
      this.noteId = Notes.COUNT_NOTES

      this.#render()
   }

   #render() {
      // < init Noteblock >
      this.noteItem = document.createElement('div')
      this.noteItem.classList.add('note-item', 'mb-2');
      this.noteItem.dataset.id = this.noteId;
      this.noteItem.innerHTML += renderNote()
      this.$selector.appendChild(this.noteItem);
      this.renderNewNoteFromBtn()

      // < init Noteblock />

      this.renderBtnFromLocalStorage()
      this.checkAllowConfig = this.checkAllowConfig.bind(this)

      this.setIcons()
   }

   renderBtnFromLocalStorage() {
      let localResults = document.getElementById('local-results');
      let localResultsTitle = localResults.querySelector('h3');
      let dataButtons = localResults.querySelector('#data-buttons');
      dataButtons.innerHTML = '';
      if (Notes.localData.length > 0) {

         localResultsTitle.textContent = 'Ваш записы :'
         Notes.localData.forEach((item) => {
            // <Init button>
            let btn = createHtmlElem('button', ['btn', 'btn-primary', 'mx-2', 'btn-block', 'mb-3'], item.title)
            btn.setAttribute('data-id', item.id)
            // < Init button />

            dataButtons.appendChild(btn);

            btn.addEventListener('click', () => {
               this.giveLocalNotes(item)
            })
         })
      }
      else {
         localResultsTitle.textContent = 'Здесь пока что ничево нет!'
      }

   }

   setIcons() {
      // Onclick in icons
      let icons = this.noteItem.querySelectorAll('.notes-icons')
      const oldValues = this.getDataFromBlock()
      this.oldTextContent = oldValues.title
      this.oldTextareaTextContent = oldValues.text
      icons.forEach(item => {

         item.addEventListener('click', () => {
            this.checkAllowConfig()
            if (this.allowConfig) {
               this.noteIcons(item)
            }
         })
      })
   }

   checkAllowConfig() {
      let passwordBlock = document.querySelector('#password-block');
      if (!this.allowConfig) {
         // Parol hali terilmagan bo'lsa
         passwordBlock.classList.add('active');
         this.checkPass(passwordBlock)
      }
   }

   checkPass(passwordBlock) {
      let passwordBtn = passwordBlock.querySelector('button');

      passwordBtn.onclick = () => {
         let username = passwordBlock.querySelector('#exampleInputEmail1');
         let password = passwordBlock.querySelector('#exampleInputPassword1');

         this.allowConfig = (username.value.trim() === userAndPass.username.trim()) && (password.value.trim() === userAndPass.password.trim())

         if (this.allowConfig) {
            alert('Welcome Azizbek!')
            passwordBlock.classList.remove('active');
         }
         else {
            alert('Password or username incorrect')
            username.value = ''
            password.value = ''
            username.focus()
         }
      }
   }

   noteIcons(icon) {
      // Delete button
      if (icon.classList.contains('fa-trash')) {
         if (confirm('Вы хотите удалить?')) {
            alert('Удалено!')
            const data = this.getDataFromBlock()
            let index = this.currentFromLocalstorage(data)

            if (index != -1) {
               Notes.localData.splice(index, 1)
               //  refresh localstorage
               this.setNotesToLocalStr();
            }
            Notes.allw = true
            this.noteItem.remove()
            this.renderBtnFromLocalStorage()
         }
      }
      // Edit button
      else if (icon.classList.contains('fa-edit')) {
         let textBlock = this.noteItem.querySelector('.note-title')

         textBlock.setAttribute("contenteditable", true)
         textBlock.focus()

         textBlock.addEventListener('blur', () => {
            textBlock.setAttribute("contenteditable", false)

         })

      }
      // Save button
      else {
         // Init
         let textBlock = this.noteItem.querySelector('.note-title')
         this.nowTextContent = textBlock.textContent;
         this.nowTextareaTextContent = this.noteItem.querySelector('textarea').value;
         if (confirm('Вы хотите сохранить?')) {
            const oldData = { title: this.oldTextContent, text: this.oldTextareaTextContent, id: this.noteId }
            let index = this.currentFromLocalstorage(oldData)

            if (index != -1) {
               // Localstorageda bor
               alert('Обновлено!')

               Notes.localData[index].title = this.nowTextContent ? this.nowTextContent : 'No Name!'
               Notes.localData[index].text = this.nowTextareaTextContent

               // refresh all
               this.setNotesToLocalStr()
               this.setNotes()
            }
            else {
               // Localstorageda yo'q
               const nowData = {
                  title: (this.nowTextContent.trim() ? this.nowTextContent.trim() : 'No Name!'),
                  text: this.nowTextareaTextContent.trim(),
                  id: this.noteId
               }
               if (nowData.text.length > 0) {
                  alert('Сохранено!')
                  Notes.localData.push(nowData)

                  // refresh all
                  this.setNotesToLocalStr()
                  this.setNotes()
               }
               else {
                  alert('Длина текста 0')
               }
            }
         }
         else {
            alert('Не сохранено!')
         }
      }
   }

   removeNote() {
      this.noteItem.remove();
   }

   setNotes() {
      this.oldTextContent = this.nowTextContent;
      this.oldTextareaTextContent = this.nowTextareaTextContent;
      this.renderBtnFromLocalStorage()
   }

   setNotesToLocalStr() {
      localStorage.setItem('notes', JSON.stringify(Notes.localData))
   }

   currentFromLocalstorage(oldData) {
      return Notes.localData.findIndex(item => {
         return item.title.trim() === oldData.title.trim() && item.text.trim() === oldData.text.trim() && item.id === this.noteId
      })
   }

   getDataFromBlock() {
      let noteId = this.noteItem.dataset.id;
      let title = this.noteItem.querySelector('.note-title').textContent
      let text = this.noteItem.querySelector('textarea').value

      return { title, text, noteId }
   }

   // Good job!!!👍
   giveLocalNotes(currentNote) {
      let localDatatitle = currentNote.title;
      let localDatatext = currentNote.text;
      let localDataId = currentNote.id;
      this.removeNote();

      let note = new Notes('#notes', {});
      note.setContent(localDatatitle, localDatatext, localDataId);
   }

   setContent(localDatatitle, localDatatext, localDataId) {
      let titblock = this.noteItem.querySelector('.note-title')
      let areablock = this.noteItem.querySelector('textarea')

      this.oldTextContent = localDatatitle
      this.oldTextareaTextContent = localDatatext
      this.noteId = localDataId

      this.noteItem.dataset.id = localDataId;
      titblock.textContent = localDatatitle;
      areablock.textContent = localDatatext;

   }

   renderNewNoteFromBtn() {

      let $createNew = document.querySelector('#createNew');
      $createNew.textContent = ''
      // <Init >
      let content = createHtmlElem('div', ['createNewNote', 'text-center'])
      let h4 = createHtmlElem('h4', 'h4', 'Создать новый Note')
      let button = createHtmlElem('button', ['btn', 'btn-primary', 'p-2', 'px-3'], '+')
      // <Init />

      // <Appends>
      content.appendChild(h4)
      content.appendChild(button)

      $createNew.appendChild(content)
      // <Appends />

      button.onclick = () => {
         if (Notes.allw) {
            if (confirm('Вы хотите создать новый?')) {
               this.removeNote()
               new Notes('#notes', {})
            }
         }
      }

      button.addEventListener('click', () => {
         this.noteItem.classList.remove('d-none')
         Notes.allw = true
      }, { once: true })


   }
}

