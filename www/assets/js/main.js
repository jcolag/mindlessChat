"use strict";
// initialize Hoodie
var hoodie  = new Hoodie();

// Chats Collection/View
function Chats($element) {
  var collection = [];
  var $el = $element;

  // Handle marking chat as "done"
  $el.on('click', 'input[type=checkbox]', function() {
    hoodie.store.remove('chat', $(this).parent().data('id'));
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
      hoodie.store.update('chat', $(this).parent().data('id'), {title: event.target.value});
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
      $el.append(
        '<li data-id="' + collection[i].id + '">' +
          '<input type="checkbox"> <label>' + collection[i].title + '</label>' +
          '<input type="text" value="' + collection[i].title + '"/>' +
        '</li>'
      );
    }
  }

  this.add = function(chat) {
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
hoodie.store.findAll('chat').then(function(allChats) {
  allChats.forEach(chats.add);
});

// when a chat changes, update the UI.
hoodie.store.on('chat:add', chats.add);
hoodie.store.on('chat:update', chats.update);
hoodie.store.on('chat:remove', chats.remove);
// clear chats when user logs out,
hoodie.account.on('signout', chats.clear);


// handle creating a new task
$('#chatinput').on('keypress', function(event) {
  // ENTER & non-empty.
  if (event.keyCode === 13 && event.target.value.length) {
    hoodie.store.add('chat', {title: event.target.value});
    event.target.value = '';
  }
});
