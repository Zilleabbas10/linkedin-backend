import type mongoose from 'mongoose';
import type { IPostWithUserInfo, PostUserInfo, PopulatedAuthor } from '../types/post.types';

export function toPostWithUserInfo(leanPost: unknown): IPostWithUserInfo {
    const post = leanPost as { userId?: mongoose.Types.ObjectId | PopulatedAuthor; [k: string]: unknown };
    const author = post.userId as PopulatedAuthor | undefined;
    const authorId = (author?._id ?? post.userId) as mongoose.Types.ObjectId;
    const userInfo: PostUserInfo = author
        ? { _id: authorId, f_name: author.f_name, headline: author.headline, profile_pic: author.profile_pic }
        : { _id: authorId };
    const { userId: _dropped, ...postFields } = post;
    return { ...postFields, userId: authorId, userInfo } as unknown as IPostWithUserInfo;
}
