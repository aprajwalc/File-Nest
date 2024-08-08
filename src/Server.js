const createConnection = require('mysql2').createConnection
const bcrypt = require('bcryptjs')
const express = require('express')
const cors = require('cors')
const fs = require('fs')
const multer = require('multer')
const readFileSync = fs.readFileSync

const app = express()
const upload = multer({ dest: 'uploads/' })
app.use(cors())
app.use(express.json())
// app.use(express.urlencoded({ extended: true }));

let userdata = {
    username: "apc",
    password: "apc",
    userid: "1",
}

app.post('/signupserver', async(req,res)=>{
    const {name, username, password, value} = req.body;
    const connection = createConnection({
        host: 'localhost',
        user: 'prajwal',
        password: 'Pra12345!',
        database: 'Project',
        port: 3306
    });
    // console.log(name, username, password)
    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return;
        }
        console.log('Connected to database as ID ' + connection.threadId);
        if(value === 0){
            connection.query("SELECT username FROM Users where username like ?",[username],(error, results)=>{
                console.log(results.length)
                if (results.length !== 0){
                    connection.end()
                    res.send({status: 'found'})   
                }
                else{
                    connection.query("CREATE USER ?@\'localhost\' IDENTIFIED BY ?;",
                    [username, password],(error,result1)=>{
                        if (error) {
                            handleError(error, res);
                            return;
                        } 
                    });
                    connection.query("GRANT 'users'@'localhost' TO ?@\'localhost\';",[username],(error, result2)=>{
                        if (error) {
                            handleError(error, res);
                            return;
                        }
                    });
                    connection.query("SELECT MAX(userid) as count FROM Users;",(error,result1)=>{
                        if (error) {
                            handleError(error, res);
                            return;
                        }
                        else{
                            console.log(result1[0]['count'])
                            const val = result1[0]['count'] + 1
                            const sql = "INSERT INTO Users(userid, Name, username) VALUES(?, ?, ?);";
                            connection.query(sql ,[val, name, username],(error, result3)=>{
                                if (error) {
                                    handleError(error, res);
                                    return;
                                }
                            });
                            userdata.username = username
                            connection.query("INSERT INTO UserSecurity(username, password) VALUES(?, ?);",[username, password],(error, result4)=>{
                                if (error) {
                                    handleError(error, res);
                                    return;
                                }
                            });
                            connection.query("INSERT INTO Trackers(username, last_uid_used) VALUES(?, ?);",[username, val],(error, result4)=>{
                                if (error) {
                                    handleError(error, res);
                                    return;
                                }
                            });
                            connection.query("INSERT INTO TrackStorage(userid, username) VALUES(?, ?);",[val, username],(error, result4)=>{
                                if (error) {
                                    handleError(error, res);
                                    return;
                                }
                                res.send({ status: 'ok' })
                                connection.end();
                            });
                        }
                    })
                }
            })
        }
        else if(value === 1){
            connection.query("SELECT admin_name FROM Admins where admin_name like ?",[username],(error, results)=>{
                console.log(results.length)
                if (results.length !== 0){
                    connection.end()
                    res.send({status: 'found'})   
                }
                else{
                    connection.query("CREATE USER ?@\'localhost\' IDENTIFIED BY ?;",[username, password],(error,result1)=>{
                        if (error) {
                            handleError(error, res);
                            return;
                        } 
                    });
                    connection.query("GRANT 'admins'@'localhost' TO ?@\'localhost\';",[username],(error, result2)=>{
                        if (error) {
                            handleError(error, res);
                            return;
                        }
                        connection.query("SELECT MAX(admin_id) as count FROM Admins;",(error,result1)=>{
                            if (error) {
                                handleError(error, res);
                                return;
                            }
                            else{
                                console.log(result1[0]['count'])
                                const val = result1[0]['count'] + 1
                                const sql = "INSERT INTO Admins(admin_id, admin_name) VALUES(?, ?);";
                                connection.query(sql ,[val, username],(error, result3)=>{
                                    if (error) {
                                        handleError(error, res);
                                        return;
                                    }
                                });
                            }
                        })
                    });
                }
            });
        }        
    });
});

app.post('/securityserver', async(req, res)=>{
    const {o1, a1, o2, a2} = req.body
    const connection = createConnection({
        host: 'localhost',
        user: 'prajwal',
        password: 'Pra12345!',
        database: 'Project',
        port: 3306
    });
    connection.query("UPDATE UserSecurity SET security_question_1 = ?, security_answer_1 = ?, security_question_2 = ?, security_answer_2 = ? WHERE username = ?;",[o1, a1, o2, a2, userdata.username],(error, result4)=>{
        if (error) {
            handleError(error, res);
            return;
        }
        res.send({ status: 'ok' })
        connection.end();
    });
});

