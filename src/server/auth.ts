import express, { Router } from "express";
import { Roles } from "../shared/Roles";

export const auth = Router();

auth.use(express.json());

export const validUsers = [
    { id: "1", name: "Jane", roles: [Roles.admin] },
    { id: "2", name: "Steve", roles: [] },
];

auth.post("/api/signIn", (req, res) => {
    const user = validUsers.find((user) => user.name === req.body.username);
    if (user) {
        req.session!['user'] = user;
        res.json(user);
    } else {
        res.status(404).json("Invalid user, try 'Steve' or 'Jane'");
    }
});

auth.post("/api/signOut", (req, res) => {
    req.session!['user'] = null;
    res.json("signed out");
});

auth.get("/api/currentUser", (req, res) =>
    res.json(req.session!['user'])
);