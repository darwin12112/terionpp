import React from 'react';
import data from "./data.json"
import Products from "./components/Products"
import Filter from './components/Filter';
import Cart from "./components/Cart"

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      products: data.products,
      cartItems: localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [],
      size: "",
      sort: "",
      visible: true
    }
    this.myRef = React.createRef();
  }
  componentDidMount() {
    if (this.props.match.params.recharge && this.props.match.params.user && this.props.match.params.email && this.props.match.params.money) {
      this.setState({ visible: false });
      (async () => {
        const order = {};
        order.money = this.props.match.params.money;
        order.name = this.props.match.params.user;
        order.email = this.props.match.params.email;
        order.address = this.props.match.params.recharge;
        order.phone = this.props.match.params.phone;
        order.status = 1;

        const response = await fetch("/recharge", {
          "method": "POST",
          "headers": {
            "content-type": "application/json",
          },
          body: JSON.stringify(order)
        });
        const data = await response.json();
        if (response.status == 200) {
          const pd = {
            key: data.key,
            txnid: data.recharging._id,
            amount: data.recharging.money,
            firstname: data.recharging.user,
            email: data.recharging.email,
            phone: order.phone,
            productinfo: data.recharging.productinfo,
            surl: data.url,
            furl: data.url,
            hash: data['hash']
          };
          try {
            var f = document.createElement("form");
            f.setAttribute('method', "post");
            f.setAttribute('action', "https://api.razorpay.com/v1");
            const sortedkeys = Object.keys(pd);
            for (var k = 0; k < sortedkeys.length; k++) {
              var i = document.createElement("input"); //input element, text
              i.setAttribute('type', "hidden");
              i.setAttribute('name', sortedkeys[k]);
              i.setAttribute('value', pd[sortedkeys[k]]);
              f.appendChild(i);
    
            }
            document.getElementsByTagName('body')[0].appendChild(f);
            f.submit();
          } catch (err) {
            console.log(err);
          }
        }
        
      })();
    } else if (this.props.match.params.recharge && this.props.match.params.recharge == 'success') {
      alert("Deposit Successfully");
    } else if (this.props.match.params.recharge && this.props.match.params.recharge == 'failed') {
      alert("Deposit Failed");
    }
  }

  sortProducts = (event) => {
    const sort = event.target.value;
    this.setState({
      sort: sort,
      products: data.products.slice().sort((a, b) => (
        sort === "lowest" ? ((a.price > b.price) ? 1 : -1) : ((sort === "heighest") ? (a.price < b.price ? 1 : -1) : ((a._id > b._id) ? 1 : -1))
      ))
    })
  }

  filterProducts = (event) => {
    if (event.target.value !== "") {
      this.setState({
        size: event.target.value,
        products: data.products.filter((product) => product.availableSizes.indexOf(event.target.value) >= 0)
      })
    }
    else {
      this.setState({
        size: event.target.value,
        products: data.products
      })
    }
  }

  addToCart = (product) => {
    const cartItems = this.state.cartItems.slice();
    let alreadyInCart = false;

    cartItems.forEach((item) => {
      if (item._id === product._id) {
        item.count++;
        alreadyInCart = true;
      }
    })

    if (!alreadyInCart) {
      cartItems.push({ ...product, count: 1 });
    }

    this.setState({
      cartItems
    })

    localStorage.setItem("cartItems", JSON.stringify(cartItems))
  }

  removeFromCart = (product) => {
    const cartItems = this.state.cartItems.slice();

    this.setState({ cartItems: cartItems.filter((item) => item._id !== product._id) });

    localStorage.setItem("cartItems", JSON.stringify(cartItems.filter((item) => item._id !== product._id)))
  }

  createOrder = async (order) => {
    // console.log(order);
    const money = order.cartItems.reduce((a, b) => b.price * b.count + a, 0);
    if (money == 0 || order.email == '' || order.phone == '' || order.name == '')
      return;
    const response = await fetch("/recharge", {
      "method": "POST",
      "headers": {
        "content-type": "application/json",
      },
      body: JSON.stringify({ money, ...order, status: 0 })
    });
    const data = await response.json();
    if (response.status == 200) {
      const pd = {
        key: data.key,
        txnid: data.recharging._id,
        amount: data.recharging.money,
        firstname: data.recharging.user,
        email: data.recharging.email,
        phone: order.phone,
        productinfo: data.recharging.productinfo,
        surl: data.url,
        furl: data.url,
        hash: data['hash']
      };
      try {
        var f = document.createElement("form");
        f.setAttribute('method', "post");
        f.setAttribute('action', "https://secure.payu.in/_payment");
        const sortedkeys = Object.keys(pd);
        for (var k = 0; k < sortedkeys.length; k++) {
          var i = document.createElement("input"); //input element, text
          i.setAttribute('type', "hidden");
          i.setAttribute('name', sortedkeys[k]);
          i.setAttribute('value', pd[sortedkeys[k]]);
          f.appendChild(i);

        }
        document.getElementsByTagName('body')[0].appendChild(f);
        f.submit();
      } catch (err) {
        console.log(err);
      }
    }
  }

  render() {
    const { products, size, sort, cartItems, visible } = this.state;
    const { sortProducts, filterProducts, addToCart, removeFromCart, createOrder } = this;
    return (
      <div className="grid-container">
        <header>
          <a href="/">Clubs</a>
        </header>
        <main>
          <div className="content">

            {
              visible ? (
                <div className="main">
                  <Filter
                    count={products.length}
                    size={size}
                    sort={sort}
                    sortProducts={sortProducts}
                    filterProducts={filterProducts}
                  />
                  <Products
                    products={products}
                    addToCart={addToCart}
                  />
                </div>
              ) : ''
            }


            <div className="sidebar">
              {
                visible ? (
                  <Cart
                    cartItems={cartItems}
                    removeFromCart={removeFromCart}
                    createOrder={createOrder}
                  />
                ) : ''
              }
              <div ref={this.myRef} style={{ textAlign: 'center' }}></div>
            </div>
          </div>
        </main>
        <footer><b href="/about_us.htm" target="about">About Us</b> &nbsp; &nbsp; &nbsp;
        <a href="/contact_us.htm" target="contact_us">Contact US</a> &nbsp; &nbsp; &nbsp;
		 <a href="/shipping_Policy.htm" target="shipping_Policy">Shipping Policy</a> &nbsp; &nbsp; &nbsp;
        <a href="/privacy_Policy.htm" target="privacy_Policy">Privacy Policy</a> &nbsp; &nbsp; &nbsp;
        <a href="/Refund_Policy.htm" target="Refund_Policy">Refund Policy</a> &nbsp; &nbsp; &nbsp;
        <a href="/Terms_and_Conditions.htm" target="Terms_and_Conditions">Terms and Conditions</a></footer>
      </div>
    );
  }
}

export default App;
