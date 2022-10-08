import React, { Component } from 'react'
import formatCurrency from "../util"
import {Fade, Zoom} from "react-reveal"
import Modal from "react-modal"

export default class Products extends Component {
    constructor(props) {
        super(props);
        this.state = {
            product: null
        }
    }

    openModal = (product) => {
        this.setState({product})
    }

    closeModal = () => {
        this.setState({product: null})
    }

    render() {
        const { products, addToCart } = this.props;
        const { product } = this.state;
        const { openModal, closeModal } = this;
        return (
            <div>
                <Fade bottom cascade>
                    <ul className="products">
                        {products.map(product => (
                            <li key={product._id}>
                                <div className="product">
                                    <a href={"#"+product._id} onClick={() => openModal(product)}>
                                        <img src={product.image} alt="" />
                                        <p className="product-title">
                                            {product.title}
                                        </p>
                                    </a>
                                    <div className="product-price">
                                        <div>
                                            {formatCurrency(product.price)}
                                        </div>
                                        <button 
                                            className="button primary" 
                                            onClick={() => addToCart(product)}
                                        >Add To Cart</button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </Fade>
                { product && (
                    <Modal isOpen={true} onRequestClose={closeModal}>
                        <Zoom>
                            <button className="close-modal" onClick={closeModal}>X</button>
                            <div className="product-details">
                                <img src={product.image} alt={product.title}></img>
                                <div className="product-details-description">
                                    <h3><strong>{product.title}</strong></h3>
                                    <h4>{product.description}</h4>
                                    <p className="product-size">
                                        Avaiable Sizes
                                        <ul>{product.availableSizes.map((item) => (
                                            <li><button className="button">{item}</button></li>
                                        ))}</ul>
                                    </p>
                                    <div className="product-price">
                                        <div>
                                            {formatCurrency(product.price)}
                                        </div>
                                        <button 
                                            className="button primary" 
                                            onClick={() => {addToCart(product, closeModal())}}>
                                            Add To Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Zoom>
                    </Modal>
                )}
                
            </div>
        )
    }
}
