const path = require('path');
const multer = require('multer');
const debug = require('debug')('files');

// The allowed* objects are mostly dummies dependent upon
// future action
const allowedFormats = {
    documents: [ 'pdf', 'docx', 'doc' ],
    images:    [ 'jpeg', 'jpg', 'png', 'gif' ],
    videos:    [ 'mp4', 'mkv', 'avi', 'wmv', 'webm' ],
    spreadsheet: [ 'xlsx', 'xls' ]
};

const directoryNames = {
    documents: "documents",
    images: "images",
    videos: "videos",
    spreadsheets: "spreadsheets"
};

const storageLimits = {
    images: { fileSize: 524288000 }, // 5 MB in bytes
    documents: { fileSize: 524288000 },
    videos: { fileSize: 524288000 }
};

const filenameGenerator = function(file) {
    const uniqueSuffix =
        Date.now()
        + '-'
        + Math.round(Math.random() * 1E9);
    return file.fieldname
        + '-'
        + uniqueSuffix
        + file.originalname.substring(file.originalname.length - 4);
};

const fileStorage = (fileType) => {
    return multer.diskStorage({
        destination: function(_req, _file, cb) {
            cb(null, path.join(__dirname, "../", "temp", fileType));
        },
        filename: function(req, file, cb) {
            let currentFilename = filenameGenerator(file);
            req.currentFilename = path
                .join(__dirname, "../", "temp", fileType, currentFilename);
            cb(null, currentFilename);
        }
    });
}

const fileFilter = (fileType) => {
    return function (_req, file, callback) {
        if (file.mimetype == 'application/octet-stream') {
            // more validation required here
            callback(null, true);
        } else {
            callback(null, false);
            debug(
                'Only ' + allowedFormats[fileType].join(', ')
                + ' type is allowed!');
        }
    };
}

module.exports = {
    // create and write to file
    // read file
    // overwrite a file
    // append to a file
    // create and write to many files

    /**
     * Deletes the file at the provided path
     *
     * @param {string} filePath
     * @returns {Promise<void>}
     */
    deleteFile: function(filePath) {
        return new Promise((resolve, reject) => {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(err);
                    reject(err);
                };
                resolve();
            });
        })
    },

    /**
     * Deletes all files at the provided paths
     *
     * @param {Array<string>} filePaths
     * @returns {Promise<Array<string>} Array of paths deleted
     */
    deleteManyFiles: function(filePaths) {
        return new Promise(async (resolve, reject) => {
            if (!filePaths)
                reject("No or invalid paths supplied.");
            else {
                for (let i = 0; i < filePaths.length; i++) {
                    await deleteFile(filePaths[i]);
                };
                resolve(filePaths);
            }
        })
    },

    storageLimits,

    allowedFormats,

    directoryNames,

    fileFilter,

    fileStorage,

    filenameGenerator,

    /**
     * Returns a Multer instance that provides several methods for generating
     * middleware that process files uploaded in `multipart/form-data` format.
     *
     * The `StorageEngine` specified in `storage` will be used to store files. If
     * `storage` is not set and `dest` is, files will be stored in `dest` on the
     * local file system with random names. If neither are set, files will be stored
     * in memory.
     *
     * In addition to files, all generated middleware process all text fields in
     * the request. For each non-file field, the `Request.body` object will be
     * populated with an entry mapping the field name to its string value, or array
     * of string values if multiple fields share the same name.
     *
     * @param {multer.Options} Options
     *
     * @returns {Multer} multer instance
     */
    multerConfig: function() {
        return multer(...arguments);
    }
}
