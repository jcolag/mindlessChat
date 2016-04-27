"use strict";
// initialize Hoodie
var hoodie  = new Hoodie();

// message model for storage
function messageModel(message) {
  var user = hoodie.account.username;
  var postDate = new Date();

  return {
    'user': user,
    'date': postDate,
    'message': message
  };
}

function getObjectClass(obj) {
  if (obj && obj.constructor && obj.constructor.toString) {
    var arr = obj.constructor.toString().match(
      /function\s*(\w+)/);
    if (arr && arr.length == 2) {
      return arr[1];
    }
  }
  return undefined;
}

// Chats Collection/View
function Chats($element) {
  var collection = [];
  var $el = $element;

  // Handle marking chat as "done"
  $el.on('click', 'input[type=checkbox]', function() {
    hoodie.store.remove('chat', $(this).parent().data('id')).publish();
    return false;
  });

  // Handle "inline editing" of a chat.
  $el.on('click', 'label', function() {
    $(this).parent().parent().find('.editing').removeClass('editing');
    $(this).parent().addClass('editing');
    return false;
  });

  // Handle updating of an "inline edited" chat.
  $el.on('keypress', 'input[type=text]', function(event) {
    if (event.keyCode === 13) {
      hoodie.store.update('chat', $(this).parent().data('id'), {title: event.target.value}).publish();
    }
  });

  // Find index/position of a chat in collection.
  function getChatItemIndexById(id) {
    for (var i = 0, len = collection.length; i < len; i++) {
      if (collection[i].id === id) {
        return i;
      }
    }
    return null;
  }

  function paint() {
    $el.html('');
    collection.sort(function(a, b) {
      return ( a.createdAt > b.createdAt ) ? 1 : -1;
    });
    for (var i = 0, len = collection.length; i<len; i++) {
      if (collection[i].user) {
        var date = collection[i].date.replace('T', ' '),
            idx = date.indexOf('.');
        date = date.substr(0, idx);
        $el.append(
          '<li data-id="' + collection[i].id + '">' +
            collection[i].user + ': ' +
            collection[i].message + ' ' +
            '(' + date + ')' +
          '</li>'
        );
      }
    }
  }

  this.add = function(chat) {
    for (var i = 0; i < collection.length; i++) {
      if (collection[i].id == chat.id) {
        return;
      }
    }
    collection.push(chat);
    paint();
  };

  this.update = function(chat) {
    collection[getChatItemIndexById(chat.id)] = chat;
    paint();
  };

  this.remove = function(chat) {
    collection.splice(getChatItemIndexById(chat.id), 1);
    paint();
  };

  this.clear = function() {
    collection = [];
    paint();
  };
}

// Instantiate Chats collection & view.
var chats = new Chats($('#chatlist'));

// initial load of all chat items from the store
hoodie.global.findAll('chat').then(function(allChats) {
  allChats.forEach(chats.add);
});

// when a chat changes, update the UI.
hoodie.global.on('chat:add', chats.add);
hoodie.global.on('chat:update', chats.update);
hoodie.global.on('chat:remove', chats.remove);
// clear chats when user logs out,
hoodie.account.on('signout', chats.clear);


// handle creating a new task
$('#chatinput').on('keypress', function(event) {
  // ENTER & non-empty.
  var msgText = event.target.value;
  if (event.keyCode === 13 && msgText.length) {
    var msg = new messageModel(msgText);
    hoodie.store.add('chat', msg).publish();
    event.target.value = '';
  }
});
