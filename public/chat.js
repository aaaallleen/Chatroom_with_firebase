roomId=''
function init() {
    console.log(roomId);
    var user_email = '';
    var username = '';
    var chatroom = 'chat_rooms/'+roomId+'/messages';
    var usernameRef = firebase.database().ref('Username_list');
    firebase.auth().onAuthStateChanged(function(user) {
        // Check user login
        if (user) {
            user_email = user.email;
            chatlist(user_email);
            usernameRef.once('value').then(function(snapshot){
                snapshot.forEach(function(childshot){
                    var childData = childshot.val();
                    if(childData.email == user_email){
                        username = childData.Username;
                        document.getElementById("account").innerHTML = username;
                    }
                });   
            });
            var logoutbtn = document.getElementById('logout-btn');
            logoutbtn.addEventListener("click", function() {
                console.log("logout")
                firebase.auth().signOut().then(function() {
                    user_email='';
                    username='';
                    window.alert("User sign out success!");
                    window.location.href = "index.html";
                }).catch(function(error) {
                    alert("User sign out failed!");
                })
            }, false);

        } else {
            // It won't show any post if not login
            // menu.innerHTML = "<a class='dropdown-item' href='signin.html'>Login</a>";
            // document.getElementById('post_list').innerHTML = "";
            window.location.href = "index.html";
            //window.alert("Please sign in first.")
        }
    });
    post_btn = document.getElementById('post_btn');
    chat_txt = document.getElementById('chatinput');
    post_btn.addEventListener('click', function() {
        console.log(roomId);
        if (chat_txt.value != "") { 
            var Ref = firebase.database().ref('chat_rooms'+'/'+roomId+'/messages');
            var D = new Date();
            var tmp = html_encode(chat_txt.value);
            var data = {
                sender: username,
                data: tmp,
                email: user_email,
                type: 0,
                url:'',
                time: D.getFullYear()+'/'+ D.getMonth()+'/'+D.getDate()+'  '+D.getHours()+':'+D.getMinutes()+':'+D.getSeconds()
            };
            Ref.push(data);
            chat_txt.value='';
        }
    });
    img_btn = document.getElementById("img");
    img_btn.addEventListener('change', function(){
            var file = this.files[0];
            var D = new Date();
            var ID = username+'-'+D.getTime();
            var storageRef = firebase.storage().ref(ID);
            storageRef.put(file).then(function(){
                storageRef.getDownloadURL().then(function(url){
                    var Ref = firebase.database().ref(chatroom);
                    var data = {
                        sender: username,
                        data: '',
                        email: user_email,
                        type: 1,
                        url: url,
                        time: D.getFullYear()+'/'+ D.getMonth()+'/'+D.getDate()+'  '+D.getHours()+':'+D.getMinutes()+':'+D.getSeconds()
                    };
                    Ref.push(data);
                })
            })
       
        
    });
    create_btn = document.getElementById("create");
    search_btn = document.getElementById("search");
    search_value = document.getElementById("room");
    create_btn.addEventListener('click', function(){
        var roomId = search_value.value;
        search_value.value=""
        if(roomId !=''){
            var found = false;
            var usrRef = firebase.database().ref('chat_rooms');
            usrRef.once('value').then(function(snapshot){
                snapshot.forEach(function(childshot){
                    console.log(childshot.key);
                    if(roomId == childshot.key){
                        found = true;
                    }
                }); 
                if(found){
                    alert("please choose another chat room name");
                }
                else{
                    roomId = roomId;
                    var Ref = firebase.database().ref('chat_rooms/'+roomId);
                    Ref.child('users').push(user_email);
                    chatlist(user_email);
                }
            });
            
        }
    });
    search_btn.addEventListener('click', function(){
        var roomId = search_value.value;
        search_value.value = "";
        if(roomId !=''){
            var roomRef = firebase.database().ref('chat_rooms');
            roomRef.once('value').then(function(snapshot){
                snapshot.forEach(function(childshot){
                    if(childshot.key == roomId){
                        var password = prompt("Please enter the password");
                        var pwd = childshot.val().passwd;
                        if(password == pwd){
                            roomId = roomId;
                            var Ref = firebase.database().ref('chat_rooms/'+roomId);
                            Ref.child('users').push(user_email);
                            init();
                            window.alert("you shall enter");
                        }
                        else{
                            window.alert("you shall not enter");
                        }
                    }
                });   
            });
        }
        else{
            console.log("input room to search");
        }
         
    });
    
    // The html code for post
    
    var str_before_username_other = "<div class='other_sender'><p class='media-body pb-3 mb-0 small lh-125 '><strong class='d-block text-gray-dark'>";
    var str_before_username_myself = "<div class='Isend'><p class='media-body pb-3 mb-0 small lh-125 '><strong class='d-block text-gray-dark'>"
    var str_after_content = "</p></div>\n";
    var str_before_img = "<img class='img pt-2' style='height: 300px;' src='";
    var str_after_img = "'>";
    var postsRef = firebase.database().ref('chat_rooms'+'/'+roomId+'/messages');
    var total_post = [];
    var first_count = 0;
    var second_count = 0;
    postsRef.once('value')
        .then(function(snapshot) {
            snapshot.forEach(function(childshot) {
                var childData = childshot.val();
                if(childData.email != user_email){
                    if(childData.type === 0)
                        total_post[total_post.length] = str_before_username_other + childData.time +'<br>'+ childData.sender + "</strong>" + childData.data + str_after_content;
                    else
                        total_post[total_post.length] = str_before_username_other + childData.time +'<br>'+ childData.sender + "</strong>" + str_before_img + childData.url + str_after_img +str_after_content;
                }else{
                    if(childData.type === 0)
                        total_post[total_post.length] = str_before_username_myself + childData.time +'<br>' + "</strong>" + childData.data + str_after_content;
                    else
                        total_post[total_post.length] = str_before_username_myself + childData.time +'<br>' + "</strong>" + str_before_img + childData.url + str_after_img + str_after_content;
                }
                    first_count += 1;
                    scrollToEnd();
            });
            document.getElementById('chat_list').innerHTML = total_post.join('');
            postsRef.on('child_added', function(data) {
                notify(roomId);
                second_count += 1;
                if (second_count > first_count) {
                    var childData = data.val();
                    if(childData.email != user_email){
                        if(childData.type === 0)
                            total_post[total_post.length] = str_before_username_other + childData.time +'<br>'+ childData.sender + "</strong>" + childData.data + str_after_content;
                        else
                            total_post[total_post.length] = str_before_username_other + childData.time +'<br>'+ childData.sender + "</strong>" + str_before_img + childData.url + str_after_img + str_after_content;
                    }else{
                        if(childData.type === 0)
                            total_post[total_post.length] = str_before_username_myself + childData.time +'<br>' + "</strong>" + childData.data + str_after_content;
                        else
                            total_post[total_post.length] = str_before_username_myself + childData.time +'<br>' + "</strong>" + str_before_img + childData.url + str_after_img + str_after_content;
                    }
                    document.getElementById('chat_list').innerHTML = total_post.join('');
                    scrollToEnd();
                }
            });


        })
        .catch(e => console.log(e.message));
}
window.onload = function() {
    init('');
};

