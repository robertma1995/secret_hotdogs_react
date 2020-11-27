// wrapper for database access and error catching
// similar functionality as old server/routes.js
import { users, hotdogs } from './database';

// ========================================= USERS ===========================================
async function login(email, password) {
    try {
        let id = await users.login(email, password);
        return id;
    } catch(e) {
        // console.log("database: " + e);
        return false;
    }
}

async function getUser(id) {
    try {
        let user = await users.get(id);
        return user;
    } catch(e) {
        // console.log("database: " + e);
        return false;
    }
}

async function getUserImage(id) {
    try {
        let url = await users.getImage(id);
        return url;
    } catch(e) {
        // console.log("database: no avatar detected, so set to default avatar (ignore annoying firebase error above)");
        return "";
    }
}

async function postUser(name, email, password) {
    try {
        let id = await users.post(name, email, password);
        return id;
    } catch(e) {
        return false;
    }
}

async function postUserImage(id, image) {
    try {
        await users.postImage(id, image);
        return true;
    } catch(e) {
        return false;
    }
}

async function putUserImage(id, image) {
    try {
        let url = await users.putImage(id, image);
        return url;
    } catch(e) {
        return "";
    }
}

// ========================================= HOTDOGS =========================================
async function deleteHotdog(id) {
    try {
        await hotdogs.del(id);
        return true;
    } catch(e) {
        return false;
    }
}

async function deleteHotdogImage(id) {
    try {
        await hotdogs.deleteImage(id);
        return true;
    } catch(e) {
        return false;
    }
}

async function getAllHotdogs() {
    try {
        let res = await hotdogs.getAll();
        return res;
    } catch(e) {
        // console.log("database: " + e);
        return [];
    }
}

async function getHotdog(id) {
    try {
        let hotdog = await hotdogs.get(id);
        return hotdog;
    } catch(e) {
        // console.log(e);
        return false;
    }
}

function getHotdogQuery(id) {
    return hotdogs.getQuery(id);
}

async function getHotdogWithSnapshot(id) {
    try {
        let hotdog = await hotdogs.getWithSnapshot(id);
        return hotdog;
    } catch(e) {
        // console.log(e);
        return false;
    }
}

async function getHotdogImage(id) {
    try {
        let url = await hotdogs.getImage(id);
        return url;
    } catch(e) {
        // console.log("no hotdog image detected, set url to empty string");
        return "";
    } 
}

async function getHotdogsCreatedBy(id) {
    try {
        let res = await hotdogs.getCreatedBy(id);
        return res;
    } catch(e) {
        // console.log("database: " + e);
        return [];
    }
}

function getHotdogsNextQuery(id, n) {
    return hotdogs.getNextQuery(id, n);
}

async function patchHotdog(id, hotdog) {
    try {
        await hotdogs.patch(id, hotdog);
        return true;
    } catch(e) {
        // console.log(e);
        return false;
    }
}

async function postHotdog(hotdog) {
    try {
        let id = await hotdogs.post(hotdog);
        return id;
    } catch(e) {
        // console.log(e);
        return false;
    }
}

async function postHotdogImage(id, image) {
    try {
        await hotdogs.postImage(id, image);
        return true;
    } catch(e) {
        return false;
    }
}

async function putHotdogImage(id, image) {
    try {
        let url = await hotdogs.putImage(id, image);
        return url;
    } catch(e) {
        return false;
    }
}


export {
    login,
    getUser,
    getUserImage,
    postUser,
    postUserImage,
    putUserImage,
    deleteHotdog,
    deleteHotdogImage,
    getAllHotdogs,
    getHotdog, 
    getHotdogQuery,
    getHotdogWithSnapshot,
    getHotdogImage,
    getHotdogsCreatedBy,
    getHotdogsNextQuery,
    patchHotdog,
    postHotdog,
    postHotdogImage,
    putHotdogImage,
}