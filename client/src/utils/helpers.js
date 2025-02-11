function getAvatar(users, me) {
  if (users.length === 2) {
    if (users[0]._id === me._id) {
      return users[1].avatar.secure_url || null;
    } else {
      return users[0].avatar.secure_url || null;
    }
  }

  return null;
}

export { getAvatar };
