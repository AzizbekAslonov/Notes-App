
function renderNote(item = { title: 'New', text: '' }) {
   return `
   <div class="notes__header p-1 p-md-3 bg-warning d-flex justify-content-between align-items-center lead">
      <span class="text-white note-title">${item.title}</span>
      <div class="notes-iconblock">
         <i class="fas fa-edit notes-icons bg-white p-md-2 mx-1" style="border-radius: 10px;cursor: pointer;"></i>
         <i class="fas fa-trash notes-icons bg-white p-md-2 mx-1" style="border-radius: 10px;cursor: pointer;"></i>
         <i class="fas fa-save notes-icons bg-white p-md-2 mx-1" style="border-radius: 10px;cursor: pointer;"></i>
      </div>
   </div>
   <div class="notes-body">
      <textarea class="form-control"
         style="min-height: 250px;border: 1px solid rgba(51, 51, 51, 0.5) !important;"
         placeholder="Type here..."
         value="${item.text}"
         ></textarea>
   </div>
`
}

function createHtmlElem(name, className, text = '') {
   let el = document.createElement(name)
   typeof className === 'string' ? el.classList += (className) : el.classList += (className.join(' '))
   el.textContent = text
   return el
}