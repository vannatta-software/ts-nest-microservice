const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Function to execute shell commands
function runCommand(command, options = {}) {
    try {
        console.log(`Executing: ${command}`);
        execSync(command, { stdio: 'inherit', ...options });
    } catch (error) {
        console.error(`Error executing command: ${command}`);
        console.error(error.message);
        process.exit(1);
    }
}

// Function to update file content with replacements
function updateFile(filePath, replacements) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    for (const [oldString, newString] of replacements) {
        if (content.includes(oldString)) {
            content = content.replace(new RegExp(oldString, 'g'), newString);
            modified = true;
        }
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

// Function to recursively get all files in a directory
function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function(file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            arrayOfFiles.push(path.join(dirPath, "/", file));
        }
    });

    return arrayOfFiles;
}

async function setupNewService() {
    let newServiceName;
    let repoUrl;
    let makePublic = false;

    const args = process.argv.slice(2);

    // Parse command-line arguments
    if (args.length >= 2) {
        newServiceName = args[0];
        repoUrl = args[1];
        makePublic = args.includes('--public');
    } else {
        // Try to load from .env
        try {
            require('dotenv').config();
            newServiceName = process.env.SERVICE_NAME;
            repoUrl = process.env.REPO_NAME; // Assuming REPO_NAME in .env is the URL
            makePublic = process.env.MAKE_PUBLIC === 'true'; // Optional: read --public from .env
        } catch (e) {
            console.warn('dotenv not found or .env file not configured. Falling back to arguments.');
        }
    }

    if (!newServiceName || !repoUrl) {
        console.error('Usage:');
        console.error('  node scripts/transform/setup-new-service.js <new-service-name> <repo-url> [--public]');
        console.error('Or, set SERVICE_NAME and REPO_NAME in your .env file.');
        process.exit(1);
    }

    console.log(`Transforming project to service: "${newServiceName}" with repository: "${repoUrl}"`);

    // Get old service name from root package.json
    const rootPackageJsonPath = path.join(process.cwd(), 'package.json');
    const rootPackageJson = JSON.parse(fs.readFileSync(rootPackageJsonPath, 'utf8'));
    const oldServiceName = rootPackageJson.name;

    console.log(`Old service name detected: "${oldServiceName}"`);

    // 1. Update package.json files
    const domainPackageJsonPath = path.join(process.cwd(), 'src/domain/package.json');
    const contractsPackageJsonPath = path.join(process.cwd(), 'src/contracts/package.json');

    const packageJsonFiles = [
        { path: rootPackageJsonPath, type: 'root' },
        { path: domainPackageJsonPath, type: 'domain' },
        { path: contractsPackageJsonPath, type: 'contracts' }
    ];

    for (const { path: filePath, type } of packageJsonFiles) {
        const packageJson = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (type === 'root') {
            packageJson.name = newServiceName;
        } else {
            packageJson.name = `@${newServiceName}/${type}`;
            if (makePublic && packageJson.private) {
                delete packageJson.private;
            }
        }
        fs.writeFileSync(filePath, JSON.stringify(packageJson, null, 2), 'utf8');
        console.log(`Updated package.json: ${filePath}`);
    }

    // 2. Perform global string replacements in other relevant files
    const filesToProcess = [
        path.join(process.cwd(), 'nest-cli.json'),
        path.join(process.cwd(), 'tsconfig.json'),
        // Add all .ts files in src/ and test/
        ...getAllFiles(path.join(process.cwd(), 'src')).filter(file => file.endsWith('.ts')),
        ...getAllFiles(path.join(process.cwd(), 'test')).filter(file => file.endsWith('.ts')),
    ].filter(fs.existsSync); // Filter out files that don't exist

    for (const filePath of filesToProcess) {
        updateFile(filePath, [
            [oldServiceName, newServiceName],
            [`@${oldServiceName}/domain`, `@${newServiceName}/domain`],
            [`@${oldServiceName}/contracts`, `@${newServiceName}/contracts`]
        ]);
    }

    // 3. Cleanup src/api/examples
    const examplesDirPath = path.join(process.cwd(), 'src/api/examples');
    if (fs.existsSync(examplesDirPath)) {
        fs.rmSync(examplesDirPath, { recursive: true, force: true });
        console.log(`Deleted: ${examplesDirPath}`);
    }

    // 4. Git Operations
    console.log('Performing Git operations...');
    const gitDirPath = path.join(process.cwd(), '.git');
    if (fs.existsSync(gitDirPath)) {
        fs.rmSync(gitDirPath, { recursive: true, force: true });
        console.log('Deleted existing .git folder.');
    }

    runCommand('git init');
    runCommand(`git remote add origin ${repoUrl}`);
    runCommand('git add .');
    runCommand('git commit -m "Initial commit for new service"');

    console.log('Transformation and Git setup complete!');
}

setupNewService().catch(console.error);
