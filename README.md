This is a "transaction budget" where any user can log in to their account, add any "income" or "expense" with details like: select category, select date, amount, or title. Then you can see the details in the "transaction list" on the right side of the page.
 In the JS section, I wrote a command-line script to display the amount of income and expenses with different background colors. I also added a search input that allows you to search by title, type, and category.

In each container list, there is a "delete button" to delete any transaction.

In the header, there is a "balance" that shows the difference between the total income amounts and the total expense amounts. If the balance is positive, it shows it in green, and if it is negative, it shows it in red

I also used Chart.js for the first time to display a bar chart of income and expenses with different colors at the specified time, which the user has already added.
So I use "localStorage" to store user data and transactions for each user, along with the "TransactionKey", which is determined by the user's email.
