const saveBtn = document.getElementById('save-btn');
const newBtn = document.getElementById('new-btn');
const langInput = document.getElementById('lang');
const srcInput = document.getElementById('input');
const textOutput = document.getElementById('output');

if (saveBtn && !saveBtn.classList.contains('inactive')) {
  saveBtn.addEventListener('click', save);
  srcInput.focus();
}

if (newBtn && !newBtn.classList.contains('inactive')) {
  newBtn.addEventListener('click', createNew);
}

async function save() {
  try {
    document.body.classList.add('loading');
    const raw = srcInput.value;
    const lang = langInput.value;
    if (raw && lang) {
      const res = await postData('/save', { raw, lang });
      displayResult(res);
      changePageUrl(res.id);
      saveBtn.removeEventListener('click', save);
      newBtn.addEventListener('click', createNew);
      srcInput.value = '';
    }
  } catch (err) {
    console.error(err);
  } finally {
    document.body.classList.remove('loading');
  }
}

function changePageUrl(id, title='Codebin') {
  const url = '/' + id;
  window.history.pushState(null, title, url);
}

function createNew() {
  textOutput.style.display = 'none';
  srcInput.style.display = 'block';
  lang.style.display = 'block';
  textOutput.firstChild.innerHTML = '';
  textOutput.firstChild.classList = [];
  newBtn.classList.add('inactive');
  newBtn.removeEventListener('click', createNew);
  saveBtn.classList.remove('inactive');
  saveBtn.addEventListener('click', save);
  document.body.style.overflow = 'hidden';
  changePageUrl('');
  srcInput.focus();
}

function displayResult(result) {
  srcInput.style.display = 'none';
  lang.style.display = 'none';
  textOutput.firstChild.classList.add('language-' + result.lang);
  textOutput.firstChild.innerHTML = result.hltext;
  textOutput.style.display = 'block';
  saveBtn.classList.add('inactive');
  newBtn.classList.remove('inactive');
  document.body.style.overflow = 'auto';
}

async function postData(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data)
  });
  return response.json();
}
