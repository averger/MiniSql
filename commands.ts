var fs = require('fs');

type User = {
    id: number;
    username: string;
}

let table: User[] = [];
let nextId: number;
const FILE_NAME = 'table.minisql';

export const addUser = (username: string) => {
    username = username.replace(/\"/g, '');
    // Check if the username is valid
    const regex = /^[\x00-\x7F]+$/;
    if (!regex.test(username)) {
        console.log(`Invalid username: "${username}". Usernames can only contain characters of UTF-8.`);
        return;
    }
    // Create a new user object
    const newUser: User = {
        id: nextId,
        username: username,
    };
    // Insert the new user in table alphabetical order
    let i = 0;
    while (i < table.length && table[i].username < newUser.username) {
        i++;
    }
    table.splice(i, 0, newUser);
    // Write the updated table to the file
    fs.writeFileSync(FILE_NAME, JSON.stringify(table));
    console.log(`added: id=${nextId}, username=${username}`)
    // Increment the next available ID
    nextId++;
}

export const searchUser = (username: string) => {
    const searchedUsers: User[] = [];
    let left = 0;
    let right = table.length - 1;

    if (!username) {
        return table.sort((a, b) => (a.id < b.id) ? -1 : 1);
        //return table;
    }

    while (left <= right) {
        const middle = Math.floor((left + right) / 2);
        if (table[middle].username === username) {
            searchedUsers.push(table[middle]);
            let i = middle + 1;
            while (i < table.length && table[i].username === username) {
                searchedUsers.push(table[i]);
                i++;
            }
            i = middle - 1;
            while (i >= 0 && table[i].username === username) {
                searchedUsers.push(table[i]);
                i--;
            }
            return searchedUsers;
        } else if (table[middle].username < username) {
            left = middle + 1;
        } else {
            right = middle - 1;
        }
    }
    return searchedUsers.sort((a, b) => (a.id < b.id) ? -1 : 1);;
}

// Load the table from the file
if (fs.existsSync(FILE_NAME)) {
    const data = fs.readFileSync(FILE_NAME, 'utf-8');
    table = JSON.parse(data);
    nextId = table.length + 1;
    //console.log(data)
    //console.log(table)
} else {
    nextId = 1;
}