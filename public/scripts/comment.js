const comment = document.getElementById("comment");
const commentHolder = document.getElementById("comment-holder");

comment.addEventListener("keypress", (e) => {
  if (e.key == "Enter") {
    if (e.target.value) {
      let postId = comment.dataset.post;
      let data = {
        body: e.target.value,
      };
      let req = generateRequest(`/api/comments/${postId}`, "POST", data);
      fetch(req)
        .then((res) => res.json())
        .then((data) => {
          let commentElement = createComment(data);
          commentHolder.insertBefore(commentElement, commentHolder.children[0]);
          e.target.value = "";
        })
        .catch((e) => {
          console.log(e);
          alert(e.message);
        });
    } else {
      alert("Please Enter A Valid Comment");
    }
  }
});

commentHolder.addEventListener("keypress", (e) => {
  if (commentHolder.hasChildNodes(e.target)) {
    if (e.key == "Enter") {
      let commentId = e.target.dataset.comment;
      let value = e.target.value;
      if (value) {
        let data = {
          body: value,
        };
        let req = generateRequest(
          `/api/comments/replies/${commentId}`,
          "POST",
          data
        );
        fetch(req)
          .then((res) => res.json())
          .then((data) => {
            let replyElement = createReplyElement(data);
            let parent = e.target.parentElement;
            parent.previousElementSibling.appendChild(replyElement);
            e.target.value = "";
          })
          .catch((e) => {
            console.log(e);
            alert(e.message);
          });
      } else {
        alert("Please Enter Valid Reply!");
      }
    }
  }
});

function generateRequest(url, method, body) {
  let headers = new Headers();
  headers.append("Accept", "Application/JSON");
  headers.append("Content-Type", "Application/JSON");

  let req = new Request(url, {
    method,
    headers,
    body: JSON.stringify(body),
    mode: "cors",
  });
  return req;
}

function createComment(comment) {
  let innerHTML = `
    <img class="rounded-circle mx-3 my-3" style="width: 40px;" src="${comment.user.profilepics}">
    <div class="media-body my-3">
        <p>${comment.body}</p>
        <div class="my-3">
            <input name="reply" type="text" class="form-control" placeholder="Press Enter To Replay" data-comment="${comment._id}">
        </div>
    </div>
    `;

  let div = document.createElement("div");
  div.className = "media border";
  div.innerHTML = innerHTML;
  return div;
}

function createReplyElement(reply) {
  let innerHTML = `
  <img class="align-self-start mr-3 rounded-circle" style="width: 40px;" src="${reply.profilepics}" >
  <div class="media-body">
      <p>${reply.body}</p>
  </div>
  `;
  let div = document.createElement("div");
  div.className = "media mt-3";
  div.innerHTML = innerHTML;
  return div;
}
