const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

const dealerslist = require("./utils/dealers.json");

app.get("/", (request, response) => {
    response.send("Dealer Pricing Microservice is running");
});

app.get("/price/:dealer/:product", (request, response) => {
    const dealers = dealerslist.dealers;
    const req_dealer = request.params.dealer;
    const req_product = request.params.product;

    let found = false;

    dealers.forEach((dealer) => {
        if (dealer.Dealer === req_dealer) {
            found = true;

            if (dealer.products[req_product]) {
                response.send({
                    message: req_product + " costs " +
                    dealer.products[req_product] +
                    " at " + req_dealer
                });
            } else {
                response.send({
                    message: req_product +
                    " is not available with " + req_dealer
                });
            }
        }
    });

    if (!found) {
        response.status(404).send({
            message: "Dealer not found"
        });
    }
});

app.get("/allprice/:product", (request, response) => {
    const dealers = dealerslist.dealers;
    const req_product = request.params.product;

    const priceslist = [];

    dealers.forEach((dealer) => {
        if (dealer.products[req_product]) {
            priceslist.push({
                key: dealer.Dealer,
                value: dealer.products[req_product]
            });
        }
    });

    if (priceslist.length > 0) {
        response.send({ prices: priceslist });
    } else {
        response.status(404).send({
            message: "The product is not available"
        });
    }
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(
        "Dealer Pricing service running on port " + port
    );
});
