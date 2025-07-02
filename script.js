document.addEventListener('DOMContentLoaded', function() {
    const noteForm = document.getElementById('noteForm');
    const searchBtn = document.getElementById('searchBtn');
    const showAllBtn = document.getElementById('showAllBtn');
    const notesList = document.getElementById('notesList');
    
    // 初始化存储
    if (!localStorage.getItem('medicalNotes')) {
        localStorage.setItem('medicalNotes', JSON.stringify([]));
    }
    
    // 保存便签
    noteForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const patientName = document.getElementById('patientName').value;
        const prescription = document.getElementById('prescription').value;
        const diagnosis = document.getElementById('diagnosis').value;
        const date = document.getElementById('date').value || new Date().toISOString().split('T')[0];
        
        const newNote = {
            id: Date.now(),
            patientName,
            prescription,
            diagnosis,
            date,
            createdAt: new Date().toISOString()
        };
        
        const notes = JSON.parse(localStorage.getItem('medicalNotes'));
        notes.push(newNote);
        localStorage.setItem('medicalNotes', JSON.stringify(notes));
        
        // 清空表单
        noteForm.reset();
        
        // 刷新列表
        displayNotes([newNote], true);
        
        alert('便签已保存！');
    });
    
    // 查询便签
    searchBtn.addEventListener('click', function() {
        const searchTerm = document.getElementById('searchTerm').value.toLowerCase();
        const searchType = document.querySelector('input[name="searchType"]:checked').value;
        
        if (!searchTerm) {
            alert('请输入查询内容');
            return;
        }
        
        const notes = JSON.parse(localStorage.getItem('medicalNotes'));
        let filteredNotes = [];
        
        if (searchType === 'name') {
            filteredNotes = notes.filter(note => 
                note.patientName.toLowerCase().includes(searchTerm)
            );
        } else {
            filteredNotes = notes.filter(note => 
                note.diagnosis.toLowerCase().includes(searchTerm)
            );
        }
        
        displayNotes(filteredNotes);
    });
    
    // 显示所有便签
    showAllBtn.addEventListener('click', function() {
        const notes = JSON.parse(localStorage.getItem('medicalNotes'));
        displayNotes(notes);
    });
    
    // 删除便签
    function deleteNote(id) {
        const notes = JSON.parse(localStorage.getItem('medicalNotes'));
        const updatedNotes = notes.filter(note => note.id !== id);
        localStorage.setItem('medicalNotes', JSON.stringify(updatedNotes));
        
        // 刷新列表
        displayNotes(updatedNotes);
    }
    
    // 显示便签
    function displayNotes(notes, prepend = false) {
        if (notes.length === 0) {
            notesList.innerHTML = '<p>没有找到便签</p>';
            return;
        }
        
        let html = '';
        
        notes.forEach(note => {
            html += `
                <div class="note-card">
                    <h3>${note.patientName}</h3>
                    <p><strong>病名:</strong> ${note.diagnosis}</p>
                    <p><strong>方剂:</strong> ${note.prescription.replace(/\n/g, '<br>')}</p>
                    <div class="note-meta">
                        <span>日期: ${note.date}</span>
                        <button class="delete-btn" onclick="deleteNote(${note.id})">删除</button>
                    </div>
                </div>
            `;
        });
        
        if (prepend) {
            notesList.innerHTML = html + notesList.innerHTML;
        } else {
            notesList.innerHTML = html;
        }
    }
    
    // 初始加载所有便签
    const notes = JSON.parse(localStorage.getItem('medicalNotes'));
    displayNotes(notes);
    
    // 设置默认日期为今天
    document.getElementById('date').valueAsDate = new Date();
});

// 全局函数供删除按钮使用
function deleteNote(id) {
    const notes = JSON.parse(localStorage.getItem('medicalNotes'));
    const updatedNotes = notes.filter(note => note.id !== id);
    localStorage.setItem('medicalNotes', JSON.stringify(updatedNotes));
    
    // 刷新列表
    document.getElementById('notesList').innerHTML = '';
    const displayNotes = new Function(`
        const notes = JSON.parse(localStorage.getItem('medicalNotes'));
        let html = '';
        
        notes.forEach(note => {
            html += \`
                <div class="note-card">
                    <h3>\${note.patientName}</h3>
                    <p><strong>病名:</strong> \${note.diagnosis}</p>
                    <p><strong>方剂:</strong> \${note.prescription.replace(/\\n/g, '<br>')}</p>
                    <div class="note-meta">
                        <span>日期: \${note.date}</span>
                        <button class="delete-btn" onclick="deleteNote(\${note.id})">删除</button>
                    </div>
                </div>
            \`;
        });
        
        document.getElementById('notesList').innerHTML = html || '<p>没有找到便签</p>';
    `);
    
    displayNotes();
}