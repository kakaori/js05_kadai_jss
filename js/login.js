// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, getAdditionalUserInfo } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getDatabase, ref, push, set, onChildAdded, remove, onChildRemoved, update, onChildChanged }
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDOdQOzaP9Mihk5kHkL9F_JdTDYAEjax8A",
    authDomain: "roppo-98796.firebaseapp.com",
    projectId: "roppo-98796",
    storageBucket: "roppo-98796.appspot.com",
    messagingSenderId: "417728752816",
    appId: "1:417728752816:web:058cef221eeedae6491f75"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app); // RealtimeDatabase使うよ



//###############################################
//GoogleAuth(認証用)
const provider = new GoogleAuthProvider();
const auth = getAuth();

// 読み込みたい値を設定する
import { minpoText } from './import_minpo.js';
import { kenpoText } from './import_kenpo.js';


//###############################################
// login処理
let loginButton = document.getElementById('login');
loginButton.addEventListener('click', butotnClick);
function butotnClick(){
    signInWithPopup(auth, provider).then((result) => {
        // これにより、Google アクセス トークンが得られます。これを使用して Google API にアクセスできます。
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // サインインしているユーザー情報。
        const user = result.user;
        // getAdditionalUserInfo(result) を使用して利用可能な IdP データ

        const etAdditional = getAdditionalUserInfo(result);

            if (etAdditional.isNewUser) {
                // 初めてのログインの場合の処理

                // const words = themeText.split(',');
                const uid = result.user.uid;
                const dbRefkenpo = ref(db, "users/"+uid+"/kenpo/"); 
                const dbRefminpo = ref(db, "users/"+uid+"/minpo/"); 

                //憲法追加
                const kenpodata = {
                    kenpo: kenpoText
                }
                const newPostRefkenpo = push(dbRefkenpo);
                set(newPostRefkenpo, kenpodata);

                //民法追加
                const minpodata = {
                    minpo: minpoText
                }
                const newPostRefminpo = push(dbRefminpo);
                set(newPostRefminpo, minpodata);
            }
        
        }).catch((error) => {
        // ここでエラーを処理します。
        const errorCode = error.code;
        const errorMessage = error.message;
        // 使用されるユーザーのアカウントの電子メール。
        const email = error.customData.email;
        // 使用された AuthCredential タイプ。
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
    });
}

//###############################################
//Loginしていれば処理します
onAuthStateChanged(auth, (user) => {
    if (user) {
        let login = document.getElementById("login");
        let yokoso = document.getElementById("yokoso");

        //ユーザー情報取得できます
        if (user !== null) {
            user.providerData.forEach((profile) => {
                //Loginしている名前を表示する
                let loginName = document.getElementById('uname');
                loginName.textContent = profile.displayName;
            });
            login.style.display ="none";
            yokoso.style.display ="flex";
        } 
    } else {
        login.style.display ="block";
        yokoso.style.display ="none";
    }
})

//###############################################
//Logout処理
let logoutButton = document.getElementById('out');
logoutButton.addEventListener('click', logoutbutotnClick);
function logoutbutotnClick(){
    // signInWithRedirect(auth, provider);
    signOut(auth).then(() => {
        // Sign-out successful.
        _redirect();
    }).catch((error) => {
        // An error happened.
        console.error(error);
    });
}

//###############################################
//Login画面へリダイレクト(関数作成)
function _redirect(){
    location.href="./index.html";
}
