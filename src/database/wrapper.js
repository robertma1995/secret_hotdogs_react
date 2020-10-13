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

async function register(name, email, password, image) {
    try {
        let id = await users.register(name, email, password, image);
        return id;
    } catch(e) {
        console.log(e);
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

async function getUserImage (id) {
    try {
        let url = await users.getImage(id);
        return url;
    } catch(e) {
        console.log("database: no avatar detected, so set to default avatar (ignore annoying firebase error above)");
        return "";
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
async function getAllHotdogs() {
    try {
        let res = await hotdogs.all();
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
        console.log(e);
        return false;
    }
}

async function getHotdogQuery(id) {
    let query = await hotdogs.getQuery(id);
    return query;
}

async function getHotdogImage(id) {
    try {
        let url = await hotdogs.getImage(id);
        return url;
    } catch(e) {
        console.log("no hotdog image detected, set url to empty string");
        return ""
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

async function getHotdogsCreatedByQuery(id) {
    let query = await hotdogs.getCreatedByQuery(id);
    return query;
}

async function patchHotdog(id, hotdog) {
    try {
        await hotdogs.patch(id, hotdog);
        return true;
    } catch(e) {
        console.log(e);
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

async function postHotdog(hotdog, image) {
    try {
        let id = await hotdogs.post(hotdog, image);
        console.log("database: Hotdog with id " + id + " successfully created");
        return true;
    } catch(e) {
        console.log(e);
        return false;
    }
}

export {
    login,
    register,
    getUser,
    getUserImage,
    putUserImage,
    getAllHotdogs,
    getHotdog, 
    getHotdogQuery,
    getHotdogImage,
    getHotdogsCreatedBy,
    getHotdogsCreatedByQuery,
    patchHotdog,
    postHotdog,
    putHotdogImage,
}