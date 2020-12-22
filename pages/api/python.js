import accessPythonFile from "../../lib/accessPythonFile"

export default (req, res) => {
  const {body, method} = req;
  
  if (method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" })
  }
  
  const { file } = body;

  if (file) {
    accessPythonFile(file, res)
  }
  
  res.statusCode = 200
  res.json({ file })
}
