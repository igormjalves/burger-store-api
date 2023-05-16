import multer from "multer";
import { v4 } from "uuid";
import {extname, resolve} from 'path'

export default {
    // storage: multer.diskStorage({
    //     destination: resolve(__dirname, '..', '..', 'uploads'),
    //     filename: (req, file, callback) => {
    //         return callback(null, v4() + extname(file.originalname))
    //     }
    // })

    storage: multer.memoryStorage({
        destination: function(req, file, callback) {
            callback(null, "");
        },
        filename: (req, file, callback) => {
            return callback(null, v4() + extname(file.originalname))
        }
    })
}