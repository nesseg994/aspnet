(function () {


    //code dealing with pub index page loadMore ajaxCall and smooth scroll down
    $(function () {

        var loadCount = 1;
        var loading = $("#loading");
        $("#loadMore").on("click", function (e) {

            e.preventDefault();
            console.log("HEERE");
            $(document).on({

                ajaxStart: function () {
                    loading.show();
                },
                ajaxStop: function () {
                    loading.hide();
                }
            });

            var url = "/Publication/LoadMorePublication/";
            $.ajax({
                url: url,
                data: { size: loadCount * 9 },
                cache: false,
                type: "POST",
                success: function (data) {
                    console.log("HEERE 2");
                    if (data.length !== 0) {
                        console.log("Count " + data.ModelCount);
                        console.log("Count 2 " + loadCount);
                        $(data.ModelString).insertBefore("#loadMore").hide().fadeIn(2000);
                    }

                    var ajaxModelCount = data.ModelCount - (loadCount * 9);
                    console.log("Count 3 " + ajaxModelCount);
                    if (ajaxModelCount <= 0) {
                        $("#loadMore").hide().fadeOut(2000);
                    }

                },
                error: function (xhr, status, error) {
                    console.log(xhr.responseText);
                    alert("message : \n" + "An error occurred, for more info check the js console" + "\n status : \n" + status + " \n error : \n" + error);
                }
            });

            loadCount = loadCount + 1;

        });

    });


})();