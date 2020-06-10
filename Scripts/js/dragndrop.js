(function () {
    $(function () {
        // Drag and Drop
        var filesDone = 0;
        var filesToDo = 0;
        var progressBar = document.getElementById('progress-bar');

        var dropArea = document.getElementById('drop-area');
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, preventDefaults, false)
        })

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        // highlight drop area when file is dropped
        ['dragenter', 'dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, unhighlight, false);
        });

        function highlight(e) {
            dropArea.classList.add('highlight');
        }

        function unhighlight(e) {
            dropArea.classList.remove('highlight');
        }

        // When files are dropped
        dropArea.addEventListener('drop', handleDrop, false);

        function handleDrop(e) {
            var dt = e.dataTransfer;
            var files = dt.files;

            handleFiles(files);
        }

        // Handle uploaded files
        function handleFiles(files) {
            files = [...files];
            initializeProgress(files.length); // progress bar
            files.forEach(uploadFile);
            files.forEach(previewFile);
        }

        /*Add event listener*/
        //$("#fileElem").change(
        //    function() {
        //        handleFiles($(this).files);
        //        console.log("hello from here");
        //    });

        //function uploadFile(file) {
        //    var url = 'YOUR URL HERE';
        //    var formData = new FormData();

        //    formData.append('file', file);

        //    fetch(url, // ajax ?
        //            {
        //                method: 'POST',
        //                body: formData
        //            })
        //        .then(() => { progressDone(); }) // progress bar
        //        .catch(() => { /* Error. Inform the user */ });
        //}

        // Preview uploaded images
        function previewFile(file) {
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = function () {
                var img = document.createElement('img');
                img.src = reader.result;
                document.getElementById('gallery').appendChild(img);
            }
        }

        // Progress bar
        function initializeProgress(numfiles) {
            progressBar.value = 0;
            filesDone = 0;
            filesToDo = numfiles;
        }

        function progressDone() {
            filesDone++;
            progressBar.value = filesDone / filesToDo * 100;
        }
    });
})();