window.onload = () => {
  var uploadCrop, tempFilename, rawImg, imageId;
  function readFile(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        $(".upload-demo").addClass("ready");
        $("#cropImagePop").modal("show");
        rawImg = e.target.result;
      };
      reader.readAsDataURL(input.files[0]);
    } else {
      swal("Sorry - you're browser doesn't support the FileReader API");
    }
  }

  uploadCrop = $("#upload-demo").croppie({
    viewport: {
      width: 200,
      height: 200,
    },
    boundary: {
      width: 300,
      height: 300,
    },
    enforceBoundary: false,
    enableExif: true,
    showZoomer: true,
  });

  $("#cropImagePop").on("shown.bs.modal", function () {
    uploadCrop
      .croppie("bind", {
        url: rawImg,
      })
      .then(function () {
        $(".cr-slider").attr({
          min: 0.5,
          max: 1.5,
        });
      });
  });

  $(".item-img").on("change", function () {
    imageId = $(this).data("id");
    tempFilename = $(this).val();
    $("#cancelCropBtn").data("id", imageId);
    readFile(this);
  });
  /*
$("#cropImageBtn").on("click", function (ev) {
  uploadCrop
    .croppie("result", {
      type: "base64",
      format: "jpeg",
      size: { width: 200, height: 200 },
    })
    .then(function (resp) {
      $("#item-img-output").attr("src", resp);
      $("#cropImagePop").modal("hide");
    });
});
*/
  $("#cancel-cropping").on("click", function () {
    $("#cropImagePop").modal("hide");
  });

  $("#topclose").on("click", function () {
    $("#cropImagePop").modal("hide");
  });

  $("#cropImageBtn").on("click", function () {
    uploadCrop
      .croppie("result", "blob")
      .then((blob) => {
        let formData = new FormData();
        let file = document.getElementById("profilePicsFile").files[0];
        let name = generateFileName(file.name);
        console.log(name);
        console.log(blob);
        formData.append("profilePics", blob, name);
        console.log(formData);

        let headers = new Headers();
        headers.append("Accept", "Application/JSON");

        let req = new Request("/uploads/profilePics", {
          method: "POST",
          headers,
          mode: "cors",
          body: formData,
        });
        return fetch(req);
      })
      .then((res) => res.json())
      .then((data) => {
        document.getElementById("removeprofilepics").style.display = "block";
        let originalprofil = document.getElementById("item-img-output");
        originalprofil.src = data.profilePics;
        document.getElementById("form-profile-pics").reset();

        $("#cropImagePop").modal("hide");
      });
  });

  $("#removeprofilepics").on("click", function () {
    let req = new Request("/uploads/profilePics", {
      method: "DELETE",
      mode: "cors",
    });
    fetch(req)
      .then((res) => res.json())
      .then((data) => {
        document.getElementById("removeprofilepics").style.display = "none";
        let originalprofil = document.getElementById("item-img-output");
        originalprofil.src = data.profilePics;
        document.getElementById("form-profile-pics").reset();
      })
      .catch((e) => {
        console.log(e);
        alert("Error Occured!");
      });
  });
};
function generateFileName(name) {
  const types = /(.jpeg|.jpg|.png|.gif)/;
  return name.replace(types, ".png");
}
