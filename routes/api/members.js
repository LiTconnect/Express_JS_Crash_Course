const express = require('express');
const uuid = require('uuid');
const router = express.Router();

const members = require('../../Members');
// the ../ takes us back a 'level' to get to the Members.js list

// Simple REST API without a DB, just hardcoded array

// Gets All Members
router.get('/', (req, res) => res.json(members));

// Get Single Member
router.get('/:id', (req, res) => {
    // :id in the above is a URL parameter

    // boolean for whether the member exists or not
    const found = members.some(member => member.id === parseInt(req.params.id));

    if (found) {
        res.json(members.filter(member => member.id === parseInt(req.params.id)));
        // filter the members array, then return the member where the id (member being an 
        //object with parameter id) meets the :id parameter passed in the URL
    } else {
        // 200 is a good status, viewed in Postman, 400 is bad
        res.status(400).json({ msg: `No member with the id of ${req.params.id}` });
    }
});

// Create Member
router.post('/', (req, res) => {
// Whenever you create something on a server or add to a DB you mostly use POST
// We can use the same route as long as its different methods
    
    // The below just send the JSON data back to that which was sent in the API create call 
    //res.send(req.body);
    // we comment it because we want to do more
    // need to use the body parser included with Express, 
    // We will initialise a middleware in the app.js

    const newMember = { // newMember as Object
        // a DB such as MongoDB would generally create the ID for you, this is manual 
        id: uuid.v4(), // v4 is a method to generate a random universal id
        name: req.body.name, 
        email: req.body.email,
        status: 'active' // always set to active when a new member is created
    }

    if (!newMember.name || !newMember.email) {
        return res.status(400).json({ msg: 'Please include a name and email' });
        // if we dont do an else we will get an error "headers are already sent"
        // Therefore just put return in front of the res.status command
    }

    members.push(newMember); // push the new member to the array
    res.json(members); // send back a response, the entire array in this case
});


// Update Member
router.put('/:id', (req, res) => {
    // Make a PUT request to API member/:id to send either name or email
    // in most cases when updating something you use a PUT

    // Below determines whether it is found
    const found = members.some(member => member.id === parseInt(req.params.id));

    if (found) {
        // if found put the body of the request into variable updMember
        const updMember = req.body;

        // forEach loops through the members
        members.forEach(member => {
            // the email and name from the API

            // check to see if the real ID is equal to the parsed ID '/:id' from the
            // main function
            if(member.id === parseInt(req.params.id)) {
                // Below to update, if a new name is sent update, if not remain the same 
                // the below makes use of a turnary operator
                // the ? equals "if"
                // the : equals "else"
                // if updMember has a name then = updMember.name else = member.name (original)
                member.name = updMember.name ? updMember.name : member.name;
                member.email = updMember.email ? updMember.email : member.email;

                // send back a response
                res.json({ msg: 'Member updated', member:member });
                // note because member:member they are the same you could specify only 1
            }
        });
    } else {
        // 200 is a good status, viewed in Postman, 400 is bad
        res.status(400).json({ msg: `No member with the id of ${req.params.id}` });
    }
});

// Delete Member
router.delete('/:id', (req, res) => {

    const found = members.some(member => member.id === parseInt(req.params.id));

    if (found) {
        res.json({ 
            msg: 'Member deleted', 
            members: members.filter(member => member.id !== parseInt(req.params.id))
    });
        // We want to filter out the one we want to delete hence it now being !==
        // this will send back all the membersw except the deleted one
    } else {
        res.status(400).json({ msg: `No member with the id of ${req.params.id}` });
    }
});

module.exports = router;