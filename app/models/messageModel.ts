// messageModel.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
    question: string;
    answer?: string;
}

const MessageSchema: Schema = new Schema({
    question: { type: String, required: true },
    answer: { type: String }
});

const Message = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);

export default Message;


