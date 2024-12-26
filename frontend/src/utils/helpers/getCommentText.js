export const getCommentText = (notification) => {
  const comment = notification.post.comments.find(
    (comment) => comment.user.toString() === notification.from._id.toString()
  );

  if (comment) return comment.text; // Extract the text of the comment
};
