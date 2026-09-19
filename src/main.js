import { createApp } from 'vue'
import {createRouter, createWebHistory} from 'vue-router'
import App from './App.vue'
import "popover/popover.js";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.js";
import "./assets/css/custom.css";

// Dashboard
import Dashboard from './views/Dashboard.vue'
// Login
import Login from './views/Login.vue'

// Utenti
import User from './views/users/User.vue'
import NewUser from './views/users/NewUser.vue'
import Users from './views/users/Users.vue'

// Permessi Aziende Utenti
import Permissions from './views/companies/Permissions.vue'

// Aziende
import Company from './views/companies/Company.vue'
import NewCompany from './views/companies/NewCompany.vue'
import Companies from './views/companies/Companies.vue'

// Marketplace
import Marketplace from './views/marketplaces/Marketplace.vue'
import NewMarketplace from './views/marketplaces/NewMarketplace.vue'
import Marketplaces from './views/marketplaces/Marketplaces.vue'

// Corrieri
import Courier from './views/couriers/Courier.vue'
import NewCourier from './views/couriers/NewCourier.vue'
import Couriers from './views/couriers/Couriers.vue'

// Magazzini
import Warehouse from './views/warehouses/Warehouse.vue'
import NewWarehouse from './views/warehouses/NewWarehouse.vue'
import Warehouses from './views/warehouses/Warehouses.vue'

// Inventario
import Items from './views/items/Items.vue'
import NewItem from './views/items/NewItem.vue'
import Item from './views/items/Item.vue'

// Prodotti
import ProductNew from './views/products/ProductNew.vue'
// Prodotti Semplici
import ProductsSimple from './views/products/simple/ProductsSimple.vue'
import ProductSimple from './views/products/simple/ProductSimple.vue'
// Prodotti Multipli
import ProductsMultiple from './views/products/multiple/ProductsMultiple.vue'
import ProductMultiple from './views/products/multiple/ProductMultiple.vue'
// Prodotti Bulk
import ProductsBulk from './views/products/bulk/ProductsBulk.vue'
import ProductBulk from './views/products/bulk/ProductBulk.vue'
// Prodotti Configurabili
import ProductsConfigurable from './views/products/configurable/ProductsConfigurable.vue'
import ProductConfigurable from './views/products/configurable/ProductConfigurable.vue'

// Categorie
import NewCategory from './views/categories/NewCategory.vue'
import Categories from './views/categories/Categories.vue'
import Category from './views/categories/Category.vue'
// Attributi
import Attributes from './views/attributes/Attributes.vue'
import NewAttribute from './views/attributes/NewAttribute.vue'
import Attribute from './views/attributes/Attribute.vue'
import NewAttributeCustom from './views/attributes/NewAttributeCustom.vue'
import AttributeCustom from './views/attributes/AttributeCustom.vue'


// Ordini
import Orders from './views/orders/Orders.vue'
import Order from './views/orders/Order.vue'


//Imports
import Imports from './views/imports/Imports.vue'
import ImportsNew from './views/imports/ImportsNew.vue'




import Offers from './views/offers/Offers.vue'

import Iva from './views/offers/Iva.vue' 

import Shippings from './views/shippings/Shippings.vue'
import Shipping from './views/shippings/Shipping.vue'
import About from './views/About.vue'


import VueAxios from 'vue-axios'
import axios from 'axios'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import VueCookies from 'vue-cookies'


const options = {
    // You can set your default options here
};