app.post('/loginserver', async(req, res)=>{
    const {username, password, value} = req.body
    try{
        const connection = createConnection({
            host: 'localhost',
            user: username,
            password: password,
            port: 3306
        });
        const connection2 = createConnection({
            host: 'localhost',
            user: 'prajwal',
            password: 'Pra12345!',
            database: 'Project',
            port: 3306
        });
        if(value === 0){
            connection.query("SET ROLE 'users'@'localhost';",(error, results)=>{
                if (error) {
                    connection.end();
                    handleError(error, res);
                    return;
                }
                else{
                    console.log("Role executed");
                    // res.send({status : 'ok'})
                    userdata.username = username;
                    userdata.password = password;
                    connection.query("USE Project;",(error, result0)=>{
                        if (error) {
                            connection.end();
                            handleError(error, res);
                            return;
                        }
                    });
                    connection2.query("SELECT last_uid_used from Trackers where username = ?;",[username],(error, result1)=>{
                        if (error) {
                            connection2.end();
                            handleError(error, res);
                            return;
                        }
                        console.log(result1)
                        last_uid = result1[0]['last_uid_used'];
                        userdata.userid = last_uid
                        connection2.query("SELECT Name FROM Users where userid = ?;",[last_uid],(error, result2)=>{
                            if (error) {
                                connection.end();
                                handleError(error, res);
                                return;
                            }
                            console.log(result2)
                            connection.query("SELECT fid, title FROM Files where userid = ?;",[last_uid],(error, result3)=>{
                                if (error) {
                                    connection.end();
                                    handleError(error, res);
                                    return;
                                }
                                let tfiles = []
                                let tfilesid = []
                                for(let i=0 ; i< result3.length; i++){
                                    tfiles.push(result3[i]['title'])
                                    tfilesid.push(result3[i]['fid'])
                                }
                                console.log(tfiles, tfilesid)
                                if(result3.length === 0)
                                    res.send({ status: 'ok', name: result2[0].Name, files: 'none', id: 'none' })
                                else{
                                    res.send({ status: 'ok', name: result2[0].Name, files: tfiles, id: tfilesid })
                                }
                                connection.end();
                            });
                        });
                    });
                }
            })
        }
        else if(value === 1){
            const connection = createConnection({
                host: 'localhost',
                user: username,
                password: password,
                port: 3306
            })
                connection.query("SET ROLE 'admins'@'localhost';",(error, results)=>{
                    if (error) {
                        connection.end();
                        handleError(error, res);
                        return;
                    }
                    else{
                        console.log("Role executed");
                        // res.send({status : 'ok'})
                        userdata.username = username;
                        userdata.password = password;
                        connection.query("USE Project;",(error, result0)=>{
                            if (error) {
                                connection.end();
                                handleError(error, res);
                                return;
                            }
                            res.send({status: 'ok'})
                        });
                    }
                })
        }
    }
    catch(error){
        res.send({status : 'dberror'})
    }
})

