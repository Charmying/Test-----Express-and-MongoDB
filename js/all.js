const addForm = document.querySelector('.addDataForm');
const editForm = document.querySelector('.editDataForm');
const getDataButton = document.querySelector('.getData');
const updateDataButton = document.querySelector('.updateData');
const deleteDataButton = document.querySelector('.deleteData');
const actionButtons = document.querySelector('.actionButtons');
let currentDataId = null;

// 新增資料
addForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  editForm.reset();

  const name = document.querySelector('.addName').value.trim();
  const email = document.querySelector('.addEmail').value.trim();
  const comment = document.querySelector('.addComment').value.trim();

  try {
    const response = await fetch('/data');
    const data = await response.json();
    const foundEntry = data.find(entry => entry.name === name && entry.email === email);

    if (foundEntry) {
      alert('資料已存在，已自動填入下方表單。');
      addForm.reset();
      document.querySelector('.editName').value = foundEntry.name;
      document.querySelector('.editEmail').value = foundEntry.email;
      document.querySelector('.editComment').value = foundEntry.comment;
      return;
    }

    await fetch('/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, comment })
    });

    alert('留言新增成功');
    addForm.reset();
  } catch (err) {
    alert('留言新增失敗');
    console.error('錯誤:', err);
  }
});

// 獲取資料
getDataButton.addEventListener('click', async (e) => {
  e.preventDefault();

  const editName = document.querySelector('.editName').value.trim();
  const editEmail = document.querySelector('.editEmail').value.trim();

  if (!editName || !editEmail) {
    alert('請填寫名稱和 Email 以查詢資料。');
    return;
  }

  try {
    const response = await fetch('/data');
    const data = await response.json();
    const foundEntry = data.find(entry => entry.name === editName && entry.email === editEmail);

    if (foundEntry) {
      document.querySelector('.editComment').value = foundEntry.comment;
      currentDataId = foundEntry._id;
      actionButtons.classList.add('show');
    } else {
      alert('查無資料或名稱 / Email 錯誤');
      currentDataId = null;
      actionButtons.classList.remove('show');
    }
  } catch (err) {
    alert('無法獲取資料');
    actionButtons.classList.remove('show');
    console.error('錯誤:', err);
  }
});

// 更新資料
updateDataButton.addEventListener('click', async (e) => {
  e.preventDefault();

  const editName = document.querySelector('.editName').value.trim();
  const editEmail = document.querySelector('.editEmail').value.trim();
  const editComment = document.querySelector('.editComment').value.trim();

  try {
    // 獲取資料以確認是否存在
    const response = await fetch('/data');
    const data = await response.json();
    const foundEntry = data.find(entry => entry.name === editName && entry.email === editEmail);

    if (foundEntry) {
      // 檢查輸入的資料是否與資料庫中的資料一致
      if (foundEntry.comment === editComment) {
        alert('資料沒有變更，請先修改再更新');
        return;
      }

      // 如果資料不一致，則發送 PUT 請求更新資料
      const updateResponse = await fetch(`/data/${foundEntry._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: editName, email: editEmail, comment: editComment })
      });

      if (updateResponse.ok) {
        alert('資料更新成功');
        editForm.reset();
        actionButtons.classList.remove('show');
      } else {
        alert('資料更新失敗');
      }
    } else {
      alert('查無資料或名稱 / Email 錯誤');
    }
  } catch (err) {
    alert('無法更新資料');
    console.error('錯誤:', err);
  }
});

// 刪除資料
deleteDataButton.addEventListener('click', async (e) => {
  e.preventDefault();

  const editName = document.querySelector('.editName').value.trim();
  const editEmail = document.querySelector('.editEmail').value.trim();

  try {
    const response = await fetch('/data');
    const data = await response.json();
    const foundEntry = data.find(entry => entry.name === editName && entry.email === editEmail);

    if (foundEntry) {
      const deleteResponse = await fetch(`/data/${foundEntry._id}`, {
        method: 'DELETE'
      });

      if (deleteResponse.ok) {
        alert('資料已成功刪除');
        editForm.reset();
        actionButtons.classList.remove('show');
      } else {
        alert('刪除資料失敗');
      }
    } else {
      alert('查無資料或名稱 / Email 錯誤');
    }
  } catch (err) {
    alert('無法刪除資料');
    console.error('錯誤:', err);
  }
});
