const form = document.querySelector('.dataForm');
const output = document.querySelector('.output');
const message = document.querySelector('.message');

// 新增資料
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.querySelector('.name').value;
  const email = document.querySelector('.email').value;
  const comment = document.querySelector('.comment').value;

  try {
    const response = await fetch('/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, comment })
    });

    const result = await response.json();

    // 清空表單
    form.reset();
        
    // 顯示成功消息
    message.textContent = '資料已成功新增: ' + JSON.stringify(result);
  } catch (err) {
    console.error('錯誤:', err);
    message.textContent = '錯誤: 無法新增資料';
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