app.post('/uploadserver', upload.single('file'), async(req, res)=>{
    if(!req.file){
        res.send({status : 'filerror'})
    }
    const file = req.file;
    console.log(req.body.password);
    const filebuffer = readFileSync(file.path);
    // console.log(filebuffer)
    const connection = createConnection({
        host: 'localhost',
        user: userdata.username,
        password: userdata.password,
        port: 3306
    });
    const connection2 = createConnection({
        host: 'localhost',
        user: 'prajwal',
        password: 'Pra12345!',
        database: 'Project',
        port: 3306
    });
    // const data = file.data;
    connection.query("SET ROLE 'users'@'localhost';",(error, results)=>{
        if (error) {
            connection.end();
            handleError(error, res);
            return;
        }
    });
        connection.query("USE Project;",(error, result0)=>{
            if (error) {
                connection.end();
                handleError(error, res);
                return;
            }
            else{
            connection.query("SELECT MAX(fid) as count FROM Files;",(error,result1)=>{
                if (error) {
                    connection.end();
                    handleError(error, res);
                    return;
                }
                else{
                    console.log(result1[0]['count'])
                    fval = result1[0]['count'] + 1
                    connection.query("INSERT INTO Files(fid, userid, title, file_type, size) VALUES(?, ?, ?, ?, ?);" ,[fval, userdata.userid, file.originalname, file.mimetype, file.size],(error, result2)=>{
                        if (error) {
                            connection.end();
                            handleError(error, res);
                            return;
                        }
                    });
                    connection.query("INSERT INTO BinaryContent(fid, content) VALUES(?, ?);" ,[fval, filebuffer],(error, result3)=>{
                        if (error) {
                            connection.end();
                            handleError(error, res);
                            return;
                        }
                        if(req.body.password !== '__null__'){
                            connection.query("INSERT INTO FileSecurity (fid, status, password, permission) VALUES(?, 'Private', ?, 'Read')",[fval, req.body.password],(error, result4)=>{
                                if (error) {
                                    connection.end();
                                    handleError(error, res);
                                    return;
                                }
                            })
                        }
                        else{
                            connection.query("INSERT INTO FileSecurity (fid, status, permission) VALUES(?, 'Private', 'Read')",[fval],(error, result4)=>{
                                if (error) {
                                    connection.end();
                                    handleError(error, res);
                                    return;
                                }
                            })
                        }
                    });
                    connection.query("SELECT fid, title FROM Files WHERE userid = ?",[userdata.userid],(error, result8)=>{
                        if (error) {
                            connection.end();
                            handleError(error, res);
                            return;
                        }
                        // res.send({ status: 'ok', files: result8})
                        let tfiles = []
                        let tfilesid = []
                        for(let i=0 ; i< result8.length; i++){
                            tfiles.push(result8[i]['title'])
                            tfilesid.push(result8[i]['fid'])
                        }
                        console.log(tfiles, tfilesid)
                        if(result8.length === 0)
                            res.send({ status: 'ok', files: 'none', id: 'none' })
                        else{
                            res.send({ status: 'ok', files: tfiles, id: tfilesid })
                        }
                        connection.end()
                    })
                }
            });
        }
    });
});

app.post("/detailserver", async(req, res)=>{
    const {fileid} = req.body
    // console.log(title)
    const connection = createConnection({
        host: 'localhost',
        user: userdata.username,
        password: userdata.password,
        port: 3306
    });
    const connection2 = createConnection({
        host: 'localhost',
        user: 'prajwal',
        password: 'Pra12345!',
        database: 'Project',
        port: 3306
    });
    connection.query("SET ROLE 'users'@'localhost';",(error, results1)=>{
        if (error) {
            connection.end();
            handleError(error, res);
            return;
        }
        connection.query("USE Project;",(error, results2)=>{
            if (error) {
                connection.end();
                handleError(error, res);
                return;
            }
            connection.query("SELECT * FROM Files WHERE fid = ?",[fileid],(error, results3)=>{
                if (error) {
                    connection.end();
                    handleError(error, res);
                    return;
                }
                connection2.query("INSERT INTO AccessHistory(fid, userid) values (?, ?)",[fileid, userdata.userid],(error, result4)=>{
                    if (error) {
                        connection.end();
                        handleError(error, res);
                        return;
                    }
                    connection.query("SELECT status, password, permission from filesecurity WHERE fid = ?",[fileid], (error, result5)=>{
                        if (error) {
                            connection.end();
                            handleError(error, res);
                            return;
                        }
                        console.log(result5[0])
                        res.send({status: 'ok', result: results3[0], security: result5[0]})
                        connection.end();
                        connection2.end();
                    })
                })
                // console.log(results3[0])
            })
        })
    })
})

app.post("/retrieveserver",async(req, res)=>{
    const {fileid, value} = req.body
    console.log(req.body)
    const connection = createConnection({
        host: 'localhost',
        user: userdata.username,
        password: userdata.password,
        port: 3306
    });
    connection.query("SET ROLE 'users'@'localhost';",(error, results)=>{
        if (error) {
            connection.end();
            handleError(error, res);
            return;
        }
        connection.query("USE Project;",(error, result0)=>{
            if (error) {
                connection.end();
                handleError(error, res);
                return;
            }
            connection.query("SELECT file_type FROM Files WHERE fid = ?",[fileid],(Error, result0)=>{
                if (error) {
                    connection.end();
                    handleError(error, res);
                    return;
                }
                if(value === 0){
                    connection.query("SELECT content FROM TextContent WHERE fid = ?", [fileid],(error, result1)=>{
                        if (error) {
                            connection.end();
                            handleError(error, res);
                            return;
                        }
                        console.log(result1)
                        if(result1[0] !== undefined && result1[0].content !== null){
                            res.send({status: 'ok', state: 1, text: result1[0].content})
                        }
                        else{
                            res.send({status: 'ok', state: 0})
                        }
                        connection.end()
                    })
                }
                else if(value === 1){
                    connection.query("SELECT content FROM BinaryContent WHERE fid = ?", [fileid],(error, result1)=>{
                        if (error) {
                            connection.end();
                            handleError(error, res);
                            return;
                        }
                        // console.log(result1)
                        res.writeHead(200, {
                            'Content-Type': result0[0].file_type,
                        });
                        res.end(result1[0].content)
                        connection.end()
                    })
                }
            })
        })
    })
})

