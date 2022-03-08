window.onload = function () {
  tinymce.init({
    selector: "#tiny-mce-post-body",
    plugins: [
      "a11ychecker advcode advlist link casechange export formatpainter linkchecker autolink autosave code lists checklist media mediaembed pageembed permanentpen powerpaste table advtable tinycomments tinymcespellchecker",
      "preview",
      "searchreplace",
      "wordcount",
      "table emoticons image imagetools",
    ],
    toolbar: [
      "a11ycheck addcomment showcomments casechange checklist code export formatpainter pageembed permanentpen tabl",
      "bold italic underline | alignleft alignright alignjustify | bullist numlist outdent indent | link image media | forecolor backcolor emoticons | code preview",
    ],
    height: 300,
    automatic_uploads: true,
    images_upload_url: "/uploads/postImage",
    relative_urls: false,
    images_upload_handler: function (blobInfo, success, failure) {
      let header = new Headers();
      header.append("Accept", "Application/JSON");
      let formData = new FormData();
      formData.append("post-image", blobInfo.blob(), blobInfo.filename());
      let req = new Request("/uploads/postImage", {
        method: "post",
        headers: header,
        mode: "cors",
        body: formData,
      });
      fetch(req)
        .then((res) => res.json())
        .then((data) => success(data.imgUrl))
        .catch(() => failure("HTTP Error"));
    },
    toolbar_mode: "floating",
    tinycomments_mode: "embedded",
    tinycomments_author: "Author name",
  });
};
