import fs from 'fs';
import path from 'path';

/**
 * Reads a JSON file and returns its parsed content as the specified type.
 * Use this for reading typed test data arrays (e.g. login credentials, test inputs).
 *
 * @param filePath - Relative path to the JSON file from the current directory.
 * @returns Parsed JSON content cast to type T.
 *
 * @example
 * const logins = readJSONFile<LoginData[]>('../Data/salesforceLogin.json');
 */
export function readJSONFile<T>(filePath: string): T {
  const fullPath = path.join(__dirname, filePath);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`[readJSONFile] File not found: ${fullPath}`);
  }

  const raw = fs.readFileSync(fullPath, 'utf8');

  if (!raw.trim()) {
    throw new Error(`[readJSONFile] File is empty: ${fullPath}`);
  }

  try {
    return JSON.parse(raw) as T;
  } catch (err) {
    throw new Error(`[readJSONFile] Malformed JSON in ${fullPath}: ${(err as Error).message}`);
  }
}

/**
 * Updates a JSON file by merging new data with the existing content of the file.
 * If the file does not exist, is empty, or contains malformed JSON, it creates a default structure and updates.
 *
 * @param filePath - The relative path to the JSON file to be updated.
 * @param newData  - The new data to merge with the existing JSON data.
 */
export function updateJSONFile<T>(filePath: string, newData: T): void {
  const fullPath = path.join(__dirname, filePath);

  if (!fs.existsSync(fullPath)) {
    console.error(`File ${filePath} does not exist. Creating a new file.`);
    fs.writeFileSync(fullPath, JSON.stringify({} as T, null, 2), 'utf8');
    console.log(`${filePath} has been created with an initial structure.`);
  }

  let existingData: T = {} as T;

  try {
    const data = fs.readFileSync(fullPath, 'utf8');
    if (!data.trim()) {
      console.log(`The file ${filePath} is empty. Initializing with default structure.`);
      fs.writeFileSync(fullPath, JSON.stringify({} as T, null, 2), 'utf8');
    } else {
      existingData = JSON.parse(data);
    }
  } catch (err) {
    if (err instanceof SyntaxError) {
      console.error(`Malformed JSON in ${filePath}:`, err.message);
    } else {
      console.error(`Error reading file ${filePath}:`, err);
    }
    return;
  }

  const updatedData: T = { ...existingData, ...newData };
  fs.writeFileSync(fullPath, JSON.stringify(updatedData, null, 2), 'utf8');
  console.log(`${filePath} has been successfully updated.`);
}

/**
 * Reads a JSON file and returns a random item from the array inside it.
 *
 * @param filePath - Relative path to the JSON file containing a string array.
 * @returns A random string from the array.
 */
export function getRandomItemFromFile(filePath: string): string {
  const fullPath = path.join(__dirname, filePath);
  const data: string[] = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  return data[Math.floor(Math.random() * data.length)];
}

/**
 * Saves data to a JSON file under a 'title' key.
 *
 * @param filename - Relative path to the output JSON file.
 * @param data     - Data to save.
 */
export function saveDataToJsonFile(filename: string, data: any): void {
  const filePath = path.join(__dirname, filename);
  fs.writeFile(filePath, JSON.stringify({ title: data }, null, 2), 'utf8', (err) => {
    if (err) {
      console.error('An error occurred while writing JSON to file:', err);
    } else {
      console.log(`JSON file has been saved to ${filePath}`);
    }
  });
}