app.post('/newfileserver', async (req, res)=>{
    const {title, password} = req.body
    const connection = createConnection({
        host: 'localhost',
        user: userdata.username,
        password: userdata.password,
        port: 3306
    });
    connection.query("SET ROLE 'users'@'localhost';",(error, results)=>{
        if (error) {
            connection.end();
            handleError(error, res);
            return;
        }
        connection.query("USE Project;",(error, result0)=>{
            if (error) {
                connection.end();
                handleError(error, res);
                return;
            }
            connection.query("SELECT MAX(fid) as count FROM Files;",(error,result1)=>{
                if (error) {
                    connection.end();
                    handleError(error, res);
                    return;
                }
                else{
                    console.log(result1[0]['count'])
                    fval = result1[0]['count'] + 1
                    connection.query("INSERT INTO Files(fid, userid, title, file_type, size) VALUES(?, ?, ?, ?, ?);" ,[fval, userdata.userid, title, 'created', 0],(error, result2)=>{
                        if (error) {
                            connection.end();
                            handleError(error, res);
                            return;
                        }
                        connection.query("INSERT INTO TextContent(fid) VALUES(?);" ,[fval],(error, result3)=>{
                            if (error) {
                                connection.end();
                                handleError(error, res);
                                return;
                            }
                            if(password !== none){
                                connection.query("INSERT INTO FileSecurity (fid, status, password, permission) VALUES(?, 'Private', ?, 'Read')",[fval, req.password],(error, result4)=>{
                                    if (error) {
                                        connection.end();
                                        handleError(error, res);
                                        return;
                                    }
                                })
                            }
                            else{
                                connection.query("INSERT INTO FileSecurity (fid, status, permission) VALUES(?, 'Private', 'Read')",[fval],(error, result4)=>{
                                    if (error) {
                                        connection.end();
                                        handleError(error, res);
                                        return;
                                    }
                                })
                            }
                        });
                        connection.query("SELECT fid, title FROM Files WHERE userid = ?",[userdata.userid],(error, result8)=>{
                            if (error) {
                                connection.end();
                                handleError(error, res);
                                return;
                            }
                            // res.send({ status: 'ok', files: result8})
                            let tfiles = []
                            let tfilesid = []
                            for(let i=0 ; i< result8.length; i++){
                                tfiles.push(result8[i]['title'])
                                tfilesid.push(result8[i]['fid'])
                            }
                            console.log(tfiles, tfilesid)
                            if(result8.length === 0)
                                res.send({ status: 'ok', files: 'none', id: 'none' })
                            else{
                                res.send({ status: 'ok', files: tfiles, id: tfilesid, cid: fval, ctitle: title })
                            }
                            connection.end()
                        })
                    });
                }
            })
        })
    })
})

app.post('/savefileserver', async (req, res)=>{
    const {fileid, content} = req.body
    text = JSON.stringify(content)
    console.log(text.length)
    const connection = createConnection({
        host: 'localhost',
        user: userdata.username,
        password: userdata.password,
        port: 3306
    });
    connection.query("SET ROLE 'users'@'localhost';",(error, results)=>{
        if (error) {
            connection.end();
            handleError(error, res);
            return;
        }
        connection.query("USE Project;",(error, result0)=>{
            if (error) {
                connection.end();
                handleError(error, res);
                return;
            }
            connection.query("UPDATE TextContent SET content = ? WHERE fid = ?",[text, fileid],(error, result1)=>{
                if (error) {
                    connection.end();
                    handleError(error, res);
                    return;
                }
                connection.query("UPDATE Files set size = ? WHERE fid = ?",[text.length, fileid],(error, result2)=>{
                    if (error) {
                        connection.end();
                        handleError(error, res);
                        return;
                    }
                    res.send({status: 'ok'})
                })
            })
        })
    })
})

