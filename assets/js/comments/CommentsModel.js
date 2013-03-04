var CommentsModel = function(baseRef) {
  this.baseRef_ = baseRef;
  this.messagesRef_ = this.baseRef_.child('comments');
  this.listeners_ = [];
};

CommentsModel.prototype.init = function() {
  if (this.inited_) {
    return;
  }
  this.inited_ = true;

  // listen on messages value change
  this.messagesRef_.on('value', function(snapshot) {
    var messages = [];
    if (snapshot.val()) {
      snapshot.forEach(function(messageSnapshot) {
        var message = messageSnapshot.val();
        message['_id'] = messageSnapshot.name();
        messages.push(message);
      });
    }
    this.doMessagesUpdated_(messages);
  }, this);
};


CommentsModel.prototype.sendMessage = function(email, name, text) {
  var ref = this.messagesRef_.push({
    'email': email || 'anonymity',
    'name': name || 'anonymity',
    'text': text,
    'time': new Date().getTime(),
  });
};

CommentsModel.prototype.addMessageListener = function(messageListener) {
  this.listeners_.push(messageListener);
};

CommentsModel.prototype.doMessagesUpdated_ = function(messages) {
  this.listeners_.forEach(function(listener) {
    try {
      listener.call(null, messages);
    } catch (e) {
      console.error(e);
    }
  });
};

