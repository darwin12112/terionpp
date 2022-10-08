import React, { Component } from 'react'
import formatCurrency from '../util';
import {Fade} from "react-reveal"

export default class Cart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showCheckout: false,
            email: "",
            name: "",
            address: "",
            phone:""
        }
    }

    handleInput = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    createOrder = (e) => {
        e.preventDefault();
        const order = {
            email: this.state.email,
            name: this.state.name,
            address: this.state.address,
            phone: this.state.phone,
            cartItems: this.props.cartItems
        };

        this.props.createOrder(order);
    }

    render() {
        const { cartItems, removeFromCart } = this.props;
        const { showCheckout } = this.state;
        const { handleInput, createOrder } = this;
        return (
            <div>
                <div>
                    {cartItems.length === 0
                        ? (<div className="cart cart-header">Cart is empty</div>)
                        : (<div className="cart cart-header">You have {cartItems.length} in the cart {" "}</div>)
                    }
                </div>

                <div className="cart">
                    <Fade left cascade>
                        <ul className="cart-items">
                            {cartItems.map(product => (
                                <li key={product._id}>
                                    <div>
                                        <img src={product.image} alt=""></img>
                                    </div>
                                    <div>
                                        <div>{product.title}</div>
                                        <div className="right">
                                            {formatCurrency(product.price)} x {product.count}{" "}
                                            <button className="button" onClick={() => removeFromCart(product)}>Remove</button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </Fade>
                </div>

                {cartItems.length!==0 && (<div className="cart">
                    <div className="total">
                        <div>
                            Total:{" "} 
                            {formatCurrency(cartItems.reduce((a, b) => b.price * b.count + a, 0))}
                        </div> 
                        <button className="button primary" onClick={() => this.setState({showCheckout: true})}>Proceed</button>
                    </div>
                </div>)}
                
                {showCheckout && (
                    <div className="cart">
                        <form onSubmit={createOrder}>
                            <Fade cascade right>
                            <ul className="form-container">
                                <li>
                                    <label>Email</label>
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        onChange={handleInput}
                                    ></input>
                                </li>
                                <li>
                                    <label>First Name</label>
                                    <input
                                        name="name"
                                        type="text"
                                        required
                                        onChange={handleInput}
                                    ></input>
                                </li>
                                <li>
                                    <label>Address</label>
                                    <input
                                        name="address"
                                        type="text"
                                        required
                                        onChange={handleInput}
                                    ></input>
                                </li>
                                <li>
                                    <label>Phone</label>
                                    <input
                                        name="phone"
                                        type="text"
                                        required
                                        onChange={handleInput}
                                    ></input>
                                </li>
                                <li>
                                    <button className="button primary" type="submit">Checkout</button>
                                </li>
                            </ul>
                            </Fade>
                        </form>
                    </div>
                )}
            </div>
        )
    }
}
