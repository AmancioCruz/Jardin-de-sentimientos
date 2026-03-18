import { initializeApp }
    from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getAuth }
    from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { getDatabase }
    from "https://www.gstatic.com/firebasejs/12.9.0/firebase-database.js";
import { getStorage }
    from "https://www.gstatic.com/firebasejs/12.9.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyDDiGIxQsPaxMWI7oc_VcdWN0F8lcUt_is",
    authDomain: "jardin-de-sentimientos-b248a.firebaseapp.com",
    projectId: "jardin-de-sentimientos-b248a",
    storageBucket: "jardin-de-sentimientos-b248a.firebasestorage.app",
    messagingSenderId: "135082188372",
    appId: "1:135082188372:web:02d0b3f828f97a3fced7c1",
    measurementId: "G-J8S6M6HZGC",
    databaseURL: "https://jardin-de-sentimientos-b248a-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);

export const configuracionesFirebase = {
    auth: getAuth(app),
    basedatos: getDatabase(app),
    storage: getStorage(app)
};