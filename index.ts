var readline = require ('readline');
import { addUser } from './commands';
import { searchUser } from './commands'

export const repl = () => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: 'miniSQL$ ',
    });

    rl.prompt();

    rl.on('line', (line: string) => {
        let arrEntries = line.trim().split(' ');
        if (arrEntries.length > 2) {
            console.log(`illegal instruction: ${line.trim()}`);
            console.log('usage: INSERT username\n       SELECT [username]\n\x1b[33m       exit\x1b[0m [code]');
            rl.prompt();
            return;
        }
        switch (arrEntries[0]) {
            case 'INSERT':
                // Ajouter user et id
                if (arrEntries[1]) {
                    addUser(arrEntries[1]);
                } else {
                    console.log(`illegal instruction: ${line.trim()}`);
                    console.log('usage: INSERT username\n       SELECT [username]\n\x1b[33m       exit\x1b[0m [code]');
                    rl.prompt();
                    return;
                }
                break;
            case 'SELECT':
                // Recherche username
                let result = searchUser(arrEntries[1]);
                console.log(`found ${result.length} entries:`);
                if (result) {
                    for (var x of result.sort((a, b) => (a.id < b.id) ? -1 : 1)) {
                        console.log(`-> id=${x.id}, username=${x.username}`);
                    }
                }
                break;
            case 'exit':
                // exit(code) si argument ou exit(0) sinon
                if (arrEntries[1]) {
                    let exitCode = parseInt(arrEntries[1]);
                    process.exit(exitCode);
                } else {
                    rl.close();
                }
                break;
            case '':
                break;
            default:
                console.log(`illegal instruction: ${line.trim()}`);
                console.log('usage: INSERT username\n       SELECT [username]\n\x1b[33m       exit\x1b[0m [code]');
                break;
        }
        rl.prompt();
    }).on('close', () => {
        process.exit(0);
    });
}

repl();