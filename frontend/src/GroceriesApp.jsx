// Importing 

import InventoryCard from "./InventoryCard";
import CartList from "./CartList";
import { useState, useEffect } from "react";
import axios from "axios";
import InventoryForm from "./InventoryForm";

// Main component for the Groceries App
export default function GroceriesApp() {
  // Define a template for an empty product
  const emptyProduct = {
    id: "",
    productName: "",
    brand: "",
    quantity: "",
    image: "",
    price: "",
  };

  // State variables to manage products, response data, cart list, form data, and edit toggle
  const [products, setProduct] = useState([]);
  const [responseData, setResponseData] = useState("");
  const [cartList, setCartList] = useState([]);
  const [toggleEdit, setToggleEdit] = useState(false);
  const [formData, setFormData] = useState(emptyProduct);

  
  useEffect(() => {
    handleGetProducts();
  }, [responseData]);

  const handleGetProducts = async () => {
    await axios.get("http://localhost:3000/products").then((response) => {
      setProduct(response.data);
    });
  };

  
  const handlePostProduct = async (product) => {
    const postProduct = {
      id: product.id,
      productName: product.productName,
      brand: product.brand,
      quantity: product.quantity,
      image: product.image,
      price: product.price,
    };

    await axios
      .post("http://localhost:3001/addProduct", postProduct)
      .then((response) => setResponseData(<p>{response.data}</p>));
  };

  // Function to add an item to the cart
  const handleAddToCart = (item) => {
    setCartList((prevList) => {
      console.log(cartList);
      return [...prevList, { ...item, id: crypto.randomUUID() }];
    });
  };

  // Function to empty the cart
  const handleEmptyCart = () => {
    setCartList([]);
  };

  // Function to delete a product
  const handleProductDelete = async (product) => {
    const id = product._id;
    axios
      .delete(`http://localhost:3001/products/${id}`)
      .then((response) => setResponseData(<p>{response.data}</p>));
  };

  // Function to remove an item from the cart
  const handleRemoveItem = (id) => {
    setCartList((prevList) => {
      return prevList.filter((i) => i.id !== id);
    });
  };

  
  const handleToggleEdit = (product) => {
    setFormData(product);
    setToggleEdit(true);
  };

  // Function to handle changes in the form input fields
  const handleOnChange = (evt) => {
    const fieldName = evt.target.name;
    const fieldValue = evt.target.value;
    setFormData((prevData) => {
      return {
        ...prevData,
        id: crypto.randomUUID(),
        [fieldName]: fieldValue,
      };
    });
  };

  // Function to handle form submission for adding/editing a product
  const handleOnSubmit = (evt) => {
    evt.preventDefault();
    toggleEdit ? handleProductEdit(formData) : handlePostProduct(formData);
    setFormData(emptyProduct);
  };

  
  return (
    <>
      <h1>Groceries App</h1>

      { }
      <InventoryForm
        handleOnSubmit={handleOnSubmit}
        formData={formData}
        handleOnChange={handleOnChange}
        handleToggleEdit={handleToggleEdit}
        toggleEdit={toggleEdit}
      />
      {responseData}

      {}
      <div className="GroceriesApp-Container">
        {}
        <InventoryCard
          list={products}
          onClick={handleAddToCart}
          handleProductDelete={handleProductDelete}
          handleToggleEdit={handleToggleEdit}
        />

        {}
        <CartList
          cartList={cartList}
          onClickEmpty={handleEmptyCart}
          onClickRemove={handleRemoveItem}
        />
      </div>
    </>
  );
}
