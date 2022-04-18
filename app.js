const express = require("express");
const restrictOrigins = require("./restrictOrigins");
const axios = require("axios");


require("dotenv").config();   // Require the dotenv
const app = express();


const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(restrictOrigins);

//Define the endpoint
app.get("/pages/:page_name", getPage);
app.get("/posts/:post_name", getPost);
app.get("/posts/", getPosts);
app.post("/post/create", createPost);
app.post("/posts/:post_name/edit", editPost);
app.get("/posts/:post_name/delete", deletePost);



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
    const postName = req.params.post_name;
    const backendRequestPayload = {
        action: "getEntry",
        branch: "main",
        params: { branch: "main", path: `site/content/post/${postName}.md` }
    };
    await respondFromBackend(backendRequestPayload, res);
    return;

};


function createPost(req, res) {
    const postName = req.body.name;
    percistEntry(req, res, true, postName);
}

function editPost(req, res) {
    const postName = req.params.post_name;
    percistEntry(req, res, false, postName);
}


async function percistEntry(req, res, newEntry, postName) {


    const commitMessage = newEntry ? `Create Post “${postName}” from API` : `Update Post “${postName}” from API`;
    const backendRequestPayload = {
        branch: "main",
        action: "persistEntry",
        params: {
            branch: "main",
            dataFiles: [
                {
                    path: `site/content/post/${postName}.md`,
                    slug: postName,
                    raw: processSiteBody(req.body)
                }],
            assets: [],
            options: { newEntry, commitMessage, "collectionName": "post", "useWorkflow": false, "unpublished": false, "status": "draft" }
        }
    };
    // res.json(backendRequestPayload);
    await respondFromBackend(backendRequestPayload, res);

    return;


    function processSiteBody(body) {
        if (body.image !== undefined) {
            body.image = `\nimage: ${body.image}\n`;
        }
        return `---\ntitle: ${body.title}\ndescription: ${body.description}${body.image}---\n` + body.content;
    }
};



async function getPosts(req, res) {

    const backendRequestPayload = {
        branch: "main",
        action: "entriesByFolder",
        params: {
            branch: "main",
            folder: "site/content/post",
            extension: "md",
            depth: 1
        }
    }

    await respondFromBackend(backendRequestPayload, res);
    return;


}



async function deletePost(req, res) {
    const postName = req.params.post_name;
    const backendRequestPayload = {
        branch: "main",
        action: "deleteFiles",
        params: {
            branch: "main",
            paths: [
                `site/content/post/${postName}.md`
            ],
            options: {
                commitMessage: `Delete Post “${postName}”`
            }
        }
    }

    await respondFromBackend(backendRequestPayload, res);
    return;


}

