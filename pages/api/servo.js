export default (req, res) => {
  fetch("http://192.168.1.89:3000").then(() => {
    res.statusCode = 200
    res.json({ name: 'John Doe' })
  })
}
