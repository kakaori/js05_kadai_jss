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

// 読み込みたい値を設定する(法律分追加)
import { kenpoText } from './import_kenpo.js';
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

            if (etAdditional.isNewUser) {
                // 初めてのログインの場合の処理

                // const words = themeText.split(',');法律分フォルダ追加
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
//Loginしていれば処理します
onAuthStateChanged(auth, (user) => {
    if (user) {

        // マーカー・入力フォームを作成
        const inputArea = document.createElement('div');
        inputArea.id = 'inputArea';
        inputArea.className = 'hidden absolute p-4 shadow-lg rounded bg-white';

        inputArea.innerHTML = `
            <div id="imputmarker" class="flex mb-2">
                <button id="imputmarker_y" class="bg-yellow-200 w-6 h-6 rounded-sm hover:opacity-70" onclick="document.dispatchEvent(new KeyboardEvent('keydown', {'key': '1'}));"> </button>
                <button id="imputmarker_o" class="bg-orange-300 w-6 h-6 rounded-sm mx-2 hover:opacity-70" onclick="document.dispatchEvent(new KeyboardEvent('keydown', {'key': '2'}));"> </button>
                <button id="imputmarker_g" class="bg-lime-300 w-6 h-6 rounded-sm hover:opacity-70" onclick="document.dispatchEvent(new KeyboardEvent('keydown', {'key': '3'}));"> </button>
            </div>
            <div id="">
                <button id="memoinput" class="bg-gray-200 px-3 py-1 text-sm hover:opacity-70" onclick="document.dispatchEvent(new KeyboardEvent('keydown', {'key': '4'}));">メモ</button>
                <button id="delete" class="align-bottom" onclick="document.dispatchEvent(new KeyboardEvent('keydown', {'key': '5'}));"><input type="image" src="./images/clear.svg" class="block w-6 max-w-6 cursor-pointer opacity-50 hover:opacity-20"></button>
            </div>
        `;
        document.body.appendChild(inputArea);


        //「メモ」をクリックしたらテキストエリアを表示する
        const textArea = document.createElement('div');
        textArea.id = 'textarea';
        textArea.className = 'hidden absolute p-4 shadow-lg rounded bg-white';

        textArea.innerHTML = `
            <div id="textarea">
                <textarea id="memotext" class="block mb-2 text-sm border border-2" name="memo" rows="3" cols="20"></textarea>
                <button id="memosave" class="bg-gray-200 px-3 py-1 text-sm hover:opacity-70">保存</button>
                <button id="memoclose" class="border border-gray-200 px-3 py-1 text-sm hover:opacity-70">閉じる</button>
            </div>
            `;
        document.body.appendChild(textArea);


        // let memoInput = document.getElementById('memoinput');
        // memoInput.addEventListener('click', memoInputClick);
        // function memoInputClick(){
        //     textArea.style.display = 'block';
        // }


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
        const dbRefkenpo = ref(db, "users/"+uid+"/kenpo/");
        const dbRefminpo = ref(db, "users/"+uid+"/minpo/");




        //データ表示 憲法
        onChildAdded(dbRefkenpo,function(data){
            const key = data.key;//削除・更新に必須
            const kenpodata = data.val().kenpo;

            //民法のデータを表示
            let htmlkenpo = kenpodata;
            document.getElementById('kenpo_text').insertAdjacentHTML('afterbegin', htmlkenpo);

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
                    
                    // <textarea>を表示
                    document.getElementById('textarea').style.display = 'block';
                    // <textarea>にフォーカスを移動
                    document.getElementById('memotext').focus();
                    
                    // メモ保存ボタンがクリックされたときの処理
                    document.getElementById('memosave').addEventListener('click', function() {
                        span.className = 'border-b border-b-rose-300';
                        range.deleteContents();
                        range.insertNode(span);
                    // textareaからメモのテキストを取得
                        const memoText = document.getElementById('memotext').value.trim();
                        if (memoText === '') return; // メモが空の場合は何もしない
                        
                        // 選択された文字列の親要素を取得
                        let selectedElement = range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
                            ? range.commonAncestorContainer.closest('div._div_ParagraphSentence, div._div_ArticleTitle')
                            : range.commonAncestorContainer.parentElement.closest('div._div_ParagraphSentence, div._div_ArticleTitle');
                        console.log(selectedElement);
                        
                        if (selectedElement) {
                            // 新しい <p> 要素を作成し、メモのテキストを追加
                            const memoParagraph = document.createElement('p');
                            memoParagraph.textContent = memoText;
                            memoParagraph.classList.add('memotext_p', 'text-rose-300', 'text-xs');
                            
                            // メモを追加
                            selectedElement.appendChild(memoParagraph);
                            selectedElement = "";
                            // メモを fullTextHTML に含める処理
                            const contentsLawElement = document.getElementById('kenpo_text');
                            const fullTextHTML = contentsLawElement.innerHTML;
                            
                            // メモを保存する処理を追加する場合はここに記述
                            // 例えば、Firestoreやローカルストレージに保存するなど
                            update(ref(db, "users/" + uid + "/kenpo/" + key), {
                                kenpo: fullTextHTML
                            });
                                    
                            // テキストエリアを空にする
                            document.getElementById('memotext').value = '';
                            
                            // <textarea>を非表示にする
                            document.getElementById('textarea').style.display = 'none';

                        } else {
                            console.error('Selected element not found.');
                        }
                    });
                    //閉じるボタンを押された時
                    document.getElementById('memoclose').addEventListener('click', function() {
                        // <textarea>を非表示にする
                        document.getElementById('textarea').style.display = 'none';
                    });
                } else if (event.key === '5') {
                    // spanタグとその関連するメモを削除する処理
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
            
                    // spanタグとその関連するメモを削除
                    if (spanToRemove) {
                        const parent = spanToRemove.parentNode;
                        while (spanToRemove.firstChild) {
                            parent.insertBefore(spanToRemove.firstChild, spanToRemove);
                        }
                        parent.removeChild(spanToRemove);
            
                        // そのspanタグに続くメモ要素も削除
                        const nextSibling = parent.querySelector('.memotext_p');
                        if (nextSibling) {
                            nextSibling.remove();
                        }
            
                        // メモを fullTextHTML に含める処理
                        const contentsLawElement = document.getElementById('kenpo_text');
                        const fullTextHTML = contentsLawElement.innerHTML;
            
                        // メモを保存する処理を追加する場合はここに記述
                        // 例えば、Firestoreやローカルストレージに保存するなど
                        update(ref(db, "users/" + uid + "/kenpo/" + key), {
                            kenpo: fullTextHTML
                        });
                    }
                } else {
                    return; // 他のキーが押された場合は何もしない
                }
                        
                // <main id="contentsLaw">配下の全HTMLを取得
                const contentsLawElement = document.getElementById('kenpo_text');
                const fullTextHTML = contentsLawElement.innerHTML;
                        
                update(ref(db, "users/" + uid + "/kenpo/" + key), {
                    kenpo: fullTextHTML
                });
                
            
            });//document.addEventListener('keydown', function(event) {
        
        
        });//end onChildAdded(dbRefkenpo,function(data){ 
        //end データ表示 憲法





        //データ表示 民法    ※他の法律にコピーする
        onChildAdded(dbRefminpo,function(data){
            const key = data.key;//削除・更新に必須
            const minpodata = data.val().minpo;

            //民法のデータを表示
            let htmlminpo = minpodata;
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
                    
                    // <textarea>を表示
                    document.getElementById('textarea').style.display = 'block';
                    // <textarea>にフォーカスを移動
                    document.getElementById('memotext').focus();
                    
                    // メモ保存ボタンがクリックされたときの処理
                    document.getElementById('memosave').addEventListener('click', function() {
                        span.className = 'border-b border-b-rose-300';
                        range.deleteContents();
                        range.insertNode(span);
                    // textareaからメモのテキストを取得
                        const memoText = document.getElementById('memotext').value.trim();
                        if (memoText === '') return; // メモが空の場合は何もしない
                        
                        // 選択された文字列の親要素を取得
                        let selectedElement = range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
                            ? range.commonAncestorContainer.closest('div._div_ParagraphSentence, div._div_ArticleTitle')
                            : range.commonAncestorContainer.parentElement.closest('div._div_ParagraphSentence, div._div_ArticleTitle');
                        console.log(selectedElement);
                        
                        if (selectedElement) {
                            // 新しい <p> 要素を作成し、メモのテキストを追加
                            const memoParagraph = document.createElement('p');
                            memoParagraph.textContent = memoText;
                            memoParagraph.classList.add('memotext_p', 'text-rose-300', 'text-xs');
                            
                            // メモを追加
                            selectedElement.appendChild(memoParagraph);
                            selectedElement = "";
                            // メモを fullTextHTML に含める処理
                            const contentsLawElement = document.getElementById('minpo_text');
                            const fullTextHTML = contentsLawElement.innerHTML;
                            
                            // メモを保存する処理を追加する場合はここに記述
                            // 例えば、Firestoreやローカルストレージに保存するなど
                            update(ref(db, "users/" + uid + "/minpo/" + key), {
                                minpo: fullTextHTML
                            });
                                    
                            // テキストエリアを空にする
                            document.getElementById('memotext').value = '';
                            
                            // <textarea>を非表示にする
                            document.getElementById('textarea').style.display = 'none';

                        } else {
                            console.error('Selected element not found.');
                        }
                    });
                    //閉じるボタンを押された時
                    document.getElementById('memoclose').addEventListener('click', function() {
                        // <textarea>を非表示にする
                        document.getElementById('textarea').style.display = 'none';
                    });
                } else if (event.key === '5') {
                    // spanタグとその関連するメモを削除する処理
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
            
                    // spanタグとその関連するメモを削除
                    if (spanToRemove) {
                        const parent = spanToRemove.parentNode;
                        while (spanToRemove.firstChild) {
                            parent.insertBefore(spanToRemove.firstChild, spanToRemove);
                        }
                        parent.removeChild(spanToRemove);
            
                        // そのspanタグに続くメモ要素も削除
                        const nextSibling = parent.querySelector('.memotext_p');
                        if (nextSibling) {
                            nextSibling.remove();
                        }
            
                        // メモを fullTextHTML に含める処理
                        const contentsLawElement = document.getElementById('minpo_text');
                        const fullTextHTML = contentsLawElement.innerHTML;
            
                        // メモを保存する処理を追加する場合はここに記述
                        // 例えば、Firestoreやローカルストレージに保存するなど
                        update(ref(db, "users/" + uid + "/minpo/" + key), {
                            minpo: fullTextHTML
                        });
                    }
                } else {
                    return; // 他のキーが押された場合は何もしない
                }
                        
                // <main id="contentsLaw">配下の全HTMLを取得
                const contentsLawElement = document.getElementById('minpo_text');
                const fullTextHTML = contentsLawElement.innerHTML;
                        
                update(ref(db, "users/" + uid + "/minpo/" + key), {
                    minpo: fullTextHTML
                });
                
            
            });//document.addEventListener('keydown', function(event) {
        
        
        });//end onChildAdded(dbRefminpo,function(data){
        //end データ表示 民法


    } else {//end if (user) {
        _redirect();  // User is signed out
    }
})//end onAuthStateChanged(auth, (user) => {




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

