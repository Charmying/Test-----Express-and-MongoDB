const form = document.querySelector('.addDataForm');
const output = document.querySelector('.output');
const message = document.querySelector('.message');

// 新增資料
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.querySelector('.addName').value;
  const email = document.querySelector('.addEmail').value;
  const comment = document.querySelector('.addComment').value;

  try {
    await fetch('/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, comment })
    });
    
    // 清空表單
    form.reset();
    alert('留言新增成功');
  } catch (err) {
    console.error('錯誤:', err);
    alert('留言新增失敗');
  }
});

// 獲取資料
document.querySelector('.getData').addEventListener('click', async () => {
  try {
    const response = await fetch('/data');
    const data = await response.json();
    output.innerHTML = JSON.stringify(data, null, 2);
    message.textContent = '';
  } catch (err) {
    console.error('錯誤:', err);
    message.textContent = '錯誤: 無法獲取資料';
  }
});
