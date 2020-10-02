// wrapper for database access and error catching
// similar functionality as old server/routes.js
import { users, hotdogs } from './database';

// ========================================= USERS ===========================================
const login = async (email, password) => {
    try {
        let userId = await users.login(email, password);
        return userId;
    } catch(e) {
        // console.log("database: " + e);
        return false;
    }
}

const register = async (name, email, password, profileImage) => {
    try {
        let userId = await users.register(name, email, password, profileImage);
        // console.log("database: User with id " + userId + " successfully created");
        return true;
    } catch(e) {
        console.log(e);
        return false;
    }
}

const getUser = async (id) => {
    try {
        let user = await users.get(id);
        return user;
    } catch(e) {
        // console.log("database: " + e);
        return false;
    }
}

const getUserProfileImage = async (id) => {
    try {
        let url = await users.getProfileImage(id);
        return url;
    } catch(e) {
        // console.log("database: no avatar detected, so set to default avatar (ignore annoying firebase error above)");
        return "";
    }
}

async function putUserProfileImage(id, profileImage) {
    try {
        let url = await users.putProfileImage(id, profileImage);
        return url;
    } catch(e) {
        return false;
    }
}

// ========================================= HOTDOGS =========================================
const getAllHotdogs = async () => {
    try {
        let res = await hotdogs.all();
        return res;
    } catch(e) {
        // console.log("database: " + e);
        return [];
    }
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

const getHotdogsCreatedBy = async (id) => {
    try {
        let res = await hotdogs.getCreatedBy(id);
        return res;
    } catch(e) {
        // console.log("database: " + e);
        return [];
    }
}

const getHotdogsCreatedByQuery = async (id) => {
    let query = await hotdogs.getCreatedByQuery(id);
    return query;
}


async function addHotdog(hotdog, hotdogImage) {
    try {
        let hotdogId = await hotdogs.add(hotdog, hotdogImage);
        console.log("database: Hotdog with id " + hotdogId + " successfully created");
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
    getUserProfileImage,
    putUserProfileImage,
    getAllHotdogs,
    getHotdogImage,
    getHotdogsCreatedBy,
    getHotdogsCreatedByQuery,
    addHotdog,
}