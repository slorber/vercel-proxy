const fetch = require('node-fetch');

const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern; but there might not be origin (for instance call from browser)
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  return await fn(req, res)
}

const handler = (req, res) => {
  const url = req.query.url;
  fetch(url,{redirect: "manual"})
    .then(async (result) => {
      res.status(result.status);
      res.setHeader('Location', result.headers.get("Location"));
      res.send(await result.text());
    })
    .catch(error => {
      res.status(500);
      res.send({error,message: error.message});
    })
}

module.exports = allowCors(handler)
