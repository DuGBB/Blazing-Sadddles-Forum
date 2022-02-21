const { Thought, User } = require("../models");

const thoughtController = {
  getAllThought(req, res) {
    Thought.find({})
      .populate({
        path: "reactions",
        select: "-__v",
      })
      .select("-__v")
      .sort({ _id: -1 })
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  getThoughtById({ params, body }, res) {
    Thought.findOne({ _id: params.id })
      .populate({
        path: "reactions",
        select: "-__v",
      })
      .select("-__v")
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: "No thought found with this id!" });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  createThought({ params, body }, res) {
    console.log(body);
    Thought.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: body.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No user found with this id " });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },

  //   addReaction({ params, body }, res) {
  //     Thought.findOneAndUpdate(
  //       { _id: params.thoughtId },
  //       { $push: { reactions: body } },
  //       { new: true, runValidate: true }
  //     )
  //       .then((dbThoughtData) => {
  //         if (!dbThoughtData) {
  //           res.status(404).json({ message: "No Thought found with this id!" });
  //           return;
  //         }
  //         res.json(dbThoughtData);
  //       })
  //       .catch((err) => res.json(err));
  //   },

  addReaction({ params, body }, res) {
    console.log("inside addReaction");
    console.log(body);
    // Reaction.create(body)
    //   // Thought.findOne({ _id: params.thoughtId }) // find user with friendId
    //   .then((dbReactionData) => {
    //     console.log(dbReactionData);
    Thought.findOneAndUpdate(
      // update user with friend id
      { _id: params.thoughtId },
      { $push: { reactions: body } },
      { new: true, runValidators: true }
    )
      .then((dbThoughtData) => {
        console.log("------------------------");
        console.log(dbThoughtData);
        if (!dbThoughtData) {
          res.status(404).json({ message: "No thought found with this id!" });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.json(err));
  },

  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidate: true,
    })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: "No thought found with this id!" });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.status(400).json(err));
  },

  deleteThought({ params }, res) {
    // console.log("\n0000\n");
    Thought.findOneAndDelete({ _id: params.id })
      .then((deletedThought) => {
        if (!deletedThought) {
          return res
            .status(404)
            .json({ message: `No thought with id, ${params.id}!` });
        }
        return User.findOneAndUpdate(
          { username: deletedThought.username },
          { $pull: { thoughts: params.id } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No user found with this id!" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },

  //   deleteReaction({ params }, res) {
  //     Thought.findOneAndUpdate(
  //       { _is: params.thoughtId },
  //       { $pull: { reactions: { reactionId: params.reactionId } } },
  //       { new: true }
  //     )
  //       .then((dbThoughtData) => res.json(dbThoughtData))
  //       .catch((err) => res.json(err));
  //   },

  deleteReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true }
    )
      .then((dbPizzaData) => res.json(dbPizzaData))
      .catch((err) => res.json(err));
  },
};

module.exports = thoughtController;
