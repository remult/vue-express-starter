import express from "express";
import { api } from "./api";
import session from "cookie-session";
import { auth } from "./auth";
import helmet from 'helmet';
import compression from 'compression';
import sslRedirect from 'heroku-ssl-redirect';
import path from 'path';
import csrf from "csurf";
import cookieParser from "cookie-parser";

const app = express();
app.use(session({
    secret: process.env['TOKEN_SIGN_KEY'] || "my secret"
}));
app.use(sslRedirect());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use("/api", cookieParser());
app.use(auth);
app.use('/api', csrf({ cookie: true }));
app.use("/api", (req, res, next) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    next();
});
app.use(api);
app.use(express.static(path.join(__dirname, '../')));
app.get('/*', function (_, res) {
    res.sendFile(path.join(__dirname, '../', 'index.html'));
});

app.listen(process.env["PORT"] || 3002, () => console.log("Server started"));
 