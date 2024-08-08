DROP DATABASE Project;
CREATE DATABASE Project;
USE Project;

CREATE TABLE Users(
    userid INT NOT NULL DEFAULT 0,
    Name VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    premium_status TINYINT DEFAULT 0,
    reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (userid)
);

create table InputData(
    id int not null AUTO_INCREMENT,
    data VARCHAR(255) ,
    PRIMARY KEY (id)
)

CREATE TABLE UserSecurity (
    username VARCHAR(255) NOT NULl DEFAULT " ",
    password VARCHAR(255),
    security_question_1 VARCHAR(255),
    security_answer_1 VARCHAR(255),
    security_question_2 VARCHAR(255),
    security_answer_2 VARCHAR(255),
    FOREIGN KEY (username) REFERENCES Users(username) ON DELETE CASCADE,
    PRIMARY KEY (username)
);

CREATE TABLE Files (
    fid INT NOT NULL DEFAULT 0,
    userid INT DEFAULT 0,
    title VARCHAR(255) NOT NULL,
    file_type VARCHAR(255) NOT NULL,
    size BIGINT NOT NULL DEFAULT 0,
    genres VARCHAR(255),
    created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (fid),
    FOREIGN KEY (userid) REFERENCES Users(userid) ON DELETE CASCADE
);

CREATE TABLE TextContent (
    fid INT PRIMARY KEY,
    content TEXT,
    FOREIGN KEY (fid) REFERENCES Files(fid) ON DELETE CASCADE
);

CREATE TABLE BinaryContent (
    fid INT PRIMARY KEY,
    content LONGBLOB,
    FOREIGN KEY (fid) REFERENCES Files(fid) ON DELETE CASCADE
);

-- Read, Write, Delete

CREATE TABLE FileSecurity (
    fid INT PRIMARY KEY,
    status ENUM('Public', 'Private') NOT NULL,
    password VARCHAR(100),
    permission ENUM('Read', 'Write') NOT NULL,
    FOREIGN KEY (fid) REFERENCES Files(fid) ON DELETE CASCADE
);

CREATE TABLE AccessHistory (
    fid INT,
    userid INT,
    access_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (fid, userid, access_time),
    FOREIGN KEY (fid) REFERENCES Files(fid) ON DELETE CASCADE,
    FOREIGN KEY (userid) REFERENCES Users(userid) ON DELETE CASCADE
);

CREATE TABLE UserGroups (
    gid INT NOT NULL DEFAULT 0,
    name VARCHAR(100) NOT NULL,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    number_of_users INT DEFAULT 1,
    PRIMARY KEY(gid)
);

CREATE TABLE GroupMembers (
    gid INT,
    userid INT,
    roles ENUM('admin', 'normal'), -- Restricting to 'admin' or 'normal' roles
    PRIMARY KEY (gid, userid),
    FOREIGN KEY (gid) REFERENCES UserGroups(gid) ON DELETE CASCADE,
    FOREIGN KEY (userid) REFERENCES Users(userid) ON DELETE CASCADE
);

CREATE TABLE Notifications (
    nid INT NOT NULL PRIMARY KEY DEFAULT 0,
    userid INT,
    content TEXT,
    type VARCHAR(255),
    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('read', 'unread') DEFAULT 'unread',
    is_for_all BOOLEAN DEFAULT 0, -- 0 for not for all, 1 for all
    FOREIGN KEY (userid) REFERENCES Users(userid) ON DELETE CASCADE
);

