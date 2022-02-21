const { User } = require("../models");

const userController = {
  getAllUser(req, res) {
    User.find({})
      .populate({
        path: "thoughts",
        select: "-__v",
      })
      .select("-__v")
      .sort({ _id: -1 })
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  getUserById({ params }, res) {
    console.log("I got the user by id");
    User.findOne({ _id: params.id })
      .populate({
        path: "thoughts",
        select: "-__v",
      })
      .select("-__v")
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No user found with this id!" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  createUser({ body }, res) {
    User.create(body)
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.status(400).json(err));
  },

  addFriend({ params, body }, res) {
    console.log(body);
    User.findOne({ _id: params.userId }) // find user with friendId
      .then((dbUserData) => {
        return User.findOneAndUpdate(
          // update user with friend id
          { _id: params.friendId },
          { $push: { friends: dbUserData._id } },
          { new: true }
        );
      })

      .then((dbUserData) => {
        console.log(dbUserData);
        if (!dbUserData) {
          res.status(404).json({ message: "No user found with this id!" });
          return;
        }
        return User.findOneAndUpdate(
          // update user with friend id
          { _id: params.userId },
          { $push: { friends: dbUserData._id } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        console.log("------------------------");
        console.log(dbUserData);
        if (!dbUserData) {
          res.status(404).json({ message: "No user found with this id!" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },

  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true,
    })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No user found with this id!" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.status(400).json(err));
  },

  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No user found with this id!" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.status(400).json(err));
  },

  deleteFriend({ params, body }, res) {
    console.log(body);
    User.findOne({ _id: params.userId }) // find user with friendId
      .then((dbUserData) => {
        return User.findOneAndUpdate(
          // update user with friend id
          { _id: params.friendId },
          { $pull: { friends: dbUserData._id } },
          { new: true }
        );
      })

      .then((dbUserData) => {
        console.log(dbUserData);
        if (!dbUserData) {
          res.status(404).json({ message: "No user found with this id!" });
          return;
        }
        return User.findOneAndUpdate(
          // update user with friend id
          { _id: params.userId },
          { $pull: { friends: dbUserData._id } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        console.log("------------------------");
        console.log(dbUserData);
        if (!dbUserData) {
          res.status(404).json({ message: "No user found with this id!" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },
};

module.exports = userController;
