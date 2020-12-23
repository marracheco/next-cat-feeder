export default (req, res) => {
  try {
    fetch("http://192.168.1.89:3001/test").then(() => {
      res.statusCode = 200
      res.json({ message: 'Servo test completed successfully' })
    })
  } catch(err) {
    res.statusCode = 503
    res.json({ message: 'Service Unavailable' })
  }
}
