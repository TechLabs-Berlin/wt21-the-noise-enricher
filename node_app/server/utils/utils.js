const fs = require('fs');

// Clean all files in a directory
module.exports.cleanDirectory = async (directory) =>{
    await fs.rmSync(directory, { recursive: true, force: true });
}