app.post('/deleteserver', async (req, res)=>{
    const {title, value} = req.body
    console.log(req.body)
    const connection = createConnection({
        host: 'localhost',
        user: userdata.username,
        password: userdata.password,
        port: 3306
    });
    connection.query("SET ROLE 'users'@'localhost';",(error, results)=>{
        if (error) {
            connection.end();
            handleError(error, res);
            return;
        }
        connection.query("USE Project;",(error, result0)=>{
            if (error) {
                connection.end();
                handleError(error, res);
                return;
            }
            connection.query("DELETE FROM Files WHERE title = ?",[title],(error, result1)=>{
                if (error) {
                    connection.end();
                    handleError(error, res);
                    return;
                }
                connection.query("SELECT fid, title FROM Files WHERE userid = ?",[userdata.userid],(error, result3)=>{
                    if (error) {
                        connection.end();
                        handleError(error, res);
                        return;
                    }
                    let tfiles = []
                    let tfilesid = []
                    for(let i=0 ; i< result3.length; i++){
                        tfiles.push(result3[i]['title'])
                        tfilesid.push(result3[i]['fid'])
                    }
                    console.log(tfiles, tfilesid)
                    if(result3.length === 0)
                        res.send({ status: 'ok', files: 'none', id: 'none' })
                    else{
                        res.send({ status: 'ok', files: tfiles, id: tfilesid })
                    }
                    connection.end()
                })
            })
        })
    })
})

