const addForm = document.querySelector('.addDataForm');
const editForm = document.querySelector('.editDataForm');

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

    // 如果資料不存在，則新增資料
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
editForm.addEventListener('click', async (e) => {
  e.preventDefault();
  addForm.reset();

  const editName = document.querySelector('.editName').value.trim();
  const editEmail = document.querySelector('.editEmail').value.trim();

  try {
    const response = await fetch('/data');
    const data = await response.json();
    const foundEntry = data.find(entry => entry.name === editName && entry.email === editEmail);

    if (foundEntry) {
      // 填入資料庫中的資料
      document.querySelector('.editComment').value = foundEntry.comment;
    } else {
      alert('查無資料或名稱 / 信箱錯誤');
    }
  } catch (err) {
    alert('無法獲取資料');
    console.error('錯誤:', err);
  }
});
