// Note Importing Required Libraries..!
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const techIndustries = require("./dummy-data/dummy-data.js");
const connectMongo = require("./src/Database/db.js");
const UserModal = require("./src/Modals/userModal/user-modal.js");

// Static Variable...!
const app = express();
const port = 8080;
let Bucket = [];

//Note Mongo conect!
connectMongo();

// Note for Save data in userModals...!

// Note Express MiddleWares...!
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());


// Note Sending data to server and saving in DataBase mongoDB...!
// Note  /add-userList route... POST!

app.post(
    "/add-userList",
    (req, res) => {
        const { _userName } = req.body;
        console.log(`User added Sucessfully ${_userName}`)
        // 400...!
        if (!_userName) {
            return res.status(400).send({
                status: false,
                message: "No Data Found"
            })
        }
        // 200...!

        const newUserAdded = new UserModal({
            userName: _userName
        });

        newUserAdded
            .save()
            .then((actualData) => {
                if (actualData) {
                    return res.status(200).send({
                        status: true,
                        message: "User Added Sucessfully in Database",
                        data: newUserAdded,
                    })

                }
            })
            .catch(err => {
                console.log(`Something went wrong while saving data in dataBase ${err}`);
            })

    }
)

// Note Api route to fetch all data in DataBase mongoDB  get...!

app.get(
    "/fetch/all/users",
    async (req, res) => {
        try {
            const userCount = await UserModal.find();
            // 400!
            if (userCount < 1) {
                return res.status(400).send({
                    status: false,
                    message: "No Data found",
                })

            }

            //200!
            if (userCount) {
                return res.status(200).send({
                    status: true,
                    message: "All data fetch sucessfully",
                    data: userCount,
                })
            }


        }
        catch (error) {
            console.log(`Something went wrong while fetching all data ${error}`)
        }
    }
)

// Note Api route /user/delete/:id in DataBase mongoDB delete ...!

app.delete(
    "/user/delete/:id",
    async (req, res) => {
        const { id } = req.params;
        console.log(`uid : ${id}`)

        try {
            const userDelete = await UserModal.findByIdAndDelete({ _id: id });

            //200!
            if (userDelete) {
                return res.status(200).send({
                    status: true,
                    message: "Data Deleted Sucessfully!",
                })
            }

        }
        catch (error) {
            console.log(`Somthing went wrong while deleting data ${error}`)

            //500
            return res.status(500).send({
                status: false,
                message: "Somthing went wrong in delete data from database",
            })
        }
    }
)

// Note Api route /user/update in DataBase mongoDB put ...!


app.put(
    "/user/update",
    async (req, res) => {
        const { uid, updateName } = req.body;
        console.log(uid, updateName)

        try {
            //400.!
            if (!uid || !updateName) {
                return res.status(400).send({
                    status: false,
                    message: "user id and updated name is required",
                })
            }

            //401!
            const isUidValid = mongoose.isValidObjectId(uid)

            if (!isUidValid) {
                return res.status(401).send({
                    status: false,
                    message: "User Id is Invalid",
                })

            }


            //200.!
            const userUpdate = await UserModal.findByIdAndUpdate(
                { _id: uid },
                { userName: updateName },
                { new: true },
            )
            if (userUpdate) {
                return res.status(200).send({
                    status: true,
                    message: "Data updated successfully",
                    data: userUpdate,
                })
            }
        }

        catch (error) {
            console.log(`Something went wrong while updating data db ${error}`)
            //500!
            return res.status(500).send({
                status: false,
                message: "Something went wrong while updating data db"
            })
        }

    }
)


// Note we have for methods of apis...!
// Get: for Fetching data..!
// Note  Default / Route...!

app.get(
    "/",
    (req, res) => {
        return (
            res.status(200).send({
                status: true,
                massege: "WellCome to Server!"
            })
        )
    }
)

