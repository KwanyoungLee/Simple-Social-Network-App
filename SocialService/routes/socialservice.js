var express = require('express'); 
var router = express.Router();

router.post('/signin', function(req, res) {

  var db = req.db;
  var collection_userList = db.get("userList");
  var collection_postList = db.get("postList");
  var collection_commentList = db.get("commentList");
  var friend_list = [];
  var post_list = [];
  var comment_list = [];

  res.set({
      "Access-Control-Allow-Origin": "http://localhost:3000",
  });  


  collection_userList.find({'name':req.body.name}, {}, function(error1, login_user) {
    if(error1 === null){ 
      if((login_user.length > 0)&&(login_user[0].password == req.body.password)){ 

        res.cookie("login_user",login_user[0]._id);

        var friend_idlist = login_user[0].friends.map(function(objectItem){return objectItem.friendId;});
        var friend_starlist = login_user[0].friends.map(function(objectItem){return objectItem.starredOrNot;});

        collection_userList.find({}, {}, function(error2, users) {
          if(error2 === null){
        
            collection_postList.find({}, {}, function(error3, posts) {
              if(error3 === null){

                collection_commentList.find({}, {}, function(error4, comments) {
                  if(error4 === null){

                    for (var i in users){
                      var j = friend_idlist.indexOf(users[i]._id.toString());
                      if(j != -1){

                        for (var k in posts){
                          //var l = friend_idlist.indexOf(posts[k].userId);
                          if (posts[k].userId == users[i]._id.toString()){

                            for (var m in comments){
                              if(comments[m].postId == posts[k]._id){
                                comment_list.push({'_id':comments[m]._id, 'postTime':comments[m].postTime, 'comment':comments[m].comment, 'deleteTime': comments[m].deleteTime});                  
                              }
                            }
                            post_list.push({'_id':posts[k]._id, 'time':posts[k].time, 'location':posts[k].location, 'content':posts[k].content, 'comment_list':comment_list}); 
                            comment_list = [];
                          }
                        }

                        friend_list.push({'_id':users[i]._id, 'name':users[i].name, 'icon':users[i].icon, 'starredOrNot':friend_starlist[j], 'post_list': post_list});
                        post_list = [];
                      }
                    }


                    var date = new Date().toDateString();
                    var time = new Date().toTimeString().slice(0,9);
                    var datetime = time + date;

                    login_user[0].lastCommentRetrievalTime = datetime;

                    collection_userList.update({'_id':login_user[0]._id}, login_user[0], function(error5, result) {
                      if(error5 != null)
                        res.send(error5);
                        return;
                    });

                    res.json({'user_name':login_user[0].name, 'icon':login_user[0].icon, 'friend_list':friend_list});

                  }else{
                    res.send(error4);
                  }
                });
              }else{
                res.send(error3);
              }
            });
          }else{
            res.send(error2);
          }
        });
      }else{
        res.send("Login failure");
      }
    }else{
      res.send(error1);
    }
  });
});


router.get('/logout', function(req, res) {

  var db = req.db;
  var collection_userList = db.get("userList");

  res.set({
      "Access-Control-Allow-Origin": "http://localhost:3000",
  });  

  collection_userList.update({'_id':req.cookies.login_user}, {$set:{"lastCommentRetrievalTime":""}}, function(error, result) {
    if(error === null){
      res.clearCookie("login_user");
      res.send("");
    }else{
      res.send(error);
    }
  });
});


router.get('/getuserprofile', function(req, res) {

  var db = req.db;
  var collection_userList = db.get("userList");

  res.set({
      "Access-Control-Allow-Origin": "http://localhost:3000",
  });  

  collection_userList.find({'_id':req.cookies.login_user}, {}, function(error, result) {
    if(error === null){
      res.json({'mobileNumber':result[0].mobileNumber,'homeNumber':result[0].homeNumber,'address':result[0].address});
    }else{
      res.send(error);
    }
  });
});


router.put('/saveuserinfo', function(req, res) {
  var db = req.db;
  var collection_userList = db.get("userList");
  var mobileNumber = req.body.mobileNumber;
  var homeNumber = req.body.homeNumber;
  var address = req.body.address;
  
  res.set({
      "Access-Control-Allow-Origin": "http://localhost:3000",
  });  

  collection_userList.update({'_id':req.cookies.login_user}, {$set: {'mobileNumber':mobileNumber, 'homeNumber':homeNumber, 'address':address}}, function(error, result) {
    if(error === null){
      res.send("");
    }else{
      res.send(error);
    }
  });
});


