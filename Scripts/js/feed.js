/**
 * Developed By Nesrine El Ghoul
 */

var postUrl = "/Publication/MyFeed/List",
    postUrlCreate = "/Publication/Create",
    commentUrl = "Comment";

function Post(data) {
    var self = this;
    data = data != "Bad Request" ? data : {}; // if data is null => init to empty object

    self.PostId = data.PostId;
    self.Content = ko.observable(data.Content || "");
    self.Author = data.Author || "";
    self.AuthorName = data.AuthorName || "";
    self.AuthorAvatar = data.AuthorAvatar || "";
    self.DatePosted = getTimeAgo(data.DatePosted); // defined below
    self.error = ko.observableArray();

    self.newCommentContent = ko.observable();
    self.addComment = function() {
        var comment = new Comment();
        comment.PostId = self.PostId;
        comment.Content(self.newCommentContent());
        return $.ajax({
                url: commentUrl,
                dataType: "json",
                contentType: "application/json",
                cache: false,
                type: 'POST',
                data: ko.toJSON(comment)
            })
            .done(function(result) {
                self.PostComments.push(new Comment(result));
                self.newCommentContent('');
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                console.log("Could not add your post. " + textStatus);
            });
    }

    if (data.PostComments) {
        var mappedPosts = $.map(data.PostComments,
            function(elt) {
                return new Comment(elt);
            });
        self.PostComments(mappedPosts);
    }

    self.toggleComment = function(elt, event) {
        $(event.target)
            .next()
            .find('.addCommentToPost')
            .toggle();
    }
}

function Comment(data) {
    var self = this; // the comment at hand

    // Properties that are persisted
    self.CommentId = data.CommentId;
    self.PostId = data.PostId;
    self.Content = ko.observable(data.Content || "");
    self.Author = data.Author || "";
    self.AuthorAvatar = data.AuthorAvatar || "";
    self.AuthorName = data.AuthorName || "";
    self.DateCommented = getTimeAgo(data.DateCommented);
    self.error = ko.observable();
}

function getTimeAgo(varDate) {
    if (varDate) {
        return $.timeago(varDate.toString().slice(-1) == 'Z' ? varDate : varDate + 'Z');
    }
    else {
        return '';
    }
}


function viewModel() {
    var self = this;

    self.Posts = ko.observableArray();
    self.newContent = ko.observable();
    self.error = ko.observable();
    self.loadPosts = function () {
        // Load Existing Posts
        $.ajax({
                url: postUrl,
                dataType: "json",
                contentType: "application/json",
                cache: false,
                type: 'GET'
            })
            .done(function(data) {
                var mappedPosts = $.map(data,
                    function(elt) {
                        return new Post(elt);
                    });
                self.Posts(mappedPosts);
            })
            .fail(function (data, jqXHR, textStatus, errorThrown) {
                console.log("Could not load posts for some reason." + textStatus + errorThrown);
                console.log(data);
            });
    }

    self.addPost = function() {
        var post = new Post();
        post.Content(self.newContent());

        return $.ajax({
                url: postUrlCreate,
                dataType: "json",
                contentType: "application/json",
                cache: false,
                type: 'POST',
                data: ko.toJSON(post)
            })
            .done(function(rslt) {
                self.Posts.splice(0, 0, new Post(rslt));
                self.newContent('');
            })
            .fail(function() {
                console.log("Could not add post.");
            });
    }

    self.loadPosts();

    return self;
}


// Autpresize TextArea To fit the Content
ko.bindingHandlers.jqAutoresize = {
    init: function(elt, valueAccessor, aBA, vm) {
        if (!$(elt).hasClass('contentTextArea')) {
            $(elt).css('height', '1em');
        }

        $(elt).autosize();
    }
};

ko.applyBindings(new viewModel());