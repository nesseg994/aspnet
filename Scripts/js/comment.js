(function () {
    // Add Comment
    $(function() {
        $('body').delegate('.commentBtn',
            'click',
            function(e) {
                e.preventDefault();
                var url = "/api/Commentaire";
                var id = $(this).attr("data-post-id");
                var content = $("#commentInputContent" + id).val();
                var html = '';
                //if (isProfane(content)) {
                //    html = '<div class="alert alert-danger">' +
                //        '<strong>Opps!</strong> vous avez utilisé des mots inappropriés' +
                //        '       </div>';

                //} else
                if (!content.length) {
                    html = '<div class="alert  alert-info">' +
                        '<strong>Info!</strong> Nope, type something in there .. sure you have something to say :) ' +
                        '       </div>';

                } else {

                    var datum = {
                        Content: content,
                        PostId: id
                    };

                    var comment = new Comment(datum);

                    $.ajax({
                            url: url,
                            dataType: "json",
                            contentType: "application/json",
                            cache: false,
                            method: 'POST',
                            data: ko.toJSON(comment)
                        })
                        .done(function(newComment) {
                            var len = +($(".commentCount[data-post-id=" + id + "]").text());
                            $(".commentCount[data-post-id=" + id + "]").html(len + 1);
                            console.log("here " + len);

                            var comment = jQuery.parseJSON(newComment);
                            var idUser = comment.CurrentUser.Id; // !!!!
                            console.log("Bad " + comment.Censored);

                            // Define months enum
                            Date.shortMonths = [
                                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                            ];

                            var date = new Date(parseInt(comment.DatePosted.substr(6)));

                            var dateTime = date.getDay() +
                                '-' +
                                Date.shortMonths[date.getMonth()] +
                                '-' +
                                date.getFullYear() +
                                ' ' +
                                date.getHours() +
                                ':' +
                                date.getMinutes() +
                                ':' +
                                date.getSeconds();

                            var html = '  <li class="has-children" id="comment' +
                                comment.CommentId +
                                '">' +
                                '  <ul class="children"  >' +
                                '      <li>' +
                                '          <div class="author-date">' +
                                '               <a class="h6 post__author-name fn" href="#">' +
                                comment.AuthorName +
                                '</a>' +
                                '               <div class="post__date">' +
                                '                   <time class="published" datetime="2017-03-24T18:18">' +
                                dateTime +
                                '                   </time>' +
                                '               </div>' +
                                '       <label id="cheatingcommentEdited' +
                                comment.CommentId +
                                '" class="reply" ></label>';

                            //if (comment.dateModification !== null) {
                            //    html += '       <label id="commentEdited' + comment.CommentId + '" class="reply" >modifié</label>';

                            //}


                            html += '    </div>' +
                                '          <a href="#" class="more"><svg class="olymp-three-dots-icon"><use xlink:href="#olymp-three-dots-icon"></use></svg></a>\n';
                            if (comment.AuthorId === idUser) // !!!!!!! 
                            {
                                html += '<p class="commentInputEditable" contenteditable="true" data-post-id="' +
                                    id +
                                    '"  data-comment-id="' +
                                    comment.CommentId +
                                    '" id="commentContent' +
                                    comment.CommentId +
                                    '">' +
                                    comment.Content +
                                    '</p>';

                                html +=
                                    '        <a href="#" class="deleteComment" data-post-id="' +
                                    id +
                                    '" data-comment-id="' +
                                    comment.CommentId +
                                    '" ><span class="ti-trash"></span></a>';
                            } else {
                                html += '<p class="commentInputEditable" contenteditable="false" data-post-id="' +
                                    id +
                                    '"  data-comment-id="' +
                                    comment.CommentId +
                                    '" id="commentContent' +
                                    comment.CommentId +
                                    '">' +
                                    comment.Content +
                                    '</p>';
                            }

                            html += '   </li>' +
                                '       </ul>' +
                                '       </li>';

                            //$(html).after($(".comment-form[data-post-id=" + id + "]")).toggle("slow");
                            $('.commentsList[data-post-id=' + id + ']').hide().prepend(html).fadeIn("slow"); // meh
                            $("#commentInputContent" + id).html('Say something else ..');
                            //$('.commentsList[data-post-id=' + id + '].item:first-child').fadeIn();
                        })
                        .fail(function() {
                            console.log("Could not add comment.");
                        });

                }
                $('.badwordAlertDiv[data-post-id=' + id + ']').html(html);
                return false;
            });
    });

    // Delete Comment
    $(function() {
        $('body').delegate('.deleteComment',
            'click',
            function(e) {
                e.preventDefault();

                var commentId = $(this).attr("data-comment-id");
                var postId = $(this).attr('data-post-id');
                console.log("comment Id " + commentId);
                var url = "/api/Commentaire/" + commentId;

                Swal.fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
                }).then((result) => {
                    if (result.value) {
                        $.ajax({
                                url: url,
                                dataType: "json",
                                contentType: "application/json",
                                cache: false,
                                method: 'DELETE'
                            })
                            .done(function(response) {
                                var msg = jQuery.parseJSON(response);
                                console.log(msg);

                                if (msg === "Deleted") {
                                    Swal.fire(
                                        'Deleted!',
                                        'Your comment has been deleted.',
                                        'success'
                                    );

                                    // remove from comments list
                                    $("#comment" + commentId).remove();

                                    // Decrement comment count
                                    var len = +($(".commentCount[data-post-id=" + postId + "]").text());
                                    $(".commentCount[data-post-id=" + postId + "]").html(len - 1);
                                } else {
                                    Swal.fire(
                                        'Couldn\'t Delete Your Comment !',
                                        'Hmm, I wonder why :/',
                                        'error'
                                    );
                                }

                            })
                            .fail(function(xhr, status, error) {
                                console.log("Could not delete comment. " + status + " " + error);
                                Swal.fire(
                                    'Something Went Wrong !',
                                    'Hmm, I wonder why :/',
                                    'error'
                                );
                            });

                    }
                });

            });
    });

    // Edit Comment
    $(function() {
        var b4EditText;
        var testEmpty = false; // should be here not inside function else reset
        $('body').delegate('.commentInputEditable[contenteditable]',
            'focus',
            function() {
                var $this = $(this);
                b4EditText = $this.html();
                console.log("Editable");
                $this.data('before', $this.html());
            }).on('blur keyup paste input',
            '.commentInputEditable[contenteditable]',
            function() {
                var $this = $(this);
                //var b4EditText = $this.html();
                if ($this.data('before') !== $this.html()) {
                    $this.data('before', $this.html());
                    $this.trigger('change');
                    console.log("Editable 2");


                    $this.keypress(function(event) {
                        console.log("Editable 3");
                        var keycode = (event.keyCode ? event.keyCode : event.which);
                        console.log("keycode " + keycode);
                        if (keycode === 13 || !$this.is(event.target)) {
                            event.preventDefault(); // prevent from returning to new line
                            console.log("Editable 4");
                            //alert('You pressed a "enter" key in textbox');

                            // Test if field is empty
                            if (!$this.html().length) {
                                $this.html(b4EditText);
                                var postId = $this.attr('data-post-id');
                                var html = '<div class="alert  alert-info">' +
                                    '<strong>Info!</strong> Shouldn\'t leave it empty ' +
                                    '       </div>';
                                $('.badwordAlertDiv[data-post-id=' + postId + ']').html(html);
                                testEmpty = true; // else it will get to the else clause
                            } else if (!testEmpty) {
                                var commentId = $this.attr('data-comment-id');
                                var comment = $this.html();
                                var url = "/api/Commentaire/" + commentId;
                                $.ajax({
                                        url: url,
                                        dataType: "json",
                                        contentType: "application/json",
                                        cache: false,
                                        method: 'PUT',
                                        data: ko.toJSON(comment)
                                    })
                                    .done(function(response) {
                                        console.log("response edit " + response);
                                        $this.blur(); // get out of focus
                                    })
                                    .fail(function() {
                                        console.log("Could not edit comment.");
                                    });
                            }
                        }

                    });
                }
            });
    });

    // Display Comments
    function onClickBtnComments(postId, url) {
        // Comment Section | Input Section
        var html = '<form class="comment-form inline-items" data-post-id="' + postId + '">' +
            ' <table {#border="1"#}>' +
            '     <tr>' +
            '       <td colspan="4"  width="500px">' +
            '           <div class="form-group with-icon-right is-empty">' +
            '               <grammarly-ghost spellcheck="true"><div style="position: absolute; color: transparent; overflow: hidden; white-space: pre-wrap; box-sizing: border-box; height: 60px; width: 312.967px; z-index: 0;  border-style: solid; padding: 17.6px 60px 17.6px 17.6px; margin-left: 0px; margin-bottom: 0px; margin-right: 0px; background: rgba(0, 0, 0, 0) none repeat scroll 0% 0%; top: 0px; left: 0px;" data-id="b4ce3a22-b651-420e-9977-c0eeb9e6a1c8" data-gramm_id="b4ce3a22-b651-420e-9977-c0eeb9e6a1c8" data-gramm="gramm" data-gramm_editor="true" class="gr_ver_2" gramm="true" contenteditable="true"></div></grammarly-ghost>' +
            '<textarea id="commentInputContent' +
            postId +
            '" class="form-control commentText" data-post-id="' +
            postId +
            '" placeholder="What do you think about that ? " data-gramm="true" data-txt_gramm_id="b4ce3a22-b651-420e-9977-c0eeb9e6a1c8" data-gramm_id="b4ce3a22-b651-420e-9977-c0eeb9e6a1c8" spellcheck="false" data-gramm_editor="true" style="background: transparent none repeat scroll 0% 0% !important; z-index: auto; position: relative; line-height: 21px; font-size: 14px; transition: none 0s ease 0s;"></textarea>' +
            '                <span class="material-input"></span><span class="material-input"></span><span class="material-input"></span>' +
            '  </div>' +
            '       <td>' +
            '            <a class="btn btn-green btn-sm commentBtn" data-post-id="' +
            postId +
            '" href="#">commenter<div class="ripple-container"></div></a>' +
            '       </td>' +
            '      <div data-post-id="' + postId + '" class="badwordAlertDiv"></div>' +
            '     </tr>' +
            '   </table>' +
            '   </form>';

        //axios.get(url).then(function (response) {
        $.ajax({
            url: url,
            dataType: "json",
            contentType: "application/json",
            cache: false,
            method: 'GET'
        })
            .done(function (response) {
                console.log("Hello");
                var newResponse = jQuery.parseJSON(response); // !!!!
                var id = newResponse.PostId;
                //var comments = document.querySelector('#comments-list' + id);
                var comments = $(".comments-list[data-id=" + id + "]");
                //console.log("Well " + comments.attr("data-id"));
                console.log(newResponse.Message);

                comments.html('');

                html += "<ul class='commentsList' data-post-id='" + id + "'>";
                if (newResponse.Message !== "Hmm something's gotta give.") {
                    var commentsData = newResponse.Comments;
                    //console.log("Comments " + commentsData);
                    console.log("Id " + newResponse.CurrentUser.Id);
                    var idUser = newResponse.CurrentUser.Id; // !!!!
                    // Define months enum
                    Date.shortMonths = [
                        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                    ];

                    if (commentsData !== undefined && commentsData !== null) {
                        console.log("Here4");
                        commentsData.forEach(function (comment, index) {
                            console.log("Hey " + comment.AuthorName);
                            console.log("Hey 2 " + comment.CommentId);
                            var date = new Date(parseInt(comment.DatePosted.substr(6)));

                            var dateTime = date.getDay() +
                                '-' +
                                Date.shortMonths[date.getMonth()] +
                                '-' +
                                date.getFullYear() +
                                ' ' +
                                date.getHours() +
                                ':' +
                                date.getMinutes() +
                                ':' +
                                date.getSeconds();

                            html += '  <li class="has-children" id="comment' +
                                comment.CommentId +
                                '">' +
                                '  <ul class="children"  >' +
                                '      <li>' +
                                '          <div class="author-date">' +
                                '               <a class="h6 post__author-name fn" href="#">' +
                                comment.AuthorName +
                                '</a>' +
                                '               <div class="post__date">' +
                                '                   <time class="published" datetime="2017-03-24T18:18">' +
                                dateTime +
                                '                   </time>' +
                                '               </div>' +
                                '       <label id="cheatingcommentEdited' +
                                comment.CommentId +
                                '" class="reply" ></label>';

                            //if (comment.dateModification !== null) {
                            //    html += '       <label id="commentEdited' + comment.CommentId + '" class="reply" >modifié</label>';

                            //}


                            html += '    </div>' +
                                '          <a href="#" class="more"><svg class="olymp-three-dots-icon"><use xlink:href="#olymp-three-dots-icon"></use></svg></a>\n';
                            if (comment.AuthorId === idUser) // !!!!!!! 
                            {
                                html += '<p class="commentInputEditable" contenteditable="true" data-post-id="' + id + '" data-comment-id="' + comment.CommentId + '" id="commentContent' +
                                    comment.CommentId +
                                    '">' +
                                    comment.Content +
                                    '</p>';

                                html +=
                                    '        <a href="#" class="deleteComment" data-post-id="' +
                                    id +
                                    '" data-comment-id="' +
                                    comment.CommentId +
                                    '" ><span class="ti-trash"></span></a>';

                            } else {
                                html += '<p class="commentInputEditable" contenteditable="false" data-post-id="' + id + '"  data-comment-id="' + comment.CommentId + '" id="commentContent' +
                                    comment.CommentId +
                                    '">' +
                                    comment.Content +
                                    '</p>';
                            }


                            html += '   </li>' +
                                '       </ul>' +
                                '       </li>';
                        });
                    }
                }

                html += "</ul>";
                console.log("Hello2");
                comments.append(html);
                //console.log("comments " + comments.innerHTML);
                //$(".commentCount[data-post-id=" + id + "]").html(commentsData.length);

                // Toggle visibility
                //if ($(".comments-list[data-id=" + id + "]").css('visibility') === 'hidden') {
                //    $(".comments-list[data-id=" + id + "]").css('visibility', 'visible');
                //    console.log("Visible");

                //    // Disable button as long as input is empty

                //} else {
                //    $(".comments-list[data-id=" + id + "]").css('visibility', 'hidden');

                //}
                //$(".comments-list[data-id=" + id + "]").toggle("slow");
                console.log("Hello3");
                comments.toggle("slow");
            })
            .fail(function (xhr, test, error) {
                console.log("Could not display comments. " + error);
            });
    }

    $('body').delegate('a.js-comments', 'click', function (e) { // must be delegate
        e.preventDefault();

        //var url =  this.href;
        var postId = $(this).attr("data-post-id");
        var url = "/api/Commentaire/" + postId;
        console.log("id " + postId);

        onClickBtnComments(postId, url);
    });

    //document.querySelectorAll('a.js-comments').forEach(function (link) {
    //    link.addEventListener('click', onClickBtnComments);
    //});

    function Comment(data) {
        var self = this; // the comment at hand

        // Properties that are persisted
        self.PostId = data.PostId;
        self.Content = ko.observable(data.Content || "");
        self.error = ko.observable();
    }
})();