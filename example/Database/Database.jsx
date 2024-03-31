// import SQLite from 'react-native-sqlite-storage';

// const db = SQLite.openDatabase({ name: 'my.db', location: 'default' });

// // Create the table if it doesn't exist
// export const initDatabase = () => {
//   db.transaction(tx => {
//      tx.executeSql(
//        `CREATE TABLE IF NOT EXISTS facepay (
//          id INTEGER PRIMARY KEY AUTOINCREMENT,
//          uri TEXT,
//          number TEXT,
//          upiId TEXT
//        );`,
//        [],
//        (tx, results) => {
//          console.log('facepay Table created');
//        },
//        error => {
//          console.error('error', error);
//        },
//      );
//   });
//  };
 
//  export const insertImage = (details) => {
//   console.log('details uri: ' ,details.uri);
//   console.log('details number: ' ,details.number);
//   console.log('details upiId: ' ,details.upiId);
//   return new Promise((resolve, reject) => {
//     initDatabase();
//      db.transaction(tx => {
//        tx.executeSql(
//          `INSERT INTO facepay(uri,number,upiId) VALUES (?, ?, ?)`,
//          [details.uri, details.number, details.upiId],
         
//          (_, results) => {
//            if (results.rowsAffected > 0) {
//              console.log(`Inserted at row ${results.insertId}:`, details.number,details.upiId);
//              console.log('Inserting details:', details);

//              resolve();
//            } else {
//              console.log('Failed to add details');
//              reject(new Error('Failed to add details'));
//            }
//          },
//          (_, error) => {
//            console.error('Error adding details to DB', error);
//            reject(error);
//          }
//        );
//      });
//   });
//  };
 
 
  
//   export const getAllImages = () => {
//     return new Promise((resolve, reject) => {
//       initDatabase();
//       db.transaction(tx => {
//         tx.executeSql(
//           'SELECT uri, number,upiId FROM facepay',
//           [],
//           (_, { rows }) => {
//             const images = [];
//             for (let i = 0; i < rows.length; i++) {
//               images.push(rows.item(i));
//             }
//             console.log('hello getting images')
//             resolve(images);
//           },
//           (_, error) => {
//             reject(error);
//           }
//         );
//       });
//     });
//   };
  
//   export const deleteAllRows = () => {
//     return new Promise((resolve, reject) => {
//       initDatabase();
//        db.transaction(tx => {
//          tx.executeSql(
//            'DELETE FROM facepay',
//            [],
//            (_, { rowsAffected }) => {
//              console.log(`Deleted ${rowsAffected} rows`);
//              resolve(); // Resolve the promise when deletion is successful
//            },
//            (_, error) => {
//              console.error('Error deleting rows:', error);
//              reject(error); // Reject the promise if there's an error
//            }
//          );
//        });
//     });
//    };
import SQLite from 'react-native-sqlite-storage';
import RNFS from 'react-native-fs';
// Open the database
const db = SQLite.openDatabase({ name: 'my.db', location: 'default' });

// Create the table if it doesn't exist
export const initDatabase = () => {
  db.transaction(tx => {
     tx.executeSql(
       `CREATE TABLE IF NOT EXISTS facepay (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         uri TEXT,
         number TEXT,
         upi TEXT
       );`,
       [],
       (tx, results) => {
         console.log('FacePay Table created');
 
         // Retrieve and display the names of the columns in the facepay table
         tx.executeSql(
           `PRAGMA table_info(facepay);`,
           [],
           (tx, results) => {
             const columns = results.rows.raw().map(row => row[1]); // Extract the column names
             console.log('Columns in facepay table:', columns.join(', '));
           },
           (_, error) => {
             console.error('Error retrieving column names:', error);
           }
         );
       },
       error => {
         console.error('Error creating facepay table:', error);
       }
     );
  });
 };
 
 

// In your database module
export const insertImage = (details) => {
  return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `INSERT INTO facepay(uri, number,upi) VALUES (?, ?, ?)`,
          [details.uri, details.number,  details.upi],
          (_, results) => {
            if (results.rowsAffected > 0) {
              console.log(`Inserted at row ${results.insertId}:`, details.upi);
              // Log the total number of rows in the table
              tx.executeSql(
                `SELECT COUNT(*) as total FROM facepay`,
                [],
                (_, countResults) => {
                  console.log(`Total rows in facepay table: ${countResults.rows.item(0).total}`);
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
          'SELECT uri, number,upi FROM facepay',
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
   export const deleteDatabase = () => {
    const dbPath = `${RNFS.DocumentDirectoryPath}/my.db`; // Adjust the path if necessary
   
    // Check if the file exists before attempting to delete it
    RNFS.exists(dbPath)
       .then((exists) => {
         if (exists) {
           // If the file exists, proceed with deletion
           SQLite.deleteDatabase(
             {
               name: 'my.db',
               location: 'default',
             },
             () => {
               console.log('Database deleted successfully');
             },
             error => {
               console.error('Error occurred while deleting database', error);
             }
           );
   
           // Delete the database file from the filesystem
           RNFS.unlink(dbPath)
             .then(() => {
               console.log('Database file deleted successfully');
             })
             .catch(error => {
               console.error('Error occurred while deleting database file', error);
             });
         } else {
           // If the file does not exist, log a message
           console.log('Database file does not exist, no need to delete');
         }
       })
       .catch(error => {
         console.error('Error checking if database file exists', error);
       });
   };
   
