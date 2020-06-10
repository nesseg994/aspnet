(function () {
    var fileData = new FormData();
    var tagsValues;

    // Dragged and Dropped Files
    $(function() {
        $("#drop-area").on("drop",
            function(e) {
                //e.preventDefault(); // Already done in the other file
                e.dataTransfer = e.originalEvent.dataTransfer;
                console.log("I'm here " + e.dataTransfer);

                if (e.dataTransfer != undefined) {
                    console.log("defined " + e.dataTransfer.items);
                    if (e.dataTransfer.items) {
                        // Use DataTransferItemList interface to access the file(s)
                        for (var i = 0; i < e.dataTransfer.items.length; i++) {
                            // If dropped items aren't files, reject them
                            if (e.dataTransfer.items[i].kind === 'file') {
                                var file = e.dataTransfer.items[i].getAsFile();
                                fileData.append(file.name, file);
                                console.log('... image[' + i + '].name = ' + file.name);
                            }
                        }
                    } else {
                        // Use DataTransfer interface to access the file(s)
                        for (var j = 0; j < e.dataTransfer.files.length; j++) {
                            console.log('... file[' + j + '].name = ' + e.dataTransfer.files[j].name);
                        }
                    }
                } else {
                    console.log("It's undefined Yo");
                }
            });

    });

    // Edit Post
    $(function() {
        var b4EditTextPost;
        var testEmptyPost = false;


        //$(document).on('keydown', function (e) {
        //    console.log("I'm sick of this");
        //    if ($(".postInputEditable[contenteditable]").is(":focus")) {
        //        //var keyCode = e.keyCode || e.which;
        //        var keyCode = (e.keyCode ? e.keyCode : e.which);

        //        console.log("Damn it work already !! " + e.which);

        //        if (e.which === 27) {
        //            console.log("Damn it !!");
        //            e.preventDefault();
        //        }
        //    }
        //});


        //$('body').delegate('.postInputEditable[contenteditable]', 'keypress', function (e) {
        //    var keyCode = e.keyCode || e.which;

        //    var $this = $(this);
        //    b4EditTextPost = $this.html();
        //    console.log("Editable");
        //    $this.data('before', $this.html());

        //    if (keyCode === 13) { 
        //        e.preventDefault();

        //        if ($this.data('before') !== $this.html()) {
        //            $this.data('before', $this.html());
        //            $this.trigger('change');
        //            console.log("Editable 2");

        //            var postId = $this.attr('data-post-id');
        //            // Test if field is empty
        //            if (!$this.html().length) {
        //                $this.html(b4EditTextPost);
        //                var html = '<div class="alert  alert-info">' +
        //                    '<strong>Info!</strong> Shouldn\'t leave it empty ' +
        //                    '       </div>';
        //                $('.postAlertDiv[data-post-id=' + postId + ']').html(html);
        //                testEmptyPost = true; // else it will get to the else clause
        //            } else if (!testEmptyPost) {
        //                var postContent = $this.html();
        //                var postContentTrimmed = postContent.replace(/(\r\n|\n|\r)/gm, "");
        //                var editedPost = new Post(postContent);
        //                console.log("edited post " + postContent);

        //                var url = "/api/Publication/" + postId;
        //                $.ajax({
        //                    url: url,
        //                    dataType: "json",
        //                    contentType: "application/json",
        //                    cache: false,
        //                    method: 'PUT',
        //                    data: ko.toJSON(postContentTrimmed)
        //                })
        //                    .done(function (response) {
        //                        console.log("response edit " + response);
        //                        $this.blur(); // get out of focus
        //                    })
        //                    .fail(function () {
        //                        console.log("Could not edit post.");
        //                    });
        //            }
                    
        //        }

        //        return false;
        //    }
        //});




        $('body').delegate('.postInputEditable[contenteditable]',
            'focus',
            function() {
                var $this = $(this);
                b4EditTextPost = $this.html();
                console.log("Editable");
                $this.data('before', $this.html());
            }).on('blur keyup paste input',
            '.postInputEditable[contenteditable]',
            function(event) {
                var $this = $(this);
                var keycode = (event.keyCode ? event.keyCode : event.which);

                console.log("Keycode 1 " + keycode);
                //var b4EditText = $this.html();
                if (keycode === 27 || !$this.is(event.target)) { // escape key
                    if ($this.data('before') !== $this.html()) {
                        $this.data('before', $this.html());
                        $this.trigger('change');
                        console.log("Editable 2");

                    
                        //event.preventDefault(); 
                        console.log("Editable 4");

                        var postId = $this.attr('data-post-id');
                        // Test if field is empty
                        if (!$this.html().length) {
                            $this.html(b4EditTextPost);
                            var html = '<div class="alert  alert-info">' +
                                '<strong>Info!</strong> Shouldn\'t leave it empty ' +
                                '       </div>';
                            $('.postAlertDiv[data-post-id=' + postId + ']').html(html);
                            testEmptyPost = true; // else it will get to the else clause
                        } else if (!testEmptyPost) {
                            var postContent = $this.html();
                            var postContentTrimmed = postContent.replace(/(\r\n|\n|\r)/gm, "").replace(/[<]br[^>]*[>]/gi, "");
                            var editedPost = new Post(postContent);
                            console.log("edited post " + postContent);

                            var url = "/api/Publication/" + postId;
                            $.ajax({
                                url: url,
                                dataType: "json",
                                contentType: "application/json",
                                cache: false,
                                method: 'PUT',
                                data: ko.toJSON(postContentTrimmed)
                            })
                                .done(function (response) {
                                    console.log("response edit " + response);
                                    $this.blur(); // get out of focus
                                })
                                .fail(function () {
                                    console.log("Could not edit post.");
                                });
                        }
                    }

                    //$this.keypress(function(event) {
                    //    console.log("Editable 3");
                    //    var keycode = (event.keyCode ? event.keyCode : event.which);
                    //    console.log("keycode " + keycode);
                    //    if (keycode === 27 || !$this.is(event.target)) { // escape key
                    //        //event.preventDefault(); 
                    //        console.log("Editable 4");

                    //        var postId = $this.attr('data-post-id');
                    //        // Test if field is empty
                    //        if (!$this.html().length) {
                    //            $this.html(b4EditTextPost);
                    //            var html = '<div class="alert  alert-info">' +
                    //                '<strong>Info!</strong> Shouldn\'t leave it empty ' +
                    //                '       </div>';
                    //            $('.postAlertDiv[data-post-id=' + postId + ']').html(html);
                    //            testEmptyPost = true; // else it will get to the else clause
                    //        } else if (!testEmptyPost) {
                    //            var postContent = $this.html();
                    //            var postContentTrimmed = postContent.replace(/(\r\n|\n|\r)/gm, "");
                    //            var editedPost = new Post(postContent);
                    //            console.log("edited post " + postContent);

                    //            var url = "/api/Publication/" + postId;
                    //            $.ajax({
                    //                url: url,
                    //                dataType: "json",
                    //                contentType: "application/json",
                    //                cache: false,
                    //                method: 'PUT',
                    //                data: ko.toJSON(postContentTrimmed)
                    //            })
                    //                .done(function (response) {
                    //                    console.log("response edit " + response);
                    //                    $this.blur(); // get out of focus
                    //                })
                    //                .fail(function () {
                    //                    console.log("Could not edit post.");
                    //                });
                    //        }
                    //    }

                    //});
                }
            });
    });

    // Delete Post
    $(function () {
        $('body').delegate('.deletePost',
            'click',
            function (e) {
                e.preventDefault();

                var postId = $(this).attr('data-post-id');
                console.log("post Id " + postId);
                var url = "/api/Publication/" + postId;

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
                            .done(function (response) {
                                var msg = jQuery.parseJSON(response);
                                console.log(msg);

                                if (msg === "Deleted") {
                                    Swal.fire(
                                        'Deleted!',
                                        'Your Post has been deleted.',
                                        'success'
                                    );

                                    // remove from comments list
                                    $("article[data-post-id=" + postId + "]").remove();
                                    $(".postAlertDiv[data-post-id=" + postId + "]").remove();

                                } else {
                                    Swal.fire(
                                        'Couldn\'t Delete Your Post !',
                                        'Hmm, I wonder why :/',
                                        'error'
                                    );
                                }

                            })
                            .fail(function (xhr, status, error) {
                                console.log("Could not delete post. " + status + " " + error);
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

    // Scrollbar
    //$("#modalPostForm").on( "shown", function () {
    $(".modal-body").mCustomScrollbar({
        theme: "my-theme",
        scrollEasing: "easeOut",
        scrollInertia: 100
    });
    //});

    // initialize with defaults
    $("#input-image-upload").fileinput();

    // with plugin options
    $("#input-image-upload").fileinput({ 'showUpload': false, 'previewFileType': 'any' });

    // Init Tags
    $("#tags").tagit({
        tagLimit: 10,
        placeholderText: "Tag It !"
        //createTag: "tagsStyle"
        //afterTagAdded: function (evt, ui) {
        //    var tag = $('#tags').tagit("tagLabel", ui.tag);
        //    var color = 'red';
        //    console.log("Outside");
        //    if (tag === 'open') {
        //        console.log("Inside");
        //        color = 'black';
        //    }
        //    ui.tag.css('background-color', color);
        //}
    });
    $("#tagsSearch").tagit({
        tagLimit: 10,
        placeholderText: "Search Tag"
    });
    //$("#tags").tagit("createTag", "tagsStyle");
    // Center text of tag input
    $('.ui-widget-content.ui-autocomplete-input[placeholder="Tag It !"]').css("text-align", "center").css("margin-left", "105px");
    $('.ui-widget-content.ui-autocomplete-input[placeholder="Search Tag"]').css("text-align", "center").css("margin-left", "105px");
    $("#tags").tagit({
        afterTagAdded: function (event, ui) {
            console.log("Outside "  + event.type);
            console.log("Outside 2 " + ui);

            var colors = ['#f58220', '#97c224', '#de3f3e', '#ec008c', "#00a6df", "#222"];
            var randomColor = colors[Math.floor(Math.random() * colors.length)];
            $("li.tagit-choice").css("background-color", randomColor);
            $("li.tagit-choice").css("border-color", randomColor);
            //$("li.tagit-choice").css("border-color", "transparent " + randomColor + " transparent transparent");
            //document.styleSheets[0].addRule('li.tagit-choice:before', 'border-color: transparent "' + randomColor + '" transparent transparent;');
            //$("li.tagit-choice").addClass("tag-added");
            //$('<style>li.tagit-choice.tag-added:before{border-color: transparent ' + randomColor + ' transparent transparent;}</style>').appendTo('head');
        }
    });
    $("#tagsSearch").tagit({
        afterTagAdded: function (event, ui) {
            console.log("Outside " + event.type);
            console.log("Outside 2 " + ui);

            var colors = ['#f58220', '#97c224', '#de3f3e', '#ec008c', "#00a6df", "#222"];
            var randomColor = colors[Math.floor(Math.random() * colors.length)];
            $("li.tagit-choice").css("background-color", randomColor);
            $("li.tagit-choice").css("border-color", randomColor);
        }
    });

    // Add Post
    $(function() {
        $('#addPostBtn').click(
            function (e) {
                e.preventDefault();
                var url = "/Publication/Upload";
                var content = $("#txtMessage").val();
                tagsValues = $("#tags").tagit("assignedTags");
                //var tagsValuesArray = tagsValues.split(',');
                var html = '';
                console.log('tags array ' + tagsValues);

                if (!content.length || !tagsValues.length) { 
                    html += (!content.length)
                        ? '<div class="alert  alert-info">' +
                        '<strong>Info!</strong> Nope, type something in there .. sure you have something to say :) ' +
                        '       </div>'
                        : (!tagsValues.length)
                        ? '<div class="alert  alert-info">' +
                        '<strong>Info!</strong> Come on, tag it ! :) ' +
                        '       </div>'
                        : '';
                    $('.validation-summary-errors').html(html);
                } else {

                    //var datum = {
                    //    Content: content
                    //    //Images: fileData
                    //};

                    //var post = new Post(datum);

                    // Get chosen files
                    //var files = $("#fileElem").get(0).files;
                    var files = $('#fileElem').prop("files"); // get all the selected files

                    // Append content & tags to formData
                    fileData.append("Content", content);
                    fileData.append("Tags", tagsValues);

                    console.log("files length " + files.length);

                    if (files.length > 0) {
                        if (window.FormData !== undefined) {
                            for (var i = 0; i < files.length; i++) {
                                fileData.append(files[i].name, files[i]);
                                console.log("file " + i + " " + files[i].name);
                            }
                        }
                    }

                    console.log("files " + files);
                    console.log("fileData " + fileData);

                    $.ajax({
                        url: url,
                        dataType: "json",
                        //contentType: "application/json",
                        cache: false,
                        method: 'POST',
                        data: fileData,
                        contentType: false,
                        processData: false
                        //data: ko.toJSON(fileData)
                })
                        .done(function (response) {
                            //var reply = jQuery.parseJSON(response);
                            console.log("Data Added " + response);
                            var html = onSuccessAddPost(response, "#modalPostForm", undefined);

                            $('#articles').prepend(html);
                        })
                        .fail(function (xhr, status, error) {
                            onFailureAddPost(xhr, status, error);
                        });

                }
            });
    });

    // Add/Remove Like
    $("body").delegate("i.js-likes",
        "click",
        function (e) {
            e.preventDefault();
            var url;
            var postId = $(this).parent().attr("data-post-id");
            console.log("Posttttt " + postId);
            var type;
            var data;
            var icon = this;
            var div = $(".names-people-likes[data-post-id='" + postId + "']");

            if (icon.classList.contains('fa')) { // Remove Like
                url = "/api/Appreciation/" + postId; // need the / b4 api

                $.ajax({
                        url: url,
                        dataType: "json",
                        cache: false,
                        method: 'DELETE',
                        contentType: false,
                        processData: false,
                        //data: ko.toJSON(data)
                    })
                    .done(function (response) {
                        var reply = jQuery.parseJSON(response);
                        if (reply === "Deleted") {
                            console.log("likes " + reply);

                            // Change the icon
                            icon.classList.replace('fa-heart', 'ti-heart');
                            icon.classList.remove('fa');

                            // Update the number of likes
                            $(".i-like-it[data-post-id='" + postId + "']").remove();
                            // Check if only that user liked it
                            console.log(div.text());
                            if (div.text().trim() === "liked this" || div.text().trim().length === 0) {
                                div.empty();
                                div.prepend("<span>Be the first to like this</span>");
                                console.log("empty");
                            }
                        } else {
                            console.log("Something's amiss");
                        }
                    })
                    .fail(function (xhr, status, error) {
                        console.log("Failed to Like " + xhr + " " + status + " " + error);
                    });

            } else if (icon.classList.contains('ti-heart')) { // Like
                url = "/api/Appreciation";

                console.log("Here Like Like");

                type = "Like";

                data = {
                    PostId: postId,
                    Type: type
                };

                $.ajax({
                        url: url,
                        dataType: "json",
                        cache: false,
                        method: 'POST',
                        contentType: "application/json",
                        data: ko.toJSON(postId)
                    })
                    .done(function (response) {
                        //var reply = jQuery.parseJSON(response);
                        console.log("likes " + response);
                        console.log("likesss " + icon.classList);

                        // Change the icon
                        icon.classList.add('fa');
                        icon.classList.replace('ti-heart', 'fa-heart');

                        // Update the number of likes
                        if (div.children().eq(0).text() === "Be the first to like this") {
                            div.children().remove();
                            div.prepend("<a href='#' class='i-like-it' data-post-id='"+ postId +"'>you liked this </a>");
                        } else {
                            $(".names-people-likes[data-post-id='" + postId + "']").prepend("<a href='#' class='i-like-it' data-post-id='" + postId + "'>you and </a>");
                        }
                    })
                    .fail(function (xhr, status, error) {
                        console.log("Failed to Like " + xhr + " " + status + " " + error);
                    });
            }
        });

    // Search Image
    $(function() {
        $('#searchImageBtn').click(
            function (e) {
                e.preventDefault();
                var url = "/Publication/UploadImageToSearch";
                var html = '';

                // Show loading screen
                $('#loadingSearch').removeAttr("hidden");
                $('#loadingSearchBG').removeAttr("hidden");

                // Get chosen image file
                var file = $('#imageFileElem').prop("files"); // get all the selected files 

                console.log("File " + file);

                if (file.length > 0) {
                    if (window.FormData !== undefined) {
                        fileData.append(file[0].name, file[0]);
                        console.log("file " + 0 + " " + file[0].name);

                        $.ajax({
                                url: url,
                                dataType: "json",
                                //contentType: "application/json",
                                cache: false,
                                method: 'POST',
                                data: fileData,
                                contentType: false,
                                processData: false
                                //data: ko.toJSON(fileData)
                            })
                            .done(function (response) {
                                //var reply = jQuery.parseJSON(response);
                                console.log("Count files " + response);

                                // Gonna do this cause cannot return an array in a Json response -_-
                                var htmlArray = [];
                                //var elements = response.split("&");
                                //elements.forEach(element => {
                                    var ids = response.split("#");
                                    //var images = ids[1].split(";");
                                    var count = 0;
                                    ids[0] = ids[0].substring(1); // remove the " char else error
                                    //images = images.slice(0, -1);
                                    console.log("First Element " + parseInt(ids[0]));
                                    ids.forEach(id => { // it's not ordered for some bloody reason so I need to order them again -_-
                                        var parsedInt = parseInt(id);
                                        console.log("ID ID ID " + typeof id);
                                        url = "/Publication/Details/" + parsedInt;

                                        $.ajax({
                                            url: url,
                                            dataType: "json",
                                            contentType: "application/json",
                                            cache: false,
                                            method: 'GET',
                                            data: ko.toJSON(id)
                                        })
                                            .done(function (response) {
                                                //var reply = jQuery.parseJSON(response);
                                                console.log("Meow " + response);

                                                var html = onSuccessAddPost(response, "#modalImageSearchForm", undefined);
                                                console.log("HTML 2 " + ids.indexOf(id));
                                                htmlArray.splice(ids.indexOf(id), 0, html);

                                                //$('#articles').prepend(html);

                                                count++; // to count if sent all requests

                                                console.log("HTML 3 " + count);
                                                console.log("HTML 4 " + ids.length);

                                                if (count === ids.length) { // else display  not in order & multiple times
                                                    $('#articles').html('');
                                                    htmlArray.forEach(html => { // if done outside of here => jumps right to it b4 finishing the ajax calls => empty array
                                                        console.log("HTML " + htmlArray);
                                                        $('#articles').append(html);

                                                        // hide loading screen
                                                        //$('#loadingSearch').attr("hidden", true);
                                                    });
                                                }
                                            })
                                            .fail(function (xhr, status, error) {
                                                onFailureAddPost(xhr, status, error);
                                            });

                                    });
                                //});
                                
                            })
                            .fail(function (xhr, status, error) {
                                onFailureAddPost(xhr, status, error);
                            });


                    }
                } else {
                    html += '<div class="alert  alert-info">' +
                        '<strong>Info!</strong> Please select an image to search for the corresponding posts :) ' +
                        '       </div>';

                    $('.validation-summary-errors#imageValidationErrors').html(html);
                }
            });
    });

    // Search Post
    $(function () {
        $('#searchPostBtn').click(
            function (e) {
                e.preventDefault();
                var url = "/api/Publication/Search";
                var html = '';
                console.log("Searching post");

                // Get input values
                var wordsSearch = $("#wordsSearch").val().split(' '); // can be multiple words
                var authorSearch = $("#authorSearch").val().split(' '); // can be multiple authors
                var commentedBySearch = $("#commentedBySearch").val().split(' ');
                var dateSearch = $("#dateSearch").val();
                var tagsSearch = $("#tagsSearch").tagit("assignedTags");
                var likedByMeSearch = $("#likedByMeSearch:checked");
                var popularSearch = $("#popularSearch:checked");

                console.log(wordsSearch + " " + authorSearch + " " + commentedBySearch + " " + dateSearch + " " + tagsSearch + " " + likedByMeSearch + " " + popularSearch);

                if (!wordsSearch.length && !authorSearch.length && !commentedBySearch.length && !dateSearch.length && !tagsSearch.length && !likedByMeSearch.length && !popularSearch.length) {
                    console.log("Here");
                    html += '<div class="alert  alert-info">' +
                        '<strong>Info!</strong> Nope, type something in there :) ' +
                        '       </div>';
                        
                    $('.validation-summary-errors#searchPostValidationErrors').html(html);
                } else {
                    // Show loading screen
                    $('#loadingSearchPost').removeAttr("hidden");
                    $('#loadingSearchPostBG').removeAttr("hidden");

                    // Join them into one string using sep
                    var tagsValues = tagsSearch.join(';');
                    var wordsValues = wordsSearch.join(';');
                    var authorValues = authorSearch.join(';');
                    var commentedByValues = commentedBySearch.join(';');

                    console.log("liked " + likedByMeSearch.val() + popularSearch.val());

                    var data = {
                        Words: wordsValues,
                        Author: authorValues,
                        CommentedBy: commentedByValues,
                        DateSearch: dateSearch,
                        TagsSearch: tagsValues,
                        LikedByMeSearch: (likedByMeSearch.val() === undefined) ? false : true,
                        PopularSearch: (popularSearch.val() === undefined) ? false : true
                    };

                    var dataString = wordsValues + "#" + tagsValues + "#";

                    $.ajax({
                            url: url,
                            dataType: "json",
                            contentType: "application/json",
                            cache: false,
                            method: 'POST',
                            data: ko.toJSON(data)
                        })
                        .done(function (response) { // there's a problem with the tags
                            var reply = jQuery.parseJSON(response); // to get it out of the string
                            console.log("Response search " + reply);
                            var html = "";

                            var responses = reply.split("#");
                            var responsesArray = [];
                            console.log("Responses " + typeof responses[1]);
                            if (responses.length > 1 && reply !== "Nothing Found") {
                                var i = 0;
                                while (responses[i] !== undefined) {
                                    //if (i === 0)
                                    //    responses[i] = responses[i].substring(1);
                                    responsesArray.push(responses[i]);
                                    i++;
                                    console.log("Meow " + typeof responsesArray);
                                }

                                for (var j = 0; j < responsesArray.length; j++) {
                                    console.log("Response Search 2 " + typeof responsesArray[j]);
                                    html += onSuccessAddPost(responsesArray[j], "#modalPostSearchForm", undefined);
                                }

                                //responsesArray.forEach(post => function (e) {
                                //    console.log("Response Search 3 ");
                                //    html += onSuccessAddPost(post, "#modalPostSearchForm");
                                //    console.log("Response Search 2 ");
                                //});
                                console.log("Meh");
                            }
                            else if (responses.length === 1) // test it !!!!!!!!!!!!!!!!!!!!!
                                html = onSuccessAddPost(response, "#modalPostSearchForm", undefined);

                            html = html.length === 0 ? "Nothing Found..." : html;

                            $('#articles').html(html);
                        })
                        .fail(function (xhr, status, error) {
                            onFailureAddPost(xhr, status, error);
                        });
                }


                
            });
    });

    function onSuccessAddPost(post, modalId, imagesToDisplay) { // modalId to toggle the modal
        console.log("post " + post);

        //post.Content(self.newContent());


        if (post !== "Bad Request" && post !== "Invalid Model") {
            var data = typeof post === "string" ? jQuery.parseJSON(post) : post;

            console.log("data post id " + data.PostId);

            // Define months enum
            Date.shortMonths = [
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
            ];

            var date = new Date(parseInt(data.DatePosted.substr(6)));

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

            if (modalId !== undefined) // for sorting
                $(modalId).modal('toggle');

            var html = '<article class="hentry post video post-blog"  data-post-id="' + data.PostId + '">' +
                '<span class="post-date"><i class="fa fa-picture-o"></i>' +
                dateTime +
                '</span>' +
                '<div style="-webkit-transform: translateX(450px);"></div>' +
                '<div class="post__author author vcard inline-items">' +
                '<img src="' +
                data.AuthorAvatar +
                '" alt="author">' +
                '<div class="author-date">' +
                '<a class="h6 post__author-name fn" href="02-ProfilePage.html">' +
                data.AuthorName +
                '</a>' +
                '<div class="post__date">' +
                '<time class="published">' +
                dateTime +
                '</time>' +
                '</div>' +
                '</div>' +
                '<div class="more">' +
                '<svg class="olymp-three-dots-icon"><use xlink:href="icons/icons.svg#olymp-three-dots-icon"></use></svg>' +
                '<ul class="more-dropdown">' +
                
                '</ul>' +
                '</div>' +
                '<div class="more">' +
                '<svg class="olymp-three-dots-icon"><use xlink:href="icons/icons.svg#olymp-three-dots-icon"></use></svg>' +
                '<ul class="more-dropdown">' +
                
                '</ul>' +
                '</div>' +
                '</div>' +
                '<div>' +
                '</div>';
            if (data.Author.Id === data.CurrentUser.Id) // !!!!!!
            {
                html += '<p class="postInputEditable" data-post-id="' + data.PostId + '" contenteditable="true">' + data.Content + '</p>';
            }
            else {
                html += '<p contenteditable="false">' + data.Content + '</p>';
            }

            var tagsNames;
            if (data.TagsNames === undefined || data.TagsNames === null) {
                tagsNames = tagsValues;
            } else { // search img
                tagsNames = data.TagsNames.split(",");
                //tagsNames.pop();
            }

            if (tagsNames.length > 0) {
                html += '<ul class="tagit">';
                console.log("Hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee " + tagsNames);
                tagsNames.forEach(tag => {
                    console.log(tag);
                    html += '<li class="tagit-choice"><span>' + tag + '</span></li>';
                });
                html += '</ul>';
            }

            if (data.Author.Id === data.CurrentUser.Id) {
                html += '        <a href="#" class="deletePost" data-post-id="' +
                    data.PostId +
                    '" ><span class="ti-trash" style="color: crimson;"></span></a>';
            }

            var images;
            if (imagesToDisplay !== undefined)
                images = imagesToDisplay;
            else if(data.Images != null)
                images = data.Images.split('#');
                

            if (images != null) {
                console.log("Here Img " + data.Images);
                //var images = data.Images.split('#');
                var extensions = data.Extensions.split('#');
                var totalCount = images.length - 1;
                var count = 0;
                var plusOne = count + 1;
                var countExtension = 0;
                html += '<div class="slideshow-container mt-2" data-post-id="' + data.PostId + '">';
                images.forEach(image => 
                    {
                    if (image !== "") {
                        //var utf8 = unescape(encodeURIComponent(image));
                        //var arr = [];
                        //for (var i = 0; i < utf8.length; i++) {
                        //    arr.push(utf8.charCodeAt(i));
                        //}
                        console.log("Imageeeeeeeeeeeeeeeeeeeee " + data.AbsolutePathUri);
                        var ext = extensions[countExtension].split('#');  //image.split('.');
                        countExtension += 1;
                        var imageSrc = "data:image/" + ext[1] + ";base64," + image;
                        if (ext[1] !== "mp4") {
                                html += '<div class="mySlides" data-id="' +
                                    count +
                                    '" data-post-id="' +
                                    data.PostId +
                                    '">';
                                if (plusOne === 1) {
                                    html += '<div data-id="' +
                                        count +
                                        '" data-post-id="' +
                                        data.PostId +
                                        '" class="numbertext active">' +
                                        plusOne +
                                        ' / ' +
                                        totalCount +
                                        '</div>' +
                                        '<img data-id="' +
                                        count +
                                        '" data-post-id="' +
                                        data.PostId +
                                        '" class="slide_image active" src="' +
                                        //(data.AbsolutePathUri !== null && data.AbsolutePathUri !== undefined ? data.AbsolutePathUri : data.AbsolutePath) +
                                        //"/" +
                                        imageSrc +
                                        '" style="width: 700px; height: auto;" alt="images here">';
                                } else {
                                    html += '<div data-id="' +
                                        count +
                                        '" data-post-id="' +
                                        data.PostId +
                                        '" class="numbertext inactive">' +
                                        plusOne +
                                        ' / ' +
                                        totalCount +
                                        '</div>' +
                                        '<img data-id="' +
                                        count +
                                        '" data-post-id="' +
                                        data.PostId +
                                        '" class="slide_image inactive" src="' +
                                        //(data.AbsolutePathUri !== null && data.AbsolutePathUri !== undefined ? data.AbsolutePathUri : data.AbsolutePath) +
                                        //"/" +
                                        imageSrc +
                                        '" style="width: 700px; height: auto;" alt="images here">';
                                }
                                html += '<div class="text"></div>' +
                                    '</div>';
                                count++;
                                plusOne++;
                            } else {
                                html += '<video width="700" height="620" controls style="padding: 0; margin: 0; display: block;">' +
                                    '<source src="' +
                                    //(data.AbsolutePathUri !== null && data.AbsolutePathUri !== undefined ? data.AbsolutePathUri : data.AbsolutePath) + '/'
                                    + imageSrc + '" type="video/mp4">' +
                                    'Your browser does not support the video tag.' +
                                    '</video>';
                            }
                        }
                });
                html += '</div> <br>';

                if (totalCount > 1) {
                    var countDots = 0;
                    var plusOneDots = 1;
                    html += '<div style="text-align: center">';
                    while (totalCount-- > 0) {
                        if (plusOneDots === 1) {
                            html += '<a href="#"><span class="dot active" data-id="' +
                                countDots +
                                '" data-post-id="' +
                                data.PostId +
                                '"></span></a>';
                        } else {
                            html += '<a href="#"><span class="dot" data-id="' +
                                countDots +
                                '" data-post-id="' +
                                data.PostId +
                                '"></span></a>';
                        }

                        countDots++;
                        plusOneDots++;
                    }
                    html += '</div>';
                }
            }

            html +=
                '<div class="post-additional-info inline-items">' +
                '  <a href="#" class="post-add-icon inline-items js-likes" data-post-id="' +
                data.PostId +
                '">';
                if (data.IsLikedByCurrentUser) {
                    html += '<i class="fa fa-heart js-likes"></i>';
                } else {
                    html += '<i class="ti-heart js-likes"></i>';
                }
                html += '</a>' +


                '<ul class="friends-harmonic">' +
                //  List of Users that liked the post   (later)                                          
                '<li>' +
                '</li>' +
                '</ul>' +

                // Number of people who liked the post
                '<div class="names-people-likes" data-post-id="' +
                data.PostId +
                '" style="left: -50px; margin-left: -50px;">';
            if (data.LikesCount > 0) {
                if (data.IsLikedByCurrentUser) {
                    console.log("Likessssssssssssss " + data.IsLikedByCurrentUser + "  " + data.LikesCount);
                    html += '<a href="#" class="i-like-it" data-post-id="@post.PostId"> you' + (data.LikesCount === 1
                        ? ""
                        : " and") + '</a>';
                }
                html += '<br>';
                html += (data.IsLikedByCurrentUser
                    ? (data.LikesCount === 1 ? '' : data.LikesCount + ' people ')
                    : data.LikesCount + ' people ');
                html += '<span>liked this</span>';
            } else {
                html += '<span>Be the first to like this</span>';
            }              


            html += '</div>' +
            '<div class="comments-shared commentsBtn" data-id="' + data.PostId + '">' +
            '<a href="#" class="post-add-icon inline-items js-comments" data-post-id="' + data.PostId + '">' +
            '<i class="ti-comments"></i>' +
            '<span data-post-id="' + data.PostId + '" class="commentCount">' + data.CommentsCount + '</span>' +
            '</a>' +

            '</div>' +
            '</div>' +
            '</article>' +
            '      <div data-post-id="' + data.PostId + '" class="badwordAlertDiv"></div>' +
            '<div>' +

'<ul class="comments-list js-comments" data-id="' + data.PostId + '"></ul>' +
            '</div>';

            console.log("I am Legend");
            return html;
            //$('#articles').prepend(html);
        }

        //if (datum.Content) {
        //    $.ajax({
        //        url: "/api/Publication",
        //        dataType: "json",
        //        contentType: "application/json",
        //        cache: false,
        //        method: 'POST',
        //        data: ko.toJSON(post)
        //    })
        //        .done(function (result) {
        //            //self.Posts.splice(0, 0, new Post(result));
        //            //self.newContent('');

        //            var newPost = jQuery.parseJSON(result);

        //            console.log(newPost);

        //            var date = new Date(parseInt(newPost.DatePosted.substr(6)));
        //            var dateTime = date.getDay() +
        //                '-' +
        //                Date.shortMonths[date.getMonth()] +
        //                '-' +
        //                date.getFullYear() +
        //                ' ' +
        //                date.getHours() +
        //                ':' +
        //                date.getMinutes() +
        //                ':' +
        //                date.getSeconds();
        //            console.log(date);

        //            var html = '<div class="post-blog">' +
        //                '<h3 class="post-title"><i class="fa fa-thumb-tack"></i><a href="#" title="">' + 'Post' + '</a></h3>' +
        //                '<div class="post-img">' +
        //                '    <img src="images/resources/blog-img4.jpg" alt="">' +
        //                '</div>' +
        //                '<span class="post-date"><i class="fa fa-picture-o"></i>' + dateTime + '</span>' +
        //                '<div class="blog-post-info">' +
        //                '    <ul class="post-tg">' +
        //                '        <li class="ad-author">' +
        //                '            <span>By</span>' +
        //                '           <a href="#" title="" class="ad-name">' + newPost.AuthorName + '</a>' +
        //                '       </li>' +
        //                '       <li>' +
        //                '           <i class="fa fa-sitemap"></i>' +
        //                '           <a href="#" title="">Competitions,</a>' +
        //                '           <a href="#" title="">News</a>' +
        //                '       </li>' +
        //                '       <li>' +
        //                '           <i class="fa fa-comment-o"></i>' +
        //                '           <a href="#" title="">No Comments</a>' +
        //                '       </li>' +
        //                '       <li>' +
        //                '           <i class="fa fa-tags"></i>' +
        //                '           <a href="#" title="">Tag 1,</a>' +
        //                '           <a href="#" title="">Tag 2</a>' +
        //                '       </li>' +
        //                '   </ul>' +
        //                '   <p>' + newPost.Content + '</p>' +
        //                '   <button  class="continueReading" data-id="' + post.PostId + '">Continue Reading</button>' + // Change url to details page
        //                '</div><!--blog-post-info end-->' +
        //                '</div>';

        //            $("#postsBlog").prepend(html);
        //        })
        //        .fail(function () {
        //            console.log("Could not add post.");
        //        });
        //}

    }

    function onFailureAddPost(xhr, status, error) {
        alert('HTTP Status Code: ' + status + '  Error Message: ' + error);
    }

    function Post(data) {
        var self = this;
        data = data || {}; // if data is null => init to empty object

        console.log("datum " + data.Content);

        self.Content = ko.observable(data.Content || "");
        self.Images = ko.observable(data.Images || "");
        self.error = ko.observableArray();
    }

    function insertAt(array, index, element) {
        array.splice(index, 0, element);
    }

    // SlideSHow
    $("body").delegate('.dot',
        'click',
        function(e) {
            e.preventDefault();
            var postId = $(this).attr("data-post-id");
            var id = $(this).attr('data-id');
            console.log("what the deuce " + postId + " " + id);

            // Find the previously selected image & hide them
            // Hide previously concerned image
            $('.slide_image.active[data-post-id="' + postId + '"]').addClass('inactive').removeClass('active');

            // Hide its number
            $('.numbertext.active[data-post-id="' + postId + '"]').addClass('inactive').removeClass('active');

            // Color the unselected dot with grey
            $('.dot.active[data-post-id="' + postId + '"]').removeClass('active');


            // Show concerned image
            $('.slide_image.inactive[data-id="' + id + '"][data-post-id="' + postId + '"]').addClass('active').removeClass('inactive');

            // Update number
            $('.numbertext.inactive[data-id="' + id + '"][data-post-id="' + postId + '"]').addClass('active').removeClass('inactive');

            // Color the selected dot
            $(this).addClass('active');
        });

    // Toggle burger menu

    $(".cross").hide();
    $(".burger-menu").hide();
    $(".hamburger").click(function () {
        $(".burger-menu").slideToggle("slow", function () {
            $(".hamburger").hide();
            $(".cross").show();
        });
    });

    $(".cross").click(function () {
        $(".burger-menu").slideToggle("slow", function () {
            $(".cross").hide();
            $(".hamburger").show();
        });
    });

    // Sorting By
    // Date Newest
    $(function () {
        $('#sortNewest').click(
            function (e) {
                e.preventDefault();
                var url = "/Publication/OrderNewest";
                console.log("Sorting post");

                $.ajax({
                        url: url,
                        dataType: "json",
                        contentType: "application/json",
                        cache: false,
                        method: 'GET'
                        //data: ko.toJSON(data)
                    })
                    .done(function (response) {
                        var reply = jQuery.parseJSON(response); // to get it out of the string
                        console.log("Response sort " + reply);
                        var html = "";

                        var responses = reply.split("#");
                        var responsesArray = [];
                        console.log("Responses " + typeof responses[1]);
                        if (responses.length > 1) {
                            var i = 0;
                            while (responses[i] !== undefined) {
                                responsesArray.push(responses[i]);
                                i++;
                            }

                            for (var j = 0; j < responsesArray.length; j++) {
                                console.log("Response Search 2 " + typeof responsesArray[j]);
                                html += onSuccessAddPost(responsesArray[j], undefined, undefined); // no modal
                            }
                        }
                        else if (responses.length === 1)
                            html = onSuccessAddPost(response, undefined, undefined);

                        html = html.length === 0 ? "Nothing Found..." : html;

                        $('#articles').html(html);
                    })
                    .fail(function (xhr, status, error) {
                        onFailureAddPost(xhr, status, error);
                    });



            });
    });

    // Date Oldest
    $(function () {
        $('#sortOldest').click(
            function (e) {
                e.preventDefault();
                var url = "/Publication/OrderOldest";
                console.log("Sorting post");

                $.ajax({
                    url: url,
                    dataType: "json",
                    contentType: "application/json",
                    cache: false,
                    method: 'GET'
                    //data: ko.toJSON(data)
                })
                    .done(function (response) { 
                        var reply = jQuery.parseJSON(response); // to get it out of the string
                        console.log("Response sort " + reply);
                        var html = "";

                        var responses = reply.split("#");
                        var responsesArray = [];
                        console.log("Responses " + typeof responses[1]);
                        if (responses.length > 1) {
                            var i = 0;
                            while (responses[i] !== undefined) {
                                responsesArray.push(responses[i]);
                                i++;
                            }

                            console.log("RRRRRR " + responsesArray);
                            for (var j = responsesArray.length-1; j >= 0; j--) { // dunno why the order is weird
                                console.log("Response Search 2 " + typeof responsesArray[j]);
                                html += onSuccessAddPost(responsesArray[j], undefined, undefined); // no modal
                            }
                        }
                        else if (responses.length === 1)
                            html = onSuccessAddPost(response, undefined, undefined);

                        html = html.length === 0 ? "Nothing Found..." : html;

                        $('#articles').html(html);
                    })
                    .fail(function (xhr, status, error) {
                        onFailureAddPost(xhr, status, error);
                    });
            

        });
    });

    // Interests
    $(function () {
        $('#sortInterests').click(
            function (e) {
                e.preventDefault();
                var url = "/Publication/OrderInterests";
                console.log("Sorting post");

                $.ajax({
                        url: url,
                        dataType: "json",
                        contentType: "application/json",
                        cache: false,
                        method: 'GET'
                        //data: ko.toJSON(data)
                    })
                    .done(function (response) {
                        var reply = jQuery.parseJSON(response); // to get it out of the string
                        console.log("Response sort " + reply);
                        var html = "";

                        var responses = reply.split("#");
                        var responsesArray = [];
                        console.log("Responses " + typeof responses[1]);
                        if (responses.length > 1) {
                            var i = 0;
                            while (responses[i] !== undefined) {
                                responsesArray.push(responses[i]);
                                i++;
                            }

                            for (var j = 0; j < responsesArray.length; j++) {
                                console.log("Response Search 2 " + typeof responsesArray[j]);
                                html += onSuccessAddPost(responsesArray[j], undefined, undefined); // no modal
                            }
                        }
                        else if (responses.length === 1)
                            html = onSuccessAddPost(response, undefined, undefined);

                        html = html.length === 0 ? "Nothing Found..." : html;

                        $('#articles').html(html);
                    })
                    .fail(function (xhr, status, error) {
                        onFailureAddPost(xhr, status, error);
                    });



            });
    });

    // Most Liked
    $(function () {
        $('#sortMostLiked').click(
            function (e) {
                e.preventDefault();
                var url = "/Publication/OrderMostLiked";
                console.log("Sorting post");

                $.ajax({
                        url: url,
                        dataType: "json",
                        contentType: "application/json",
                        cache: false,
                        method: 'GET'
                        //data: ko.toJSON(data)
                    })
                    .done(function (response) {
                        var reply = jQuery.parseJSON(response); // to get it out of the string
                        console.log("Response sort " + reply);
                        var html = "";

                        var responses = reply.split("#");
                        var responsesArray = [];
                        console.log("Responses " + typeof responses[1]);
                        if (responses.length > 1) {
                            var i = 0;
                            while (responses[i] !== undefined) {
                                responsesArray.push(responses[i]);
                                i++;
                            }

                            for (var j = 0; j < responsesArray.length; j++) {
                                console.log("Response Search 2 " + typeof responsesArray[j]);
                                html += onSuccessAddPost(responsesArray[j], undefined, undefined); // no modal
                            }
                        }
                        else if (responses.length === 1)
                            html = onSuccessAddPost(response, undefined, undefined);

                        html = html.length === 0 ? "Nothing Found..." : html;

                        $('#articles').html(html);
                    })
                    .fail(function (xhr, status, error) {
                        onFailureAddPost(xhr, status, error);
                    });



            });
    });

    // Liked By User
    $(function () {
        $('#sortLikedByUser').click(
            function (e) {
                e.preventDefault();
                var url = "/Publication/OrderLikedByUser";
                console.log("Sorting post");

                $.ajax({
                        url: url,
                        dataType: "json",
                        contentType: "application/json",
                        cache: false,
                        method: 'GET'
                        //data: ko.toJSON(data)
                    })
                    .done(function (response) {
                        var reply = jQuery.parseJSON(response); // to get it out of the string
                        console.log("Response sort " + reply);
                        var html = "";

                        var responses = reply.split("#");
                        var responsesArray = [];
                        console.log("Responses " + typeof responses[1]);
                        if (responses.length > 1) {
                            var i = 0;
                            while (responses[i] !== undefined) {
                                responsesArray.push(responses[i]);
                                i++;
                            }

                            for (var j = 0; j < responsesArray.length; j++) {
                                console.log("Response Search 2 " + typeof responsesArray[j]);
                                html += onSuccessAddPost(responsesArray[j], undefined, undefined); // no modal
                            }
                        }
                        else if (responses.length === 1)
                            html = onSuccessAddPost(response, undefined, undefined);

                        html = html.length === 0 ? "Nothing Found..." : html;

                        $('#articles').html(html);
                    })
                    .fail(function (xhr, status, error) {
                        onFailureAddPost(xhr, status, error);
                    });



            });
    });

    // Most Commented
    $(function () {
        $('#sortMostCommented').click(
            function (e) {
                e.preventDefault();
                var url = "/Publication/OrderMostCommented";
                console.log("Sorting post");

                $.ajax({
                        url: url,
                        dataType: "json",
                        contentType: "application/json",
                        cache: false,
                        method: 'GET'
                        //data: ko.toJSON(data)
                    })
                    .done(function (response) {
                        var reply = jQuery.parseJSON(response); // to get it out of the string
                        console.log("Response sort " + reply);
                        var html = "";

                        var responses = reply.split("#");
                        var responsesArray = [];
                        console.log("Responses " + typeof responses[1]);
                        if (responses.length > 1) {
                            var i = 0;
                            while (responses[i] !== undefined) {
                                responsesArray.push(responses[i]);
                                i++;
                            }

                            for (var j = responsesArray.length-1; j >= 0; j--) {
                                console.log("Response Search 2 " + typeof responsesArray[j]);
                                html += onSuccessAddPost(responsesArray[j], undefined, undefined); // no modal
                            }
                        }
                        else if (responses.length === 1)
                            html = onSuccessAddPost(response, undefined, undefined);

                        html = html.length === 0 ? "Nothing Found..." : html;

                        $('#articles').html(html);
                    })
                    .fail(function (xhr, status, error) {
                        onFailureAddPost(xhr, status, error);
                    });



            });
    });

    // Commented By User  // there's error !!!!!!!!!
    $(function () {
        $('#sortCommentedByUser').click(
            function (e) {
                e.preventDefault();
                var url = "/Publication/OrderCommentedByUser";
                console.log("Sorting post");

                $.ajax({
                        url: url,
                        dataType: "json",
                        contentType: "application/json",
                        cache: false,
                        method: 'GET'
                        //data: ko.toJSON(data)
                    })
                    .done(function (response) {
                        var reply = jQuery.parseJSON(response); // to get it out of the string
                        console.log("Response sort " + reply);
                        var html = "";

                        var responses = reply.split("#");
                        var responsesArray = [];
                        console.log("Responses " + typeof responses[1]);
                        if (responses.length > 1) {
                            var i = 0;
                            while (responses[i] !== undefined) {
                                responsesArray.push(responses[i]);
                                i++;
                            }

                            for (var j = 0; j < responsesArray.length; j++) {
                                console.log("Response Search 2 " + typeof responsesArray[j]);
                                html += onSuccessAddPost(responsesArray[j], undefined, undefined); // no modal
                            }
                        }
                        else if (responses.length === 1)
                            html = onSuccessAddPost(response, undefined, undefined);

                        html = html.length === 0 ? "Nothing Found..." : html;

                        $('#articles').html(html);
                    })
                    .fail(function (xhr, status, error) {
                        onFailureAddPost(xhr, status, error);
                    });



            });
    });

})();