app.post('/sortserver',(req, res)=>{
    const {sort_by, group_by} = req.body
    console.log(req.body)
    const connection = createConnection({
        host: 'localhost',
        user: userdata.username,
        password: userdata.password,
        port: 3306
    });
    connection.query("SET ROLE 'users'@'localhost';",(error, results)=>{
        if (error) {
            connection.end();
            handleError(error, res);
            return;
        }
        connection.query("USE Project;",(error, result0)=>{
            if (error) {
                connection.end();
                handleError(error, res);
                return;
            }
            if((sort_by === "Sort by" || sort_by === "Ascending" || sort_by === "Descending") && group_by === "Group by"){
                connection.query("SELECT title FROM Files WHERE userid = ?",[userdata.userid],(error, result1)=>{
                    if (error) {
                        connection.end();
                        handleError(error, res);
                        return;
                    }
                    let tfiles = []
                    for(let i=0 ; i< result1.length; i++){
                        tfiles.push(result1[i]['title'])
                        // tfilesid.push(result1[i]['fid'])
                    }
                    console.log(tfiles)
                    if(result1.length === 0 )
                        res.send({ status: 'ok', files: 'none' })
                    else{
                        if(sort_by === "Ascending")
                        res.send({ status: 'ok', files: tfiles })
                        else if(sort_by === "Descending")
                        res.send({ status: 'ok', files: tfiles.reverse() })
                    }
                    connection.end()
                })
            }
            else if(group_by === "Type"){
                connection.query("CALL ProcessFilesByType()",(error, result1)=>{
                    if (error) {
                        connection.end();
                        handleError(error, res);
                        return;
                    }
                    console.log(result1)
                    let sortfiles = []
                    let sfiles = []
                    for(var i=0; i<result1.length-1; i++)
                    sortfiles.push(result1[i][0].result.split(', Titles&ids: ')[1].split(','))//.result.split('Titles: '))
                    // console.log(sortfiles[0].length)
                    if(sort_by === "Descending")
                    sortfiles.reverse()
                    for (var i=0; i<sortfiles.length; i++){
                        for(var j=0; j<sortfiles[i].length; j++)
                        sfiles.push(sortfiles[i][j])
                    }
                    if(sort_by === "Descending")
                    sfiles.reverse()
                    console.log(sfiles)
                    res.send({ status: 'ok', files: sfiles})
                    connection.end()
                })
            }
            else if(group_by === "Name"){
                if(sort_by === "Ascending"){
                    connection.query("SELECT title FROM Files WHERE userid = ? order by title",[userdata.userid],(error, result1)=>{
                        if (error) {
                            connection.end();
                            handleError(error, res);
                            return;
                        }
                        let tfiles = []
                        for(let i=0 ; i< result1.length; i++){
                            tfiles.push(result1[i]['title'])
                            // tfilesid.push(result1[i]['fid'])
                        }
                        console.log(tfiles)
                        if(result1.length === 0 )
                            res.send({ status: 'ok', files: 'none' })
                        else{
                            if(sort_by === "Ascending")
                            res.send({ status: 'ok', files: tfiles })
                            else if(sort_by === "Descending")
                            res.send({ status: 'ok', files: tfiles.reverse() })
                        }
                        connection.end()
                    })
                }
                else if(sort_by === "Descending"){
                    connection.query("SELECT title FROM Files WHERE userid = ? order by title desc",[userdata.userid],(error, result1)=>{
                        if (error) {
                            connection.end();
                            handleError(error, res);
                            return;
                        }
                        let tfiles = []
                        for(let i=0 ; i< result1.length; i++){
                            tfiles.push(result1[i]['title'])
                        }
                        console.log(tfiles)
                        if(result1.length === 0 )
                            res.send({ status: 'ok', files: 'none' })
                        else{
                            res.send({ status: 'ok', files: tfiles })
                        }
                        connection.end()
                    })
                }
            }
            else if(group_by === "Size"){
                if(sort_by === "Ascending"){
                    connection.query("SELECT title FROM Files WHERE userid = ? order by size",[userdata.userid],(error, result1)=>{
                        if (error) {
                            connection.end();
                            handleError(error, res);
                            return;
                        }
                        let tfiles = []
                        for(let i=0 ; i< result1.length; i++){
                            tfiles.push(result1[i]['title'])
                            // tfilesid.push(result1[i]['fid'])
                        }
                        console.log(tfiles)
                        if(result1.length === 0 )
                            res.send({ status: 'ok', files: 'none' })
                        else{
                            res.send({ status: 'ok', files: tfiles })
                        }
                        connection.end()
                    })
                }
                else if(sort_by === "Descending"){
                    connection.query("SELECT title FROM Files WHERE userid = ? order by size desc",[userdata.userid],(error, result1)=>{
                        if (error) {
                            connection.end();
                            handleError(error, res);
                            return;
                        }
                        let tfiles = []
                        for(let i=0 ; i< result1.length; i++){
                            tfiles.push(result1[i]['title'])
                            // tfilesid.push(result1[i]['fid'])
                        }
                        console.log(tfiles)
                        if(result1.length === 0 )
                            res.send({ status: 'ok', files: 'none' })
                        else{
                            res.send({ status: 'ok', files: tfiles })
                        }
                        connection.end()
                    })
                }
            }
            else if(group_by === "Last Modified"){
                if(sort_by === "Ascending"){
                    connection.query("SELECT title FROM Files WHERE userid = ? order by last_modified",[userdata.userid],(error, result1)=>{
                        if (error) {
                            connection.end();
                            handleError(error, res);
                            return;
                        }
                        let tfiles = []
                        for(let i=0 ; i< result1.length; i++){
                            tfiles.push(result1[i]['title'])
                            // tfilesid.push(result1[i]['fid'])
                        }
                        console.log(tfiles)
                        if(result1.length === 0 )
                            res.send({ status: 'ok', files: 'none' })
                        else{
                            res.send({ status: 'ok', files: tfiles })
                        }
                        connection.end()
                    })
                }
                else if(sort_by === "Descending"){
                    connection.query("SELECT title FROM Files WHERE userid = ? order by last_modified desc",[userdata.userid],(error, result1)=>{
                        if (error) {
                            connection.end();
                            handleError(error, res);
                            return;
                        }
                        let tfiles = []
                        for(let i=0 ; i< result1.length; i++){
                            tfiles.push(result1[i]['title'])
                            // tfilesid.push(result1[i]['fid'])
                        }
                        console.log(tfiles)
                        if(result1.length === 0 )
                            res.send({ status: 'ok', files: 'none' })
                        else{
                            res.send({ status: 'ok', files: tfiles })
                        }
                        connection.end()
                    })
                }
            }
            else if(group_by === "Date Created"){
                if(sort_by === "Ascending"){
                    connection.query("SELECT title FROM Files WHERE userid = ? order by created_date",[userdata.userid],(error, result1)=>{
                        if (error) {
                            connection.end();
                            handleError(error, res);
                            return;
                        }
                        let tfiles = []
                        for(let i=0 ; i< result1.length; i++){
                            tfiles.push(result1[i]['title'])
                            // tfilesid.push(result1[i]['fid'])
                        }
                        console.log(tfiles)
                        if(result1.length === 0 )
                            res.send({ status: 'ok', files: 'none' })
                        else{
                            res.send({ status: 'ok', files: tfiles })
                        }
                        connection.end()
                    })
                }
                else if(sort_by === "Descending"){
                    connection.query("SELECT title FROM Files WHERE userid = ? order by created_date desc",[userdata.userid],(error, result1)=>{
                        if (error) {
                            connection.end();
                            handleError(error, res);
                            return;
                        }
                        let tfiles = []
                        for(let i=0 ; i< result1.length; i++){
                            tfiles.push(result1[i]['title'])
                            // tfilesid.push(result1[i]['fid'])
                        }
                        console.log(tfiles)
                        if(result1.length === 0 )
                            res.send({ status: 'ok', files: 'none' })
                        else{
                            res.send({ status: 'ok', files: tfiles })
                        }
                        connection.end()
                    })
                }
            }
        })
    })
})

