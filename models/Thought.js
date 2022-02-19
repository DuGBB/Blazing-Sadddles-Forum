const { Schema, model, Types } = require("mongoose");
const dateFormat = require("../utils/dateFormat");

const ReactionSchema = new Schema({
  reactionId: {
    type: Schema.Types.ObjectId,
    default: () => new Types.ObjectId(),
  },
  reactionBody: {
    type: String,
    required: true,
    maxlength: 280,
  },
  username: {
    type: String,
    required: "You have to provide a username!",
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (createAtVal) => dateFormat(createAtVal),
  },
});

const ThoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: "You can not have an empty thought.",
      minlength: 1,
      maxlength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal),
    },
    username: {
      type: String,
      required: "You have to require a username!",
    },
    reactions: [ReactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

ThoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.reduce(
    (total, reaction) => total + reaction.reactions.length + 1,
    0
  );
});

const Thought = model("Thought", ThoughtSchema);

module.exports = Thought;
