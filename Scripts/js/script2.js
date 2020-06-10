(function () {

    var server = "//urlembed.com"

    var css_tag = document.createElement('link');
    css_tag.setAttribute("rel", "stylesheet");
    css_tag.setAttribute("href", server + "/static/css/embed.css");
    (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(css_tag);

    var jQuery;
    if (window.jQuery === undefined || window.jQuery.fn.jquery !== '3.4.1') {
        var script_tag = document.createElement('script');
        script_tag.setAttribute("type", "text/javascript");
        script_tag.setAttribute("src", "https://code.jquery.com/jquery-3.4.1.min.js");
        if (script_tag.readyState) {
            script_tag.onreadystatechange = function () {
                if (this.readyState == 'complete' || this.readyState == 'loaded') {
                    scriptLoadHandler();
                }
            };
        } else {
            script_tag.onload = scriptLoadHandler;
        }
        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
    } else {
        jQuery = window.jQuery;
        main();
    }
    function scriptLoadHandler() {
        jQuery = window.jQuery.noConflict(true);
        main();
    }

    function main() {
        jQuery(document).ready(function ($) {

            $('.urlembed').each(function (i, j) {
                var element = $(this);
                if (element.is("a")) {
                    element.html("");
                    element.changeElementType("div");
                }
            });
            $('.urlembed-json').each(function (i, j) {
                var element = $(this);
                if (element.is("pre")) {
                    element.html("");
                    element.changeElementType("div");
                }
            });

            $('.urlembed-json').each(function (i, j) {
                var element = $(this);
                if (element.attr("loaded") == "true") {
                    return;
                }
                element.attr("loaded", "true");
                var url = server + "/json/public/" + $(this).attr("href");
                $.ajax({
                    type: "GET",
                    url: url,
                    success: function (response) {
                        json = JSON.parse(response);
                        //console.log(json.html);
                        element.append("<table class=\"striped responsive-table\"><tbody>");
                        $.each(json, function (key, data) {
                            element.append('<tr>');
                            element.append('<td style="vertical-align: top; font-weight: bold; padding-right: 20px;">' + key + ":</td>");
                            if (key == "keywords" || key == "links") {
                                var keywords = ""
                                $.each(data, function (k2, d2) {
                                    keywords += '' + d2 + '<br/>';
                                })
                                element.append("<td>" + keywords + "</td>");
                            } else if (key == "html") {
                                element.append('<td>' + data + "</td>");
                            } else if (key == "text") {
                                element.append('<td><pre>' + data + "</pre></td>");
                            } else if (key == "content") {
                                data = data.replace(/<p><a href="([^>]+)">([^>]+)<\/a><\/p>/g, '<p><a class="urlembed" href="$1">$2</a></p>');
                                element.append('<td>' + data + "</td>");
                            } else {
                                element.append('<td>' + data + "</td>");
                            }
                            element.append("</tr>");
                        });
                        element.append("</tbody></table>");
                        main();
                    }
                });
            });

            $('.urlembed').each(function (i, j) {
                var element = $(this);
                if (element.attr("loaded") == "true") {
                    return;
                }
                element.attr("loaded", "true");

                element.append('<div class="urlembed-loader"></div>');

                if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                    element.removeClass("slim");
                    element.css("max-height", "");
                }

                var url = server + "/embed/" + $(this).attr("href");
                $.ajax({
                    type: "GET",
                    url: url,
                    success: function (response) {
                        element.append('<div class="urlembed-result"></div>');
                        element = element.find(".urlembed-result");
                        var max_height = element.parent().css("max-height");
                        if (max_height != "none") {
                            //console.log(max_height);
                            element.css("max-height", max_height);
                        }
                        element.html(response);
                        if (element.parent().hasClass("slim")) {
                            element.addClass("slim");
                            element.append('<div style="clear: both;"></div>');
                        }

                        var rate = element.find(".embed iframe").data("rate")

                        var imgSrc = element.find(".embed .img").data("img");
                        console.log(imgSrc);
                        if (imgSrc != undefined) {
                            //element.css("position", "absolute");
                            //element.css("top", "-9999px");

                            var imgPreload = new Image();
                            $(imgPreload).attr({
                                src: imgSrc
                            });

                            if (imgPreload.complete) {
                                AdjustPreloadCallback(element, imgPreload);
                            } else {
                                $(imgPreload).one("load", function (e) {
                                    AdjustPreloadCallback(element, imgPreload);
                                });
                            }
                        }
                        var iframe = element.find(".embed iframe").length;
                        if (iframe !== 0) {
                            element.parent().find(".urlembed-loader").hide();

                            var width = element.width();
                            element.find(".embed iframe").css("width", width);
                            element.find(".embed iframe").css("height", width / rate);


                            if (element.hasClass("slim")) {
                                var maxHeight = element.css("max-height").replace("px", "");
                                element.find(".embed iframe").css("width", maxHeight * rate + "px");
                                element.find(".embed iframe").css("height", maxHeight + "px");
                                element.find(".embed").css("width", maxHeight * rate + "px");
                                element.find(".embed").css("height", maxHeight);

                                element.removeClass("slim");
                                element.css("max-height", "");
                                element.parent().removeClass("slim");
                                element.parent().css("max-height", "");
                            }
                        }

                        var code = element.find(".embed .code").length;
                        if (code !== 0) {
                            element.parent().find(".urlembed-loader").hide();
                            element.css("max-width", "525px");
                            if (element.parent().attr("href").indexOf("facebook.com") !== -1) {
                                element.css("max-width", "750px");
                            }

                            element.find(".embed").css("border", "0");
                            if (element.hasClass("slim")) {
                                element.removeClass("slim");
                                element.css("max-height", "");
                                element.parent().removeClass("slim");
                                element.parent().css("max-height", "");
                            }
                        }
                        if (imgSrc == undefined && iframe == 0 && code == 0) {
                            element.parent().find(".urlembed-loader").hide();
                            if (element.hasClass("slim")) {
                                element.removeClass("slim");
                                element.css("max-height", "");
                                element.parent().removeClass("slim");
                                element.parent().css("max-height", "");
                            }
                        }
                    }
                });


            })
            var AdjustPreloadCallback = function (element, imgPreload) {
                element.parent().find(".urlembed-loader").hide();

                var rate = $(imgPreload)[0].naturalWidth / $(imgPreload)[0].naturalHeight;

                //element.find(".embed .img").css("width", "100%");
                var width = element.find(".embed").width();
                //console.log(width);

                var height = width / rate;

                if (rate < 1.66) {
                    height = width / 1.66;
                }
                if (element.hasClass("slim")) {
                    if (rate > 2) {
                        rate = 2;
                        height = width / rate;
                    }
                }
                element.find(".embed .img").css("width", width + "px");
                element.find(".embed .img").css("height", height + "px");
                element.find(".embed .img").css("background-image", " url(" + imgPreload.src + ")");

                if (element.hasClass("slim")) {
                    var maxHeight = element.css("max-height").replace("px", "");
                    //console.log(maxHeight);
                    element.find(".embed .img").css("width", maxHeight * rate + "px");
                    element.find(".embed .img").css("height", maxHeight + "px");
                    element.find(".embed").css("height", maxHeight);
                    element.find(".meta").css("left", maxHeight * rate + "px");
                    if (element.find(".desc").height() < element.find(".desc").css("line-height").replace("px", "")) {
                        element.find(".desc").hide();
                    }
                    else if (element.find(".desc").height() < element.find(".desc").css("line-height").replace("px", "") * 3) {
                        element.find(".desc").height(element.find(".desc").css("line-height").replace("px", "") * 2);
                    }
                    else if (element.find(".desc").height() < element.find(".desc").css("line-height").replace("px", "") * 4) {
                        element.find(".desc").height(element.find(".desc").css("line-height").replace("px", "") * 3);
                    }
                }
            }
        });

        (function ($) {
            $.fn.changeElementType = function (newType) {
                var attrs = {};

                $.each(this[0].attributes, function (idx, attr) {
                    attrs[attr.nodeName] = attr.nodeValue;
                });

                this.replaceWith(function () {
                    return $("<" + newType + "/>", attrs).append($(this).contents());
                });
            }
        })(jQuery);
    };

})()