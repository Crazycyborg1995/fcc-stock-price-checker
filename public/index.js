let outputDiv = document.getElementById('output-div');
let output = document.getElementById('output');
outputDiv.style.display = 'none';

document.getElementById('single-stock').addEventListener('submit', e => {
  e.preventDefault();
  outputDiv.style.display = null;
  output.textContent = 'Loading Data...';
  let symbol = document.getElementById('single-input').value;
  let like = document.getElementById('single-like').checked;
  if (symbol) {
    fetch('/api/single-stock', {
      method: 'POST',
      body: JSON.stringify({ symbol, like }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.msg) {
          output.textContent = data.msg;
        } else {
          output.textContent = JSON.stringify(data);
        }
      });
  } else {
    output.textContent = 'Please enter a symbol';
  }
});

document.getElementById('compare-stock').addEventListener('submit', async e => {
  e.preventDefault();
  outputDiv.style.display = null;
  output.textContent = 'Loading Data...';
  let symbol1 = document.getElementById('multi-input1').value;
  let symbol2 = document.getElementById('multi-input2').value;
  let like = document.getElementById('multi-like').checked;
  if (symbol1 && symbol2) {
    let promise1 = fetch('/api/single-stock', {
      method: 'POST',
      body: JSON.stringify({ symbol: symbol1, like }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => data);
    let promise2 = fetch('/api/single-stock', {
      method: 'POST',
      body: JSON.stringify({ symbol: symbol2, like }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => data);
    console.log(promise1, promise2);
    let [data1, data2] = await Promise.all([promise1, promise2]);
    console.log(data1, data2);
    if (!data1.msg && !data2.msg) {
      data1['rel-likes'] = data1.Likes - data2.Likes;
      data2['rel-likes'] = data2.Likes - data1.Likes;
    }
    output.innerHTML = `<ol>
      <li class="my-4">${JSON.stringify(data1)}</li>
      <li class="my-4">${JSON.stringify(data2)}</li>
    </ol>`;
  } else {
    output.textContent = 'Please enter a symbol';
  }
});

document.getElementById('close-btn').addEventListener('click', e => {
  setTimeout(() => {
    outputDiv.style.display = 'none';
  }, 200);
});
