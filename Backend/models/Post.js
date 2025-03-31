import mongoose from "mongoose";
import { Schema, model } from "mongoose";

const postSchema = new Schema({

    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    cover: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    readTime: {
        value: {
            type: Number,
            required: true
        },
        unit: {
            type: String,
            required: true
        }
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

}, { timestamps: true }
)

const Post = model('Post', postSchema)

export default Post;