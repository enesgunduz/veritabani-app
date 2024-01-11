const express = require('express')
const app = express()
const port = 3000
const sqlite3 = require('sqlite3').verbose();
const path = require('path')
const bodyParser = require('body-parser');


const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use('/', express.static('public'))
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


let db = new sqlite3.Database('first.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected database !!!');
});


// db.serialize(() => {
//   db.each(`
//   CREATE TABLE Kullanici
//   (
//       kullanici_id INT PRIMARY KEY,
//       ullanici_adi VARCHAR(50),
//       mail VARCHAR(100),
//       sifre VARCHAR(50),
//   );
//   `, (err, row) => {
//     if (err) {
//       console.error(err.message);
//     }
//     console.log(row.id + "\t" + row.name);
//   });
// });

db.serialize(() => {
  db.each(`CREATE TABLE IF NOT EXISTS Kullanici(kullanici_id INT PRIMARY KEY,kullanici_adi VARCHAR(50),mail VARCHAR(100),sifre VARCHAR(50))`, (err) => {
    if (err) {
      console.error(err.message);
    }
  });
});


db.serialize(() => {
  db.each(`CREATE TABLE IF NOT EXISTS Eklenti(eklenti_id INT PRIMARY KEY,gelistirici_id INT,eklenti_adi VARCHAR(100),aciklama TEXT,surum VARCHAR(20),indirme_sayisi INT,FOREIGN KEY (gelistirici_id) REFERENCES Kullanici(kullanici_id)
  )`, (err) => {
    if (err) {
      console.error(err.message);
    }
  });
});


db.serialize(() => {
  db.each(`CREATE TABLE IF NOT EXISTS Kategori(kategori_id INT PRIMARY KEY,kategori_adi VARCHAR(50))`, (err) => {
    if (err) {
      console.error(err.message);
    }
  });
});


db.serialize(() => {
  db.each(`CREATE TABLE IF NOT EXISTS Inceleme(inceleme_id INT PRIMARY KEY,kullanici_id INT,eklenti_id INT,puan INT,yorum TEXT,FOREIGN KEY (kullanici_id) REFERENCES Kullanici(kullanici_id),FOREIGN KEY (eklenti_id) REFERENCES Eklenti(eklenti_id))`, (err) => {
    if (err) {
      console.error(err.message);
    }
  });
});

//  // insert one row into the langs table
//  db.run(`INSERT INTO Kullanici VALUES(5,"nur","nur@mail.com","1234567")`, function(err) {
//   if (err) {
//     return console.log(err.message);
//   }
//   // get the last insert id
//   console.log(`A row has been inserted with rowid ${this.lastID}`);
// });


db.run(`INSERT INTO Eklenti VALUES(6,3,"Pinterest'e Kaydet","Fikirleri Pinterest'e kaydedin.", 4,10000000)`, function(err) {
  if (err) {
    return console.log(err.message);
  }
  // get the last insert id
  console.log(`A row has been inserted with rowid ${this.lastID}`);
});


// db.close((err) => {
//   if (err) {
//     return console.error(err.message);
//   }
//   console.log('Close the database connection.');
// });

let profil;  
app.get('/', (req, res) => {
  res.sendFile(__dirname +'/public/index.html')
})
app.get('/session', (req, res) => {
  res.sendFile(__dirname +'/public/session.html')
})

app.get('/profil', (req, res) => {
  res.sendFile(__dirname +'/public/profil.html')
})

app.get('/login', (req, res) => {
  res.sendFile(__dirname +'/public/login.html')
})
app.post('/login', (req, res) => {
    response = {
     email:req.body.email,
     password:req.body.password
   };
   db.all(`SELECT * FROM Kullanici WHERE mail LIKE '${response.email}'`, (err, rows) => {
    if (err) {
      throw err;
    }
    console.log(rows)
 
    if(rows.length == 0){
      res.sendFile(__dirname +'/public/login.html');
    }else{
      profil = response;
      console.log(response);
      res.redirect('/session')

    }
  }); 

})

app.get('/signup', (req, res) => {

  res.sendFile(__dirname +'/public/signup.html')
})


app.get('/users', (req, res) => {
  db.all(`SELECT * FROM Kullanici`, (err, rows) => {
    if (err) {
      throw err;
    }
    res.send(rows)
  });
})



app.get('/category', (req, res) => {
  db.all(`SELECT * FROM Kategori`, (err, rows) => {
    if (err) {
      throw err;
    }
    res.send(rows)
  });
})

app.get('/extensions', (req, res) => {
  db.all(`SELECT * FROM Eklenti`, (err, rows) => {
    if (err) {
      throw err;
    }
    res.send(rows)
  });
})


app.get('/review', (req, res) => {
  db.all(`SELECT * FROM Inceleme`, (err, rows) => {
    if (err) {
      throw err;
    }
    res.send(rows)
  });
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