app.post('/accountserver', (req, res)=>{
    const {username} = req.body
    const connection = createConnection({
        host: 'localhost',
        user: userdata.username,
        password: userdata.password,
        port: 3306
    });
    const connection2 = createConnection({
        host: 'localhost',
        user: 'prajwal',
        password: 'Pra12345!',
        database: 'Project',
        port: 3306
    });
    connection2.query("SELECT last_uid_used, no_of_profiles from Trackers where username = ?;",[userdata.username],(error, result1)=>{
        if (error) {
            connection2.end();
            handleError(error, res);
            return;
        }
        // console.log(result1)
        last_uid = result1[0]['last_uid_used'];
        userdata.userid = last_uid
        connection.query("SET ROLE 'users'@'localhost';",(error, results)=>{
            if (error) {
                connection.end();
                handleError(error, res);
                return;
            }
            connection.query("USE Project;",(error, result0)=>{
                if (error) {
                    connection.end();
                    handleError(error, res);
                    return;
                }
                connection.query("SELECT userid, Name, username, premium_status, reg_date FROM Users where userid = ?;",[last_uid],(error, result2)=>{
                    if (error) {
                        connection.end();
                        handleError(error, res);
                        return;
                    }
                    console.log(result1, result2)
                    connection.end()
                    res.send({status: 'ok', userid: result2[0].userid, username: result2[0].Name, password: userdata.password, premium_status: result2[0].premium_status, date: result2[0].reg_date, profiles: result1[0].no_of_profiles})
                })
            })
        })
    })
})

app.post('/specificserver', (req, res)=>{
    const {value} = req.body
    console.log(value)
    const connection = createConnection({
        host: 'localhost',
        user: userdata.username,
        password: userdata.password,
        port: 3306
    });
    connection.query("SET ROLE 'users'@'localhost';",(error, results)=>{
        if (error) {
            connection.end();
            handleError(error, res);
            return;
        }
        connection.query("USE Project;",(error, result0)=>{
            if (error) {
                connection.end();
                handleError(error, res);
                return;
            }
            if(value === "docs"){
                connection.query("SELECT fid, title FROM Files WHERE userid = ? AND (file_type like 'application%' OR file_type = 'created')",[userdata.userid],(error, result1)=>{
                    if (error) {
                        connection.end();
                        handleError(error, res);
                        return;
                    }
                    let tfiles = []
                    let tfilesid = []
                    for(let i=0 ; i< result1.length; i++){
                        tfiles.push(result1[i]['title'])
                        tfilesid.push(result1[i]['fid'])
                    }
                    console.log(tfiles)
                    if(result1.length === 0 )
                        res.send({ status: 'ok', files: 'none' , fids: 'none'})
                    else{
                        res.send({ status: 'ok', files: tfiles, fids: tfilesid })
                    }
                    connection.end()
                })
            }
            else if(value === "imagevideo"){
                connection.query("SELECT fid, title FROM Files WHERE userid = ? AND (file_type like 'image%' OR file_type like 'video%')",[userdata.userid],(error, result1)=>{
                    if (error) {
                        connection.end();
                        handleError(error, res);
                        return;
                    }
                    let tfiles = []
                    let tfilesid = []
                    for(let i=0 ; i< result1.length; i++){
                        tfiles.push(result1[i]['title'])
                        tfilesid.push(result1[i]['fid'])
                    }
                    console.log(tfiles)
                    if(result1.length === 0 )
                        res.send({ status: 'ok', files: 'none' , fids: 'none'})
                    else{
                        res.send({ status: 'ok', files: tfiles, fids: tfilesid })
                    }
                    connection.end()
                })
            }
            else if(value === "audio"){
                connection.query("SELECT fid, title FROM Files WHERE userid = ? AND file_type like 'audio%'",[userdata.userid],(error, result1)=>{
                    if (error) {
                        connection.end();
                        handleError(error, res);
                        return;
                    }
                    let tfiles = []
                    let tfilesid = []
                    for(let i=0 ; i< result1.length; i++){
                        tfiles.push(result1[i]['title'])
                        tfilesid.push(result1[i]['fid'])
                    }
                    console.log(tfiles)
                    if(result1.length === 0 )
                        res.send({ status: 'ok', files: 'none', fids: 'none'})
                    else{
                        res.send({ status: 'ok', files: tfiles, fids: tfilesid })
                    }
                    connection.end()
                })
            }
        })
    })
})