function logout(){
    document.getElementById('logout-btn').click();
}
function scrollToEnd(){
	var chatList = document.getElementById("chatContainer");
	chatList.scrollTop = chatList.scrollHeight;
}
function idGen(){
    var result = [];
    var characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var date = new Date();
    for(var i = 0; i < 10 ; i++){

        result.push(characters.charAt(Math.floor(Math.random()*date.getTime()) %72));
    }
    return result.join('');
}
function upload(){
  document.getElementById('img').click();
}
function showpassword(){
    console.log(roomId)
    if(roomId != ''){
        var pass = idGen();
        if(roomId != ''){
            var Ref = firebase.database().ref('chat_rooms/'+roomId);
            Ref.child('passwd').set(pass);
        }
        alert(pass);
    }
}
function chatlist(user_email){
    var chathead="<a href='#' onclick=\"change('";
    var chatactive = "<a href='#' id='chatactive' onclick=\"change('";
    var chatmid="')\">";
    var chatend="</a>\n";
    var total_chat=[];
    var entered = [];
    var usrRef = firebase.database().ref('chat_rooms');
    usrRef.once('value').then(function(snapshot){
        snapshot.forEach(function(childshot){
            var Ref = firebase.database().ref('chat_rooms'+ '/' + childshot.key +'/users');
            Ref.once('value').then(function(snapshot2){
                snapshot2.forEach(function(childshot2){
                    var childData2= childshot2.val();
                    if(childData2 == user_email){
                        var room = childshot.key;
                        var flag = false;
                        for(i = 0; i < entered.length; i++){
                            if(entered[i] == room){
                                flag= true;
                            }
                        }
                        if(!flag){
                            
                            if(room != roomId)
                                total_chat[total_chat.length] = chathead + room + chatmid + room + chatend;
                            else
                                total_chat[total_chat.length] = chatactive + room + chatmid + room + chatend;
                            entered[entered.length] = room;
                            document.getElementById('chats').innerHTML = total_chat.join('');
                        }
                    }
                })
            })
        }); 
        
    });
}
function change(id){
    console.log(id);
    firebase.database().ref('chat_rooms'+'/'+roomId+'/messages').off();
    roomId = id;
    init();
}
function notify(room) {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    }
  
    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
      // If it's okay let's create a notification
      var notification = new Notification("");
    }
  
    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          var notification = new Notification("Hi there!");
        }
      });
    }
  
    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them any more.
  }
  function html_encode(html)
{
　　return document.createElement('div')
　　.appendChild(document.createTextNode(html))
　　.parentNode.innerHTML;
}