CREATE TABLE Admins (
    admin_id INT NOT NULL DEFAULT 0 PRIMARY KEY,
    admin_name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE SupportSystem (
    sid INT NOT NULL DEFAULT 0 PRIMARY KEY,
    userid INT,
    admin_id INT,
    qtime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    query TEXT,
    atime TIMESTAMP,
    answer TEXT,
    status ENUM('solved', 'pending') DEFAULT 'pending',
    FOREIGN KEY (userid) REFERENCES Users(userid) ON DELETE CASCADE,
    FOREIGN KEY (admin_id) REFERENCES Admins(admin_id) ON DELETE SET NULL
);

CREATE TABLE Trackers (
    username VARCHAR(100) PRIMARY KEY,
    last_uid_used INT,
    total_size_used BIGINT UNSIGNED DEFAULT 0,
    no_of_profiles INT DEFAULT 1,
    FOREIGN KEY (username) REFERENCES Users(username) ON DELETE CASCADE
);

CREATE TABLE TrackStorage (
    userid INT PRIMARY KEY,
    username VARCHAR(100),
    size_allocated BIGINT UNSIGNED DEFAULT 1024,
    size_used BIGINT UNSIGNED DEFAULT 0,
    FOREIGN KEY (userid) REFERENCES Users(userid) ON DELETE CASCADE
);

DROP ROLE IF EXISTS 'users'@'localhost';
CREATE ROLE 'users'@'localhost';
GRANT SELECT ON Project.Users TO 'users'@'localhost';
GRANT SELECT, INSERT, UPDATE ON Project.UserSecurity TO 'users'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON Project.Files TO 'users'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON Project.TextContent TO 'users'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON Project.BinaryContent TO 'users'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON Project.FileSecurity TO 'users'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON Project.UserGroups TO 'users'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON Project.GroupMembers TO 'users'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON Project.SupportSystem TO 'users'@'localhost';
GRANT SELECT, DELETE ON Project.Notifications TO 'users'@'localhost';
GRANT SELECT, INSERT ON Project.AccessHistory TO 'users'@'localhost';

-- GRANT 'users'@'localhost' TO 'apc'@'localhost';

DROP ROLE IF EXISTS 'admins'@'localhost';
CREATE ROLE 'admins'@'localhost';
GRANT SELECT(userid, username, premium_status) ON Project.Users TO 'admins'@'localhost';
GRANT SELECT ON Project.Admins TO 'admins'@'localhost';
GRANT SELECT, INSERT, UPDATE ON Project.SupportSystem TO 'admins'@'localhost';
GRANT SELECT, INSERT, UPDATE ON Project.Notifications TO 'admins'@'localhost';

DELIMITER //
CREATE TRIGGER Trackupdate
AFTER INSERT ON Files
FOR EACH ROW
BEGIN
    DECLARE user_name VARCHAR(255);
    DECLARE user_id INT;

    SELECT username, userid INTO user_name, user_id
    FROM Users
    WHERE userid = NEW.userid;

    UPDATE Trackers
    SET total_size_used = total_size_used + NEW.size
    WHERE username = user_name;

    UPDATE TrackStorage
    SET size_used = size_used + NEW.size
    WHERE userid = user_id;
END;
//
DELIMITER ;

DELIMITER //
CREATE TRIGGER Trackupdatedeletion
AFTER DELETE ON Files
FOR EACH ROW
BEGIN
    DECLARE user_name VARCHAR(255);
    DECLARE user_id INT;

    SELECT username, userid INTO user_name, user_id
    FROM Users
    WHERE userid = OLD.userid;

    UPDATE Trackers
    SET total_size_used = total_size_used - OLD.size
    WHERE username = user_name;

    UPDATE TrackStorage
    SET size_used = size_used - OLD.size
    WHERE userid = user_id;
END;
//
DELIMITER ;

DELIMITER //
CREATE FUNCTION GetTitlesForFileType (fileTypeParam VARCHAR(255))
RETURNS VARCHAR(255)
READS SQL DATA
BEGIN
    DECLARE titlesConcat VARCHAR(255);
    SELECT GROUP_CONCAT(title) INTO titlesConcat
    FROM Files
    WHERE file_type = fileTypeParam;

    RETURN titlesConcat;
END;
//

CREATE PROCEDURE ProcessFilesByType()
BEGIN
    DECLARE fileTypeVal VARCHAR(255);
    DECLARE done INT DEFAULT FALSE;
    DECLARE titlesVal VARCHAR(255);

    DECLARE fileTypeCursor CURSOR FOR
        SELECT DISTINCT file_type FROM Files;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN fileTypeCursor;

    fileTypeLoop: LOOP
        FETCH fileTypeCursor INTO fileTypeVal;
        IF done THEN
            LEAVE fileTypeLoop;
        END IF;

        SET titlesVal = GetTitlesForFileType(fileTypeVal);
        SELECT CONCAT('File Type: ', fileTypeVal, ', Titles&ids: ', titlesVal) AS result;

    END LOOP fileTypeLoop;
    CLOSE fileTypeCursor;
END;
//
DELIMITER ;

GRANT EXECUTE ON PROCEDURE Project.ProcessFilesByType TO 'users'@'localhost';