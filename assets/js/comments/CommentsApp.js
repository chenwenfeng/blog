var CommentsApp = function(container, model) {
  this.container_ = container;
  this.model_ = model;

  this.init_();
};

CommentsApp.prototype.init_ = function() {
  var self = this;
  $(this.container_).find('.comment-send').click(function(e) {
    var ni = $(self.container_).find('.comment-name');
    var name = ni.val();
    var ei = $(self.container_).find('.comment-email');
    var email = ni.val();
    var mi = $(self.container_).find('.comment-text');
    var text = mi.val().trim();
    if (text == '') {
      mi.focus();
      return false;
    }

    self.model_.sendMessage(email, name, text);
    mi.val('');
  });

  this.model_.addMessageListener(function(messages) {
    self.renderMessages_(messages);
  });

  this.model_.init();
};

CommentsApp.prototype.renderMessages_ = function(messages) {
  var list = $(this.container_).find('.comments-container');
  list.empty();
  messages.forEach(function(message) {
    var time = new Date(message['time']);
    var formatDate = time.toTimeString().split(' ')[0];
    $('<pre/>')
        .append($('<span class="name"/>').text(message['name']))
        .append($('<span class="email"/>').text(message['email']))
        .append($('<span class="time"/>').text(formatDate))
        .append($('<div class="comment-body"/>').text(message['text']))
        .appendTo(list);
  }, this);
  list[0].scrollTop = list[0].scrollHeight;
};
