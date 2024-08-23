const fs = require('fs-extra');
const path = require('path');

// Define source and destination directories
const srcDir = path.resolve(__dirname, 'src');
const distDir = path.resolve(__dirname, 'dist');

// Function to copy files from src to dist, excluding certain file types
async function copyFiles() {
    try {
        // Ensure the destination directory exists
        await fs.ensureDir(distDir);

        // Copy files, preserving the directory structure and excluding .scss and .ts files
        await fs.copy(srcDir, distDir, {
            filter: (src, dest) => {
                const ext = path.extname(src);
                // Exclude .scss and .ts files
                if (ext === '.scss' || ext === '.ts') {
                    return false;
                }
                return true;
            }
        });

        console.log('Files copied successfully!');
    } catch (err) {
        console.error('Error copying files:', err);
    }
}

// Run the copy function
copyFiles();