// if($(".selectpicker").length != 0){
//     $(".selectpicker").selectpicker();
// }
const router = createRouter({
    history: createWebHistory(),
    routes:[
        {path : '/dashboard', name: 'Dashboard', component:Dashboard},
        {path : '/login', name: 'Login', component:Login},
        
        {path : '/user', name: 'User', component:User},
        {path : '/users/new/', name: 'NewUser', component:NewUser},
        {path : '/users/', name: 'Users', component:Users},
        
        {path : '/permissions/', name: 'Permessions', component:Permissions},

        {path : '/companies/', name: 'Companies', component:Companies},
        {path : '/company/', name: 'Company', component:Company},
        {path : '/companies/new/', name: 'NewCompany', component:NewCompany},

        {path : '/marketplaces/', name: 'Marketplaces', component:Marketplaces,props:true},
        {path : '/marketplace/', name: 'Marketplace', component:Marketplace,props:true},
        {path : '/marketplaces/new/', name: 'NewMarketplace', component:NewMarketplace,props:true},

        {path : '/couriers/', name: 'Couriers', component:Couriers},
        {path : '/courier/', name: 'Courier', component:Courier},
        {path : '/couriers/new/', name: 'NewCourier', component:NewCourier},

        {path : '/warehouses/', name: 'Warehouses', component:Warehouses},
        {path : '/warehouse/', name: 'Warehouse', component:Warehouse},
        {path : '/warehouses/new/', name: 'NewWarehouse', component:NewWarehouse},

        {path : '/ivas/', name: 'Iva', component:Iva},
        
        {path : '/items/', name: 'Items', component:Items},
        {path : '/items/new/', name: 'NewItem', component:NewItem},
        {path : '/item/', name: 'Item', component:Item},

        {path : '/product/new/', name: 'NewProduct', component:ProductNew},
        {path : '/products/simple/', name: 'SimpleProductsList', component:ProductsSimple},
        {path : '/product/simple/', name: 'SimpleProduct', component:ProductSimple, props:true},
        {path : '/products/multiple/', name: 'MultipleProductsList', component:ProductsMultiple, props:true},
        {path : '/product/multiple/', name: 'MultipleProduct', component:ProductMultiple, props:true},
        {path : '/products/bulk/', name: 'BulkProductsList', component:ProductsBulk, props:true},
        {path : '/product/bulk/', name: 'BulkProduct', component:ProductBulk, props:true},
        {path : '/products/configurable/', name: 'ConfigurableProductsList', component:ProductsConfigurable},
        {path : '/product/configurable/', name: 'ConfigurableProduct', component:ProductConfigurable, props:true},
        
        {path : '/categories/', name: 'Categories', component:Categories},
        {path : '/categories/new/', name: 'NewCategory', component:NewCategory},
        {path : '/category/', name: 'Category', component:Category},
        {path : '/attributes/', name: 'Attributes', component:Attributes},
        {path : '/attributes/new/', name: 'NewAttribute', component:NewAttribute},
        {path : '/attribute/', name: 'Attribute', component:Attribute},
        {path : '/attributes/custom/new/', name: 'NewAttributeCustom', component:NewAttributeCustom},
        {path : '/attribute/custom/', name: 'AttributeCustom', component:AttributeCustom},
        
        {path : '/orders/', name: 'Orders', component:Orders},
        {path : '/order/', name: 'Order', component:Order},
        
        
        
        {path : '/offers/', name: 'Offers', component:Offers},
        
        {path : '/shippings/', name: 'Shippings', component:Shippings},
        {path : '/shipping/', name: 'Shipping', component:Shipping},


        {path : '/about', name: 'About', component:About},
        {path : '/imports', name: 'Imports', component:Imports},
        {path : '/imports/new/', name: 'ImportsNew', component:ImportsNew},



        { path: '/:pathMatch(.*)*',redirect: '/dashboard/'}
    ]
})

router.beforeEach((to, from) => {
    if($cookies.get('Authorization')){
        if(to.name!=="Login")return true;
        return {name:"Dashboard"}
    }
    if(to.name=='Login')return true
    return {name:'Login'}
})

axios.interceptors.request.use(function (config) {
    if(config.url!=="/api/login/"){
        config.headers.Authorization = 'Token '+$cookies.get('Authorization');
    }
    
    return config;
  }, function (error) {
    router.push("/login");
});
axios.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    // Do something with response error
    if(error.response.status === 401){
        $cookies.remove('Authorization');
        router.push("/login");
    }
    return Promise.reject(error);
  });


const app=createApp(App)
app.use(router)

app.use(VueAxios,axios)
app.use(Toast)
app.use(VueCookies, {expire:'7d'})
app.mount('#app')