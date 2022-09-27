const express = require('express');
const app = express(),
      bodyParser = require("body-parser");
      port = 3000;

app.use(bodyParser.json());
app.use(express.static(process.cwd()+"/split-rocket-ui/dist/split-rocket-ui/"));

app.get('/', (req,res) => {
  res.sendFile(process.cwd()+"/split-rocket-ui/dist/split-rocket-ui/index.html")
});


let tripTransactions = [];
let memberTotal = 0;

//create transaction Array with name and individual total
setupTransactions = (memberExpenseArray) =>{

  memberExpenseArray.forEach((member) => {
    member.expense.forEach((exp) => {
      memberTotal = memberTotal + exp.amount;
    });
    tripTransactions.push({ name: member.name, amount: memberTotal, done: false});
    memberTotal = 0;
  });
}

//calculate balances
getBalances = () => {

  let tripTotal = 0;
  let individualBalance = 0;
  let creditors = [];
  let debitors = [];
  let finalBalances = [];

  //calculate tripTotal
  tripTransactions.forEach((transaction) => {
    tripTotal = transaction.amount + tripTotal;
  });

  

  //create credtors aray and debitors arrays
  tripTransactions.forEach((transaction) => {

    //calculate individualBalance based on total and spending
    individualBalance = transaction.amount - (tripTotal / tripTransactions.length).toFixed(2);


  //insert newBalance  property
  Object.defineProperty(transaction, 'newBalance', {  
    value: individualBalance,
    writable: true,
    enumerable: true
  });


  // based on balance value, push to credtors or debitor arrays
  if(individualBalance > 0) {
    creditors.push(transaction);
  } else if (individualBalance < 0) {
    debitors.push(transaction);
  }
  });


//find balances
creditors.forEach((creditor) => {

  debitors.forEach((debitor) => {

    if(creditor.done == false && debitor.done == false){

      if(Math.abs(creditor.newBalance)  < Math.abs(debitor.newBalance)){
        finalBalances.push({'from':debitor.name, 'to':creditor.name, 'amount':creditor.newBalance});
        debitor.newBalance = Math.abs(debitor.newBalance) - Math.abs(creditor.newBalance);
        creditor.done = true;
      }


       else if(Math.abs(creditor.newBalance) == Math.abs(debitor.newBalance)){
        creditor.done = true;
        debitor.done = true;
        finalBalances.push({'from':debitor.name, 'to':creditor.name, 'amount':Math.abs(debitor.newBalance)});
       }


       else if(Math.abs(creditor.newBalance) > Math.abs(debitor.newBalance)){
        finalBalances.push({'from':debitor.name, 'to':creditor.name, 'amount':Math.abs(debitor.newBalance)});
        creditor.newBalance = Math.abs(creditor.newBalance) - Math.abs(debitor.newBalance);
        debitor.done = true;
       }

    }
  });
});

return finalBalances;
}

app.post("/api/calculate", (req, res) => {

  tripTransactions = [];
  memberTotal   = 0;

  setupTransactions(req.body.members);
  res.json(getBalances());

});

app.listen(port, () => {
  console.log(`Server listening on the port::${port}`);
});