app.post('/adminserver', (req, res)=>{
    // const {value} = req.body
    // console.log(value)
    const connection = createConnection({
        host: 'localhost',
        user: userdata.username,
        password: userdata.password,
        port: 3306
    });
    connection.query("SET ROLE 'admins'@'localhost';",(error, results)=>{
        if (error) {
            connection.end();
            handleError(error, res);
            return;
        }
        connection.query("USE Project;",(error, result0)=>{
            if (error) {
                connection.end();
                handleError(error, res);
                return;
            }
            connection.query("SELECT userid, username, premium_status FROM Users",(error, result0)=>{
                if (error) {
                    connection.end();
                    handleError(error, res);
                    return;
                }
                let tusers = []
                let tusernames = []
                let tpremium = []
                for(let i=0 ; i< result0.length; i++){
                    tusers.push(result0[i]['userid'])
                    tusernames.push(result0[i]['username'])
                    tpremium.push(result0[i]['premium_status'])
                    // tfilesid.push(result1[i]['fid'])
                }
                console.log(tusers)
                console.log(tusernames)
                console.log(tpremium)
                if(result0.length === 0 )
                    res.send({ status: 'ok', users: 'none', usernames: 'none', premium: 'none' })
                else{
                    res.send({ status: 'ok', users: tusers, usernames: tusernames , premium: tpremium  })
                }
                connection.end()
            })
        })
    })
})

app.post('/renameserver',(req, res)=>{
    const {fileid, name, ext} = req.body
    console.log(fileid, name)
    const connection = createConnection({
        host: 'localhost',
        user: userdata.username,
        password: userdata.password,
        port: 3306
    });
    connection.query("SET ROLE 'users'@'localhost';",(error, results)=>{
        if (error) {
            connection.end();
            handleError(error, res);
            return;
        }
        connection.query("USE Project;",(error, result0)=>{
            if (error) {
                connection.end();
                handleError(error, res);
                return;
            }
            connection.query("UPDATE Files SET title = ? WHERE fid = ?",[name+'.'+ext, fileid], (error, result1)=>{
                if (error) {
                    connection.end();
                    handleError(error, res);
                    return;
                }
                connection.query("SELECT title FROM Files WHERE userid = ?",[userdata.userid],(error, result8)=>{
                    if (error) {
                        connection.end();
                        handleError(error, res);
                        return;
                    }
                    let tfiles = []
                    for(let i=0 ; i< result8.length; i++){
                        tfiles.push(result8[i]['title'])
                    }
                    console.log(tfiles)
                    if(result8.length === 0)
                        res.send({ status: 'ok', files: 'none' })
                    else{
                        res.send({ status: 'ok', files: tfiles, cid: fileid, ctitle: name })
                    }
                    connection.end()
                })
            })
        })
    })
})

app.post('/accessserver',(req, res)=>{
    const {fileid} = req.body
    console.log(fileid)
    const connection = createConnection({
        host: 'localhost',
        user: userdata.username,
        password: userdata.password,
        port: 3306
    });
    connection.query("SET ROLE 'users'@'localhost';",(error, results)=>{
        if (error) {
            connection.end();
            handleError(error, res);
            return;
        }
        connection.query("USE Project;",(error, result0)=>{
            if (error) {
                connection.end();
                handleError(error, res);
                return;
            }
            connection.query("SELECT * FROM AccessHistory WHERE fid = ?",[fileid],(error, result1)=>{
                if (error) {
                    connection.end();
                    handleError(error, res);
                    return;
                }
                console.log(result1)
            })
        })
    })
})

// Need a new webpage for access history


function handleError(error, res) {
    console.error('Error executing query: ' + error);
    res.json({ status: 'error' });
}

app.listen(5000,()=>{
    console.log("Server is running on port 5000")
})