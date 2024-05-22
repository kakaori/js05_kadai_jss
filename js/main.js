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

            if (!etAdditional.isNewUser) {
                // 初めてのログインの場合の処理

                const kenpoText = "<div>憲法テスト</div>";

                // const words = themeText.split(',');
                const uid = result.user.uid;
                const dbRefminpo = ref(db, "users/"+uid+"/mimpo/"); 

                // dataCount = words.length;
                // for (let i = 0; i < words.length; i++) {
                    const minpodata = {
                        minpo: minpoText
                    }
                    const newPostRef = push(dbRefminpo);
                    set(newPostRef, minpodata);
                // }
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
            yokoso.style.display ="block";
        } else {
            login.style.display ="block";
            yokoso.style.display ="none";
        }
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
    location.href="index.html";
}



//###############################################
//Loginしていれば処理します
onAuthStateChanged(auth, (user) => {
    if (user) {

        // マーカー・入力フォームを作成
        const inputArea = document.createElement('div');
        inputArea.id = 'inputArea';
        inputArea.className = 'hidden absolute';

        inputArea.innerHTML = `
            <div id="imputmarker" class="flex">
                <button id="imputmarker_y" class="bg-yellow-200" onclick="document.dispatchEvent(new KeyboardEvent('keydown', {'key': '1'}));">黄色</button>
                <button id="imputmarker_o" class="bg-orange-300" onclick="document.dispatchEvent(new KeyboardEvent('keydown', {'key': '2'}));">オレンジ</button>
                <button id="imputmarker_g" class="bg-lime-300" onclick="document.dispatchEvent(new KeyboardEvent('keydown', {'key': '3'}));">緑</button>
            </div>
            <div id="">
                <button id="memoinput" onclick="document.dispatchEvent(new KeyboardEvent('keydown', {'key': '4'}));">メモ</button>
                <button id="delete" onclick="document.dispatchEvent(new KeyboardEvent('keydown', {'key': '5'}));">削除</button>
            </div>
        `;
        document.body.appendChild(inputArea);


        //「メモ」をクリックしたらテキストエリアを表示する
        const textArea = document.createElement('div');
        textArea.id = 'textarea';
        textArea.className = 'hidden absolute';

        textArea.innerHTML = `
            <div id="textarea">
                <textarea id="memotext" name="memo" rows="5" cols="33"></textarea>
                <button id="memosave" class="block bg-gray-100 rounded-lg py-3 w-full m-auto text-center transition duration-100 hover:bg-gray-200 active:bg-gray-300 mb-8 md:w-2/4">保存</button>
            </div>
            `;
        document.body.appendChild(textArea);


        let memoInput = document.getElementById('memoinput');
        memoInput.addEventListener('click', memoInputClick);
        function memoInputClick(){
            textArea.style.display = 'block';
        }


        // テキスト選択時のイベントリスナー
        document.addEventListener('mouseup', () => {
            const selection = window.getSelection();//いろいろ取れてる
            const selectedText = selection.toString().trim(); //選択した文字列

            if (selectedText) {
                const range = selection.getRangeAt(0);//全文取れている

                const rect = range.getBoundingClientRect();//要素の寸法と、そのビューポートに対する相対位置に関する情報
                inputArea.style.top = `${rect.bottom + window.scrollY}px`;
                textArea.style.top = `${rect.bottom + window.scrollY}px`;
                inputArea.style.left = `${rect.left + window.scrollX}px`;
                textArea.style.left = `${rect.left + window.scrollX}px`;
                inputArea.style.display = 'block';
                inputArea.dataset.selectedText = selectedText;
                textArea.dataset.selectedText = selectedText;
                inputArea.dataset.startOffset = range.startOffset;
                textArea.dataset.startOffset = range.startOffset;
                inputArea.dataset.endOffset = range.endOffset;
                textArea.dataset.endOffset = range.endOffset;
            } else {
                inputArea.style.display = 'none';
            }
        });





        const uid = user.uid;
        const dbRefminpo = ref(db, "users/"+uid+"/mimpo/");

        //データ表示
        onChildAdded(dbRefminpo,function(data){
            const key = data.key;//削除・更新に必須
            const minpodata = data.val().minpo;

    
            let htmlminpo = '';
                htmlminpo += minpodata;
                htmlminpo += '';

                document.getElementById('minpo_text').insertAdjacentHTML('afterbegin', htmlminpo);


            //データを更新 mark・メモ保存
            document.addEventListener('keydown', function(event) {
                const selection = window.getSelection();
                if (selection.rangeCount === 0) return; // 選択範囲がない場合は何もしない
            
                const range = selection.getRangeAt(0);
                const selectedText = selection.toString().trim(); // 選択した文字列
            
                if (selectedText === '') return; // 選択テキストが空の場合は何もしない
            
                const span = document.createElement('span');
                span.textContent = selectedText;
            
                // キーに応じてクラス名を設定
                if (event.key === '1') {
                    span.className = 'bg-yellow-200';
                    range.deleteContents();
                    range.insertNode(span);
                } else if (event.key === '2') {
                    span.className = 'bg-orange-300';
                    range.deleteContents();
                    range.insertNode(span);
                } else if (event.key === '3') {
                    span.className = 'bg-lime-300';
                    range.deleteContents();
                    range.insertNode(span);
                } else if (event.key === '4') {
                    span.className = 'border-b border-b-rose-300';
                    range.deleteContents();
                    range.insertNode(span);
                } else if (event.key === '5') {
                    // spanタグを削除する処理
                    const container = range.commonAncestorContainer;
                    let spanToRemove;
            
                    if (container.nodeType === Node.TEXT_NODE) {
                        // 親ノードがspanタグかどうかを確認
                        if (container.parentNode.tagName === 'SPAN') {
                            spanToRemove = container.parentNode;
                        }
                    } else if (container.nodeType === Node.ELEMENT_NODE) {
                        // 選択範囲内のspanタグを取得
                        const spans = container.querySelectorAll('span.bg-yellow-200, span.bg-orange-300, span.bg-lime-300, span.border-b-rose-300');
                        spans.forEach(span => {
                            if (span.textContent.includes(selectedText)) {
                                spanToRemove = span;
                            }
                        });
                    }
            
                    // spanタグを削除
                    if (spanToRemove) {
                        const parent = spanToRemove.parentNode;
                        while (spanToRemove.firstChild) {
                            parent.insertBefore(spanToRemove.firstChild, spanToRemove);
                        }
                        parent.removeChild(spanToRemove);
                    }
                } else {
                    return; // 他のキーが押された場合は何もしない
                }
            
                // <main id="contentsLaw">配下の全HTMLを取得
                const contentsLawElement = document.getElementById('minpo_text');
                const fullTextHTML = contentsLawElement.innerHTML;
            
                console.log(fullTextHTML); // 取得したHTMLをコンソールに表示（必要に応じて他の処理を追加）
            
                update(ref(db, "users/" + uid + "/mimpo/" + key), {
                    minpo: fullTextHTML
                });
            
                
            
            
            
            });//document.addEventListener('keydown', function(event) {
        
        
        });//end onChildAdded(dbRefminpo,function(data){



    }//end if (user) {
})//end onAuthStateChanged(auth, (user) => {