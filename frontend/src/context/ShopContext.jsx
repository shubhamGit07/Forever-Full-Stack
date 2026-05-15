import React, {
    createContext,
    useEffect,
    useState
} from "react";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    // =====================================================
    // BASIC VARIABLES
    // =====================================================

    const currency = '$';
    const delivery_fee = 10;

    const backendUrl =
        import.meta.env.VITE_BACKEND_URL;

    const navigate = useNavigate();

    // =====================================================
    // STATES
    // =====================================================

    const [products, setProducts] =
        useState([]);

    const [token, setToken] =
        useState('');

    const [search, setSearch] =
        useState('');

    const [showSearch, setShowSearch] =
        useState(false);

    const [cartItems, setCartItems] =
        useState({});

    // =====================================================
    // FETCH PRODUCTS
    // =====================================================

    const getProductsData = async () => {

        try {

            const response = await axios.get(
                backendUrl + '/api/product/list'
            );

            if (response.data.success) {

                setProducts(
                    response.data.products
                );

            }

            else {

                toast.error(
                    response.data.message
                );

            }

        }

        catch (error) {

            console.log(error);

            toast.error(error.message);

        }

    }

    // =====================================================
    // ADD TO CART
    // =====================================================

    const addToCart = async (
        itemId,
        size
    ) => {

        if (!size) {

            toast.error(
                'Select Product Size'
            );

            return;

        }

        let cartData =
            structuredClone(cartItems);

        if (cartData[itemId]) {

            if (cartData[itemId][size]) {

                cartData[itemId][size] += 1;

            }

            else {

                cartData[itemId][size] = 1;

            }

        }

        else {

            cartData[itemId] = {};
            cartData[itemId][size] = 1;

        }

        setCartItems(cartData);

        localStorage.setItem(
            'cartItems',
            JSON.stringify(cartData)
        );

        // =====================================================
        // SAVE CART IN DATABASE
        // =====================================================

        if (token) {

            try {

                await axios.post(

                    backendUrl + '/api/cart/add',

                    {
                        itemId,
                        size
                    },

                    {
                        headers: {
                            token
                        }
                    }

                );

            }

            catch (error) {

                console.log(error);

                toast.error(error.message);

            }

        }

    }

    // =====================================================
    // UPDATE CART QUANTITY
    // =====================================================

    const updateQuantity = async (
        itemId,
        size,
        quantity
    ) => {

        let cartData =
            structuredClone(cartItems);

        cartData[itemId][size] =
            quantity;

        setCartItems(cartData);

        localStorage.setItem(
            'cartItems',
            JSON.stringify(cartData)
        );

        // =====================================================
        // UPDATE DATABASE
        // =====================================================

        if (token) {

            try {

                await axios.post(

                    backendUrl + '/api/cart/update',

                    {
                        itemId,
                        size,
                        quantity
                    },

                    {
                        headers: {
                            token
                        }
                    }

                );

            }

            catch (error) {

                console.log(error);

                toast.error(error.message);

            }

        }

    }

    // =====================================================
    // GET USER CART
    // =====================================================

    const getUserCart = async (
        token
    ) => {

        try {

            const response =
                await axios.post(

                    backendUrl + '/api/cart/get',

                    {},

                    {
                        headers: {
                            token
                        }
                    }

                );

            if (response.data.success) {

                setCartItems(
                    response.data.cartData
                );

                localStorage.setItem(
                    'cartItems',
                    JSON.stringify(
                        response.data.cartData
                    )
                );

            }

        }

        catch (error) {

            console.log(error);

            toast.error(error.message);

        }

    }

    // =====================================================
    // GET CART COUNT
    // =====================================================

    const getCartCount = () => {

        let totalCount = 0;

        for (const items in cartItems) {

            for (
                const item in
                cartItems[items]
            ) {

                try {

                    if (
                        cartItems[items][item] > 0
                    ) {

                        totalCount +=
                            cartItems[items][item];

                    }

                }

                catch (error) {

                    console.log(error);

                }

            }

        }

        return totalCount;

    }

    // =====================================================
    // GET CART AMOUNT
    // =====================================================

    const getCartAmount = () => {

        let totalAmount = 0;

        for (const items in cartItems) {

            let itemInfo =
                products.find(
                    product =>
                        product._id === items
                );

            if (!itemInfo) {

                continue;

            }

            for (
                const item in
                cartItems[items]
            ) {

                try {

                    if (
                        cartItems[items][item] > 0
                    ) {

                        totalAmount +=

                            itemInfo.price *

                            cartItems[items][item];

                    }

                }

                catch (error) {

                    console.log(error);

                }

            }

        }

        return totalAmount;

    }

    // =====================================================
    // LOAD PRODUCTS
    // =====================================================

    useEffect(() => {

        getProductsData();

    }, []);

    // =====================================================
    // LOAD TOKEN + CART
    // =====================================================

    useEffect(() => {

        async function loadData() {

            const storedToken =
                localStorage.getItem(
                    'token'
                );

            if (storedToken) {

                setToken(storedToken);

                await getUserCart(
                    storedToken
                );

            }

            // =====================================================
            // LOAD LOCAL CART
            // =====================================================

            const localCart =
                localStorage.getItem(
                    'cartItems'
                );

            if (localCart) {

                setCartItems(
                    JSON.parse(localCart)
                );

            }

        }

        loadData();

    }, []);

    // =====================================================
    // CONTEXT VALUE
    // =====================================================

    const value = {

        products,
        currency,
        delivery_fee,

        search,
        setSearch,

        showSearch,
        setShowSearch,

        cartItems,
        setCartItems,

        addToCart,
        updateQuantity,

        getCartCount,
        getCartAmount,

        navigate,
        backendUrl,

        token,
        setToken

    }

    return (

        <ShopContext.Provider value={value}>

            {props.children}

        </ShopContext.Provider>

    )

}

export default ShopContextProvider