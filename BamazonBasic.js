var mysql = require("mysql");
var inquirer = require("inquirer");


var connection = mysql.createConnection({
  host: "localhost",

  
  port: 3306,

  
  user: "root",

  password: "password",
  database: "bamazon_DB"
});


connection.connect(function(err) {
  if (err) throw err;

  start();
});


function start() {
  inquirer
    .prompt({
      name: "buyorsell",
      type: "rawlist",
      message: "Would you like to [BUY] an item or [RETURN] an item?",
      choices: ["BUY", "RETURN"]
    })
    .then(function(answer) {
      
      if (answer.buyorsell.toUpperCase() === "BUY") {
        buyItem();
      }
      else {
        returnItem();
      }
    });
}


function returnItem() {
  
  inquirer
    .prompt([
      {
        name: "item_name",
        type: "input",
        message: "What is the item you would like to return?"
      },
      {
        name: "inventory",
        type: "input",
        message: "How many will you be returning?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
      
      connection.query(
        "UPDATE stock SET ? WHERE ?",
        
        function(err) {
          if (err) throw err;
          console.log("You have successfully returned the item(s)!");
        
          start();
        }
      );
    });
}

function buyItem() {
  
  connection.query("SELECT * FROM stock", function(err, results) {
    if (err) throw err;
    
    inquirer
      .prompt([
        {
          name: "choice",
          type: "rawlist",
          choices: function() {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].item_name);
            }
            return choiceArray;
          },
          message: "What item would you like to buy?"
        },
        {
          name: "amount",
          type: "rawlist",
          message: "How many would you like to buy?",
          choices: ["1", "2", "3", "4", "5"]
        }
      ])
      .then(function(answer) {
        
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].item_name === answer.choice) {
            chosenItem = results[i];
          }
        }

       
        if (chosenItem.inventory > parseInt(answer.amount)) {
          
          connection.query(
            "UPDATE auctions SET ? WHERE ?",
            [
              {
                inventory: parseInt(answer.amount)
              },
              {
                id: chosenItem.id
              }
            ],
            function(error) {
              if (error) throw err;
              console.log("You bought some stuff!");
              start();
            }
          );
        }
        else {
          
          console.log("There is not enough stock left of that item");
          start();
        }
      });
  });
}
