import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({ name: 'my.db', location: 'default' });

// Create the table if it doesn't exist
export const initDatabase = () => {
  db.transaction(tx => {
     tx.executeSql(
       `CREATE TABLE IF NOT EXISTS facepay (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         uri TEXT,
         number TEXT,
         upiId TEXT
       );`,
       [],
       (tx, results) => {
         console.log('facepay Table created');
       },
       error => {
         console.error('error', error);
       },
     );
  });
 };
 
 export const insertImage = (details) => {
  console.log('details uri: ' ,details.uri);
  console.log('details number: ' ,details.number);
  console.log('details upiId: ' ,details.upiId);
  return new Promise((resolve, reject) => {
    initDatabase();
     db.transaction(tx => {
       tx.executeSql(
         `INSERT INTO facepay(uri,number,upiId) VALUES (?, ?, ?)`,
         [details.uri, details.number, details.upiId],
         
         (_, results) => {
           if (results.rowsAffected > 0) {
             console.log(`Inserted at row ${results.insertId}:`, details.number,details.upiId);
             console.log('Inserting details:', details);

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
      initDatabase();
      db.transaction(tx => {
        tx.executeSql(
          'SELECT uri, number,upiId FROM facepay',
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
      initDatabase();
       db.transaction(tx => {
         tx.executeSql(
           'DELETE FROM facepay',
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
  