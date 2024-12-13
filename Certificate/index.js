import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";

const app = express();
const _dirname = dirname(fileURLToPath(import.meta.url));
const port = 3000;
app.use(express.static("public"));

  
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req,res) => {
  res.render("certificate_form.ejs");
})

app.post("/certificate", (req,res) => {
    // const student = req.body["Student_Name"];
    // const Cname = req.body["Competition_Name"];
    // const Rank = req.body["Rank"];
    // const CDate = req.body["Date"];
  const data = {
    student: req.body["Student_Name"].toUpperCase(),
    Cname: req.body["Competition_Name"].toUpperCase(),
    Rank: req.body["Rank"],
    CDate: req.body["Date"],
  };
  res.render("index.ejs", data);
})
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
