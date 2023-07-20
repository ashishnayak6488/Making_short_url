const express = require("express");
const { connectToMongoDB } = require("./connect");
const URL = require("./models/url");
const path = require("path")
const staticRoute = require("./routes/staticRouter")

const urlRoute = require("./routes/url");

const app = express();
const PORT = 8002;

connectToMongoDB("mongodb://127.0.0.1:27017/shortend-url")
.then(() =>
  console.log("MongoDb connected")
);

app.set("view engine" , "ejs");
app.set("views" , path.resolve("./views"))

app.use(express.json());
app.use(express.urlencoded({extended: false}));


app.use("/url", urlRoute);
app.use("/" , staticRoute);

app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );

  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server started at Port ${PORT}`));