// Note  /companies route... GET!
app.get(
    "/companies",
    //400...!
    (req, res) => {
        if (techIndustries.length < 1) {
            return res.status(400).send({
                status: false,
                message: "ON DATA FOUND",
            });
        };
        // 200...!
        return res.status(200).send({
            status: true,
            massege: "tech Industries",
            data: techIndustries,
        })
    }
);

// ********** Crud App using from Node js ************!

// Note  /todos route... GET!

app.get(
    "/todos",
    (req, res) => {
        // 400...
        if (Bucket.length < 1) {
            return res.status(400).send({
                status: false,
                message: "No data Found",
            })

        }
        // 200....

        const bucketClone = [...Bucket]

        return res.status(200).send({
            status: true,
            message: "Data found Sccessfully",
            data: Bucket
        })
    }
)

// Note  /add-todo route... POST!

app.post(
    "/add-todo",
    (req, res) => {
        const { todoInput } = req.body;
        console.log(`Request Data: ${todoInput}`)
        //400..
        if (!todoInput) {
            return res.status(400).send({
                status: false,
                message: "No Data found",
            })
        }
        // 200..!
        let bucketClone = [...Bucket]
        bucketClone.push(todoInput)
        Bucket = bucketClone

        return res.status(200).send({
            status: true,
            message: "Data Added Successfully",
        })
    }
)

// Note  /todo/delete/:id route... Delete!

app.delete(
    "/todo/delete/:id",
    (req, res) => {
        const { id } = req.params;
        console.log(`Delete id : ${id}`);

        const bucketClone = [...Bucket];

        //400!
        if (bucketClone.length < 1) {
            return res.status(400).send({
                status: false,
                message: "No Data found",
            })
        }

        bucketClone.splice(id, 1);
        Bucket = bucketClone;

        //200!
        return res.status(200).send({
            status: true,
            message: "Item deleted sucessfully",
        })
    }
)

// Note  /todo/update route... Put!

app.put(
    "/todo/update",
    (req, res) => {
        const { index, updatedValue } = req.body;
        console.log(`index : ${index}`);
        console.log(`updated : ${updatedValue}`);

        // 400!
        if (!index || !updatedValue) {
            return res.status(400).send({
                status: false,
                message: "updated value is required"
            })
        }

        const bucketClone = [...Bucket];
        //404!

        if (bucketClone.length < 1) {
            return res.status(404).send({
                status: false,
                message: "No Data Found"
            })

        }

        bucketClone.splice(index, 1, updatedValue)
        Bucket = bucketClone;

        //200!

        return res.status(200).send({
            status: false,
            message: "Data Updated Sucessfully",
        })
    }
)


// Note this functionality for sign up and sign in user from data base!

app.post(
    "/user/register",
    async (req, res) => {
        const {
            userName,
            userNum,
            userEmail,
            userPassword
        } = req.body;
        console.log(`All data ${JSON.stringify(req.body)}`)
        try {
            //400!
            if (!userName || !userNum || !userEmail || !userPassword) {
                return res.status(400).send({
                    status: false,
                    message: "All fields are required"
                })

            }

            //404! Exist or not exist!

            const isUserExist = await UserModal.findOne({ email: userEmail })

            if (isUserExist) {
                return res.status(404).send({
                    status: false,
                    message: "Email is already exist"
                })
            }

            //200 user Registered Sucessfully!

            const encodePassword = btoa(userPassword);

            const newUserAdd = new UserModal({
                userName,
                contactNum: userNum,
                email: userEmail,
                password: encodePassword,
            });

            const userSave = await newUserAdd.save();
            console.log(`User Adeded ${userSave}`)

            if (userSave) {
                return res.status(200).send({
                    status: true,
                    message: "User Registered Sucessfully",
                    data: newUserAdd
                });
            }


        }

        catch (error) {
            console.log(`Something went wrong while fetching data from db: ${error} `);
            //500!
            return res.status(500).send({
                status: false,
                message: "Something went wrong while fetching data from db:"
            });
        }
    }
)


// Note Server Run...!
app.listen(
    port,
    () => {
        console.log(`Server is running on http://localhost:${port}`);
    }
);