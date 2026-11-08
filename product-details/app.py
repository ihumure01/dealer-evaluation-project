from flask import Flask
from flask_cors import CORS
import json
import os

app = Flask("List of products")
CORS(app)

@app.route("/products")
def getProductsList():
    with open("products.json", "r") as prodfile:
        data = json.load(prodfile)

    products = [
        item["product"] for item in data["products"]
    ]

    return {"products": products}


@app.route("/getdealers/<product>")
def getDealers(product):
    with open("products.json", "r") as prodfile:
        data = json.load(prodfile)

    for item in data["products"]:
        if item["product"].lower() == product.lower():
            return {"dealers": item["Dealers"]}

    return {"message": "Could not find dealers for this product"}, 404


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
