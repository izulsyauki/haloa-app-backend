export interface UpdateProfileDto extends Record<string, any> { 
    username?: string;
    fullname?: string;
    bio?: string;
    avatar?: string | {[key: string]: Express.Multer.File[]};
    banner?: string | {[key: string]: Express.Multer.File[]};
}