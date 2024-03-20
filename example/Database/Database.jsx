import SQLite from 'react-native-sqlite-storage';

// Open the database
const db = SQLite.openDatabase({ name: 'my.db', location: 'default' });

// Create the table if it doesn't exist
export const initDatabase=()=>{
db.transaction(tx => {
  tx.executeSql(
    `CREATE TABLE IF NOT EXISTS Users (id INTEGER PRIMARY KEY AUTOINCREMENT,
         uri TEXT,
         number TEXT
         );`,[],
         (tx,results)=>{
            console.log('Users Table created');
         },
         error=>{
            console.error('error',error);
         },
  );
});
}

// In your database module
export const insertImage = (details) => {
  return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `INSERT INTO Users(uri, number) VALUES (?, ?)`,
          [details.uri, details.number],
          (_, results) => {
            if (results.rowsAffected > 0) {
              console.log(`Inserted at row ${results.insertId}:`, details.number);
              // Log the total number of rows in the table
              tx.executeSql(
                `SELECT COUNT(*) as total FROM Users`,
                [],
                (_, countResults) => {
                  console.log(`Total rows in Users table: ${countResults.rows.item(0).total}`);
                },
                (_, error) => {
                  console.error('Error counting rows:', error);
                }
              );
              resolve();
            } else {
              console.log('Failed to add details');
              reject(new Error('Failed to add details'));
            }
          },
          (_, error) => {
            console.error('Error adding details to DB', error);
            reject(error);
          }
        );
      });
  });
 };
 
 
  
  export const getAllImages = () => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT uri, number FROM Users',
          [],
          (_, { rows }) => {
            const images = [];
            for (let i = 0; i < rows.length; i++) {
              images.push(rows.item(i));
            }
            console.log('hello getting images')
            resolve(images);
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  };
  
  export const deleteAllRows = () => {
    return new Promise((resolve, reject) => {
       db.transaction(tx => {
         tx.executeSql(
           'DELETE FROM Users',
           [],
           (_, { rowsAffected }) => {
             console.log(`Deleted ${rowsAffected} rows`);
             resolve(); // Resolve the promise when deletion is successful
           },
           (_, error) => {
             console.error('Error deleting rows:', error);
             reject(error); // Reject the promise if there's an error
           }
         );
       });
    });
   };
  