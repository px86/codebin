const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function genId(length = 5) {
  let str = '';
  for (let i=0; i<length; ++i) {
    const indx = Math.floor(Math.random() * chars.length);
    str += chars[indx];
  }
  return str;
}

async function genUniqueId(collection) {
  let length = 5;
  let code = genId(length);
  let result = await collection.findOne({ 'code': code });
  while (result != null ) {
    code = genId(length+1);
    result = await collection.findOne({ 'code': code });
  }
  return code;
}

module.exports = { genId, genUniqueId };
