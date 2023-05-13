const express = require("express");
const path = require("path")

const app = express();

// Server files
const tokenHandler = require("./server/tokenHandler.js")
const accountHandler = require("./server/accountHandler.js")

