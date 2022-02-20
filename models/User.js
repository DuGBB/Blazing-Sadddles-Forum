const { Schema, model } = require("mongoose");

const UserShema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: "You have to provide a username!",
      trim: true,
    },
    email: {
      type: String,
      required: "You have to require an email!",
      unique: true,
      match: [/.+@.+\..+/],
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Thought",
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

UserShema.virtual("friendCount").get(function () {
  return this.friends.reduce(
    (total, friend) => total + friend.friends.length + 1,
    0
  );
});

const User = model("User", UserShema);

module.exports = User;
