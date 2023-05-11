const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
//require env
app.use(express.json());

let refreshTokens = [];

app.get("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, "refresh_secret", (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ name: user.name });
    res.json({ accessToken: accessToken });
  });
});

app.get("/logout", (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});

app.get("/login", (req, res) => {
  // Authenticate User
  
    const username = req.body.username;
    const user = { name: username };

    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, "refresh_secret");
    refreshTokens.push(refreshToken);
  
  res.json({ accessToken, refreshToken: refreshToken });
});

function generateAccessToken(user) {
  return jwt.sign(user, "access_secret", { expiresIn: "15s" });
}

app.listen(4000);
