const express = require("express");
const restrictOrigins = require("./restrictOrigins");
const axios = require("axios");


require("dotenv").config();   // Require the dotenv
const app = express();


const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(restrictOrigins);

//Define the endpoint
app.get("/pages/:page_name", getPage);
app.get("/posts/:post_name", getPost);



app.listen(PORT, () => {
    console.log("Server started listening on port : ", PORT);
});


async function getPage(req, res) {
    const pageName = req.params.page_name;
    const backendRequestPayload = {
        action: "getEntry",
        branch: "main",
        params: {
            branch: "main",
            path: `site/content/${pageName}/_index.md`
        }
    };
    await respondFromBackend(backendRequestPayload, res);
    return;

};





async function respondFromBackend(backendRequestPayload, res) {
    try {
        const response = await axios.post(`${process.env.BACKEND}`, backendRequestPayload);
        res.send(response.data);

    }
    catch (e) {
        console.log(e);
    }
}

async function getPost(req, res) {
    const pageName = req.params.post_name;
    const backendRequestPayload = {
        action: "getEntry",
        branch: "main",
        params: { branch: "main", path: `site/content/post/${pageName}.md` }
    };
    await respondFromBackend(backendRequestPayload, res);
    return;

};