router.get('/updatestar/:friendid', function(req, res) {
  var id = req.params.friendid;
  var db = req.db;
  var collection_userList = db.get("userList");

  res.set({
      "Access-Control-Allow-Origin": "http://localhost:3000",
  });  

  collection_userList.find({'_id':req.cookies.login_user}, {}, function(error1, user) {
    if(error1 === null){
      var friend_idlist = user[0].friends.map(function(objectItem){return objectItem.friendId;});
      var i = friend_idlist.indexOf(id);
      if (user[0].friends[i].starredOrNot == 'Y') {
        user[0].friends[i].starredOrNot = 'N';
      }else{
        user[0].friends[i].starredOrNot = 'Y';
      } 

      collection_userList.update({'_id':user[0]._id}, user[0], function(error2,result) {
        if(error2!=null){
          res.send("");
        }else{
          res.send(error2);
        }  
      });
    }else{
      res.send(error1);
    }
  });
});


router.post('/postcomment/:postid',function(req, res) {

  var id = req.params.postid;
  var db = req.db;
  var collection_commentList = db.get("commentList");
  var date = new Date().toDateString();
  var time = new Date().toTimeString().slice(0,9);
  var datetime = time + date;
  var deletetime = "";

  res.set({
      "Access-Control-Allow-Origin": "http://localhost:3000",
  });  
  
  collection_commentList.insert({'postId':id, 'userId':req.cookies.login_user, 'postTime':datetime, 'comment':req.body.comment, 'deleteTime':deletetime}, function(error, result) {
    if (error === null){
      res.send("");
    }else{
      res.send(error);
    }
  });
});


router.delete('/deletecomment/:commentid', function(req, res) {
  var id = req.params.commentid;
  var db = req.db;
  var collection_commentList = db.get("commentList");
  var date = new Date().toDateString();
  var time = new Date().toTimeString().slice(0,9);
  var datetime = time + date;

  res.set({
      "Access-Control-Allow-Origin": "http://localhost:3000",
  });  

  collection_commentList.update({'_id':id}, {$set: {'deleteTime':datetime}}, function(error, result) {
    if (error === null){
      res.send("");
    }else{
      res.send(error);
    }
  });
});


router.get('/loadcommentupdates', function(req, res) {
  var db = req.db;
  var collection_commentList = db.get("commentList");
  var collection_userList = db.get("userList");
  var comment_list = [];
  var delete_comment_list = []; 

  res.set({
      "Access-Control-Allow-Origin": "http://localhost:3000",
  });  

  //new comments submitted by freinds on the posts from friends of the current user
  collection_userList.find({'_id':req.cookies.login_user}, {}, function(error1, login_user) {
    if(error1 === null){

      var ll1=login_user[0].lastCommentRetrievalTime.slice(0,9);
      var ll2=login_user[0].lastCommentRetrievalTime.slice(9);
      var ll = ll2 + " " + ll1;

      collection_commentList.find({}, {}, function(error2, comments) {
        if(error2 === null){
          for (var i in comments){
            var friend_idlist = login_user[0].friends.map(function(objectItem){return objectItem.friendId;});
            var j = friend_idlist.indexOf(comments[i].userId);
              if(j != -1){

                var cp1=comments[i].postTime.slice(0,9);
                var cp2=comments[i].postTime.slice(9);
                var cp = cp2 + " " + cp1;

                var cd1=comments[i].deleteTime.slice(0,9);
                var cd2=comments[i].deleteTime.slice(9);
                var cd = cd2 + " " + cd1;

                var LL = new Date(ll);
                var CP = new Date(cp);
                var CD = new Date(cd);

                if(CP > LL){
                  comment_list.push(comments[i]);

                }

                if(CD > LL && comment[i].deleteTime != "" ){
                  delete_comment_list.push(comments[i]._id);    
                }

                var date = new Date().toDateString();
                var time = new Date().toTimeString().slice(0,9);
                var datetime = time + date;  
                collection_userList.update({'_id':req.cookies.login_user}, { $set: {'lastCommentRetrievalTime':datetime}}, function(error4, comment) {
                  if (error4 != null){
                    res.send(error4);
                    return;
                  }
                });
           
              }
          }

          res.json({'comment_list': comment_list, 'delete_comment_list': delete_comment_list});

        }else{
            res.send(error2);
        }
      });

    }else{
      res.send(error1)
    }
  });
});


router.options("/*", function(req, res, next){
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', true);
    res.send(200);
});


module.exports = router;




