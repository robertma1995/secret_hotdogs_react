// wrapper for database access and error catching
// similar functionality as server/routes.js
import { users, hotdogs } from './database';

// ========================================= USERS ===========================================
const login = async (email, password) => {
    try {
        let userId = await users.login(email, password);
        return userId;
    } catch(e) {
        console.log("database: " + e);
        return false;
    }
}

const register = async (name, email, password) => {
    try {
        let userId = await users.register(name.trim(), email.trim(), password);
        console.log("database: User with id " + userId + " successfully created");
        return true;
    } catch(e) {
        console.log("database: " + e);
        return false;
    }
}

const getUser = async (id) => {
    try {
        let user = await users.get(id);
        return user;
    } catch(e) {
        console.log("database: " + e);
        return false;
    }
}

// ========================================= HOTDOGS =========================================
const getAllHotdogs = async () => {
    try {
        let res = await hotdogs.all();
        return res;
    } catch(e) {
        console.log("database: " + e);
        return [];
    }
}

const getHotdogsCreatedBy = async (id) => {
    try {
        let res = await hotdogs.getCreatedBy(id);
        return res;
    } catch(e) {
        console.log("database: " + e);
        return [];
    }
    // TEMP: working real-time database call
    /*
        dbindex.firebase.firestore().collection('hotdogs').where("creatorId", "==", id)
        .onSnapshot(snapshot => {
            // onSnapshot returns a QuerySnapshot
            snapshot.forEach(row => {
                formattedRow = row.data();
                formattedRow["id"] = row.id;
                formattedRow.ts = row.data().ts.seconds;
                hotdogs.push(formattedRow);
            });
            console.log(hotdogs);
        });
    */
}

const addHotdog = async (hotdog) => {
    try {
        let hotdogId = await hotdogs.add(hotdog);
        console.log("Hotdog with id " + hotdogId + " successfully created");
        return true;
    } catch(e) {
        console.log("database: " + e);
        return false;
    }
}

export {
    login,
    register,
    getUser,
    getAllHotdogs,
    getHotdogsCreatedBy,
    addHotdog,
}