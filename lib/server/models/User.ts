import mongoose, { Schema } from 'mongoose';

const { String, ObjectId } = Schema.Types;

export const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        image: {
            type: String,
        },
        folders: [{ type: ObjectId, ref: 'folders' }],
    },
    {
        timestamps: true,
    }
);

const User = mongoose.models.users || mongoose.model('users', userSchema);

export default User;
