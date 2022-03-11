window.onload = () => {
  let likeBtn = document.getElementById("likeBtn");
  let dislikeBtn = document.getElementById("dislikeBtn");

  likeBtn.addEventListener("click", (e) => {
    let postId = likeBtn.dataset.post;
    reqPostReact("likes", postId)
      .then((res) => res.json())
      .then((data) => {
        let likeText = data.liked ? "Liked" : "Like";
        likeText = likeText + `( ${data.totalLikes} )`;
        let dislikeText = `Dislike ( ${data.totalDislikes} )`;

        likeBtn.innerHTML = likeText;
        dislikeBtn.innerHTML = dislikeText;
      })
      .catch((e) => {
        console.log(e);
        alert(e.response.data.error);
      });
  });

  dislikeBtn.addEventListener("click", (e) => {
    let postId = dislikeBtn.dataset.post;
    reqPostReact("dislikes", postId)
      .then((res) => res.json())
      .then((data) => {
        let dislikeText = data.disliked ? "Disliked" : "Dislike";
        dislikeText = dislikeText + `( ${data.totalDislikes} )`;
        let likeText = `Like( ${data.totalLikes} )`;

        dislikeBtn.innerHTML = dislikeText;
        likeBtn.innerHTML = likeText;
      })
      .catch((e) => {
        console.log(e);
        alert(e.response.data.error);
      });
  });

  function reqPostReact(react, postId) {
    let headers = new Headers();
    headers.append("Accept", "Application/JSON");
    headers.append("Content-Type", "Application/JSON");

    let req = new Request(`/api/${react}/${postId}`, {
      method: "GET",
      headers,
      mode: "cors",
    });

    return fetch(req);
  }
};
