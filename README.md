# Full Stack Coding Challenge (Front-end)

We have provided this project as a starting point for you to complete the front-end part of our full stack coding challenge. Please read below before implementing your front-end.

## Installing node / yarn

You should use `nvm` to install node. This project requires node v20.

Go [here](https://github.com/nvm-sh/nvm/blob/master/README.md#installing-and-updating) to install `nvm`.

Then run:

```
nvm install 20
npm install -g yarn
```

This installs node v20 and yarn as a global command.

## Installing dependencies

You shouldn't need any dependencies to complete the challenge other than the ones we have already provided. Install dependencies with the following command:

```
yarn install
```

## Running the project

We have provided an example server that implements enough functionality for you to display points balances for a given user. You must implement all functionality in your own server, in your preferred language/framework. The example server is simply provided so you can work on the front-end first if you prefer to work that way.

You can run the server with the following command:

```
yarn exampleServer
```

The example server runs on port `8080`. You can feel free to use another port in your server implementation, but note that you will need to update the existing API call in the front-end code that retrieves point balances if you do so. Also note that your server will need to allow cross-origin requests.

You can run the front-end with the following command:

```
yarn dev
```

The front-end will be served on port `5173` by default. Make sure to check the terminal output for the exact port as it may differ if something else is already using `5173`.

The page will automatically update as you save your code.

## Requirements

You can find the expected UI design [here](https://www.figma.com/file/Wk0wHOUs5MLlOg4BHaVllC/Coding-Challange?type=design&node-id=0%3A1&mode=design&t=mhONefZ5wUjDMWGJ-1).

We have already implemented the "log in" and "log out" functionality for you to save time. We have also provided the code needed to call the API to retrive points balances. You need to implement the following functionality for the front-end:

- A form to redeem points for a coupon
- A history of transactions (redemptions and cancellations) displayed under the form
- Ability to cancel a coupon (in the history)

The points balance and transaction history that are displayed should automatically be refreshed whenever points are redeemed or a redemption is canceled.

You should be able to log out of a user's account and log in to another user's account and not see information from the first account.

You should use the components from the `grommet` library to implement your interface. There are already plenty of examples in the starter code. See [this documentation](https://v2.grommet.io/components) to use other components.

Use the [react-query](https://tanstack.com/query/latest/docs/react/overview) library to make API calls. We already have an example for retrieving points balances as previously mentioned. You can find this in the `api` subdirectory of `src`.
