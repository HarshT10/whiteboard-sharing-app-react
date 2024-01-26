const users = [];

const addUser = ({ name, meetingCode, userId, host, presenter, socketId }) => {
  const user = { name, meetingCode, userId, host, presenter, socketId };

  users.push(user);

  return users.filter((user) => user.meetingCode === meetingCode);
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.socketId === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = (id) => {
  return users.find((user) => user.socketId === id);
};

const getUsersInRoom = (meetingCode) => {
  return users.filter((user) => user.meetingCode === meetingCode);
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
};
