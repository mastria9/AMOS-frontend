<template>
    <div id="root" class="root hd--expanded hd--sticky mn--sticky" :class="{ 'mn--max' : !collapse, 'mn--min' : collapse, }">
         <section  class="content" id="content">
 
 
         <div class="content__header content__boxed overlapping">
             <div class="content__wrap">
 
                     <!-- Page title and information -->
                     <h1 class="page-title mb-2">Prodotti Composti (Bulk)</h1>
                     <h2 class="h5">Lista delle schede prodotti composti</h2>
                     <p></p>
                     <!-- END : Page title and information -->
             </div>
         </div>
         <div class="content__boxed">
             <div class="content__wrap">
                 <div class="row p-2 bg-light">
                     <div class="col-12 d-md-flex justify-content-md-end">
                         <a :href="'/product/new/?company='+this.company.id" class="btn btn-success">Nuovo</a>
 
                     </div>
                 </div>
                 <template v-if="this.marketplace">
                     <div class="row p-2 bg-light">
                         <div class="col-4">
                             <img class="me-2 " :src="marketplaceImg" width="30"/>
                             <b>Sei in {{marketplace._code}} {{marketplace._country}} - ({{marketplace.account}})</b>
                         </div>
                     </div>
                     <div class="row p-2 bg-light">
                         <div class="col-3 m-auto ms-0">
                             <b>Cambia Marketplace</b>
                             <select class="form-select ml-2" v-on:change="changeMarketplace($event)">
                                 <option :selected="market.id==this.marketplace.id" v-for="(market,key) in this.marketplaces" :key="key" :value="market.id">{{market._code}} - {{market._country}} - {{market.account}}</option>
                             </select>
                         </div>
                         <div class="col-4 m-auto">
                             <b>Cerca</b>
                             <div class="input-group">
                                 <input type="text" class="form-control"  placeholder="Cerca per sku,gtin,title,descrizione,ecc..." v-on:keyup.enter="this.sendSearch()" v-model="this.search">
                                 <div class="input-group-append"><button class="btn btn-primary" v-on:click="this.sendSearch()">Cerca</button></div>
                             </div>
                             
                         </div>
                         <div class="col-4 m-auto me-0">
                             <b>Visualizza prodotti (n.)</b>
                             <select class="form-select mr-2" v-on:change="this.offset=0; this.limit=$event.target.value; this.getProducts().then(this.getProductsCategories).then(this.getAttributes);">
                                 <option value="20">20</option>
                                 <option value="50">50</option>
                                 <option value="100">100</option>
                                 <option value="200">200</option>
                             </select>
                         </div>
                     </div>
                 </template>
                         
                     <div class="row p-2 bg-light mt-1">
                                 <div class="col-3 m-auto">
                                     <div class="m-auto mb-4 d-md-flex justify-content-md-start">
                                         <b class="p-2">Prodotti </b>
                                         <button class="pt-1 pb-0 btn btn-primary" v-if="this.previous" v-on:click="this.offset=this.offset-this.limit; this.getProducts().then(this.getProductsCategories).then(this.getAttributes)">&lt;&lt;</button>
                                         <b class="m-2">{{parseFloat(this.offset)+1}} - {{parseFloat(this.offset)+parseFloat(this.limit)}}</b>
                                         <button class="pt-1 pb-0 btn btn-primary" v-if="this.next" v-on:click="this.offset=this.offset+this.limit; this.getProducts().then(this.getProductsCategories).then(this.getAttributes)">&gt;&gt;</button>
                                     </div>
                                     <div>
                                         <span v-if="nselected>0" style="color:red;">{{nselected}} di {{count}} Selezionati</span><span v-else>{{nselected}} di {{count}} Selezionati </span><br/>
                                         <a href="#" v-on:click="selectAllProducts(true)"><i><b>Seleziona visibili</b></i></a><span class="p-2"><i><b>/</b></i></span><a href="#" v-on:click="selectAllProducts(false)"><i><b>Deseleziona visibili</b></i></a><span class="p-2"><i><b>/</b></i></span><a href="#" v-on:click="this.deSelectAllProducts(false)"><i><b>Deseleziona tutti</b></i></a>
 
                                     </div>
                                 </div>
                                 <div class="col-4"><ul class="col-12 row" ><template v-for="field,key in this.fields" :key="key"><li class="col-4" style="display: inline;" v-if="field.name!='ID' && field.name!='SKU' && field.name!='Tipo'"><span><input class="mr-2" type="checkbox" v-model="field.show">{{field.name}}</span></li></template></ul></div>
                                 <div class="row col-5 m-auto">
                                     <div class="col-7">
                                         Azioni
                                         <select class="form-select ml-2" v-model="this.actionToDo">
                                             <option value="duplicate">Crea in</option>
                                             <option value="delete">Elimina</option>
                                         </select>
                                         <select v-if="this.actionToDo=='duplicate'" class="form-select ml-2" v-model="this.actionMarket">
                                             <template v-for="(market,key) in this.marketplaces" :key="key">
                                                 <option v-if="market.id!=this.marketplace.id" :value="market.id">{{market._code}} - {{market._country}} - {{market.account}}</option>
                                             </template>
                                         </select>                         
                                     </div>
                                     <div class="col-3 m-auto">
                                         <button class="btn btn-primary" v-on:click="this.doAction()">Esegui</button>
                                     </div>
                                 </div>
                                 
                                 <hr/>
                     </div>
                     <div class="row p-2 bg-light">
                         <table v-if="products && !loading" class="table table-borderless table-striped table-hover table-sm">
                             <thead>
                                 <tr><th></th><th v-for="(field,key) in fields" :key="key" v-show="field.name!=='ID' && field.show">{{field.name}}</th><th></th></tr>    
                             </thead>
                             <tbody>
                                 <tr v-for="(product,index) in products" :key="index">
                                     <td>
                                         <input :id="'check'+product.id" type="checkbox" v-on:change="checkbox(product.id,$event)" v-model="checkboxSelected[product.id]">
                                     </td>
                                     <td v-show="fields['sku'].show">
                                         <b v-if="'sku' in product">{{product['sku']}}</b>
                                     </td>
                                     <td v-show="fields['productType'].show">
                                         <template v-if="'productType' in product">{{product['productType']}}</template>
                                     </td>
                                     <td v-show="fields['category'].show">
                                         <template v-if="'category' in product">{{product['category'].title}}<br/><small>{{product['category'].name}}</small></template>
                                     </td>
                                     <td v-show="fields['bulk_products_qty'].show">
                                        <ul class="p-0 m-0" v-if="'bulk_products_qty' in product" v-for="(obj,id) in product.bulk_products_qty" :key="id">
                                            <li>
                                                <b>{{obj.qty}}</b> di <a :href="'/product/simple/?id='+obj.product.id+'&marketplace='+this.marketplace.id+'&company='+this.company.id">{{obj.product.sku}}</a><br/>
                                            </li>
                                        </ul>
                                     </td>
                                     <td v-show="fields['inStockQty'].show">
                                         <template v-if="'inStockQty' in product">{{product['inStockQty']}}</template>
                                     </td>
                                     <td v-show="fields['gtin'].show">
                                         <template v-if="'gtin' in product">{{product['gtin']}}</template>
                                     </td>
                                     <td v-show="fields['brand'].show">
                                         <template v-if="'brand' in product">{{product['brand']}}</template>
                                     </td>
                                     <td v-show="fields['title'].show">
                                         <template v-if="'title' in product">{{this.calculate(product['title'],product)}}</template>
                                     </td>
                                     <td v-show="fields['short_description'].show">
                                         <template v-if="'short_description' in product">{{this.calculate(product['short_description'],product)}}</template>
                                     </td>
                                     <td v-show="fields['description'].show" style="max-width:500px;">
                                         <template v-if="'description' in product"><code>{{this.calculate(product['description'],product)}}</code></template>
                                     </td>
                                     <td v-show="fields['keywords'].show">
                                         <template v-if="'keywords' in product">{{this.calculate(product['keywords'],product)}}</template>
                                     </td>
                                     <td v-show="fields['bullet_point'].show">
                                         <ol>
                                             <li v-if="'bullet_point1' in product">{{this.calculate(product['bullet_point1'],product)}}</li>
                                             <li v-if="'bullet_point2' in product">{{this.calculate(product['bullet_point2'],product)}}</li>
                                             <li v-if="'bullet_point3' in product">{{this.calculate(product['bullet_point3'],product)}}</li>
                                             <li v-if="'bullet_point4' in product">{{this.calculate(product['bullet_point4'],product)}}</li>
                                             <li v-if="'bullet_point5' in product">{{this.calculate(product['bullet_point5'],product)}}</li>
                                             <li v-if="'bullet_point6' in product">{{this.calculate(product['bullet_point6'],product)}}</li>
                                             <li v-if="'bullet_point7' in product">{{this.calculate(product['bullet_point7'],product)}}</li>
                                             <li v-if="'bullet_point8' in product">{{this.calculate(product['bullet_point8'],product)}}</li>
                                         </ol>
                                     </td>
                                     <td v-show="fields['images'].show">
                                         <span class="d-flex flex-row">
                                             <img title="Immagine principale" class="p-1" v-if="'image0' in product"  width="30" height="30" :src="product['image0']"/><img v-else src="/src/assets/img/uploads/no-image.png" width="30"/>
                                             <img class="p-1" v-if="'image1' in product"  width="30" height="30" :src="product['image1']"/><img v-else src="" width="30"/><img v-else src="/src/assets/img/uploads/no-image.png" width="30"/>
                                             <img class="p-1" v-if="'image2' in product"  width="30" height="30" :src="product['image2']"/><img v-else src="" width="30"/><img v-else src="/src/assets/img/uploads/no-image.png" width="30"/>
                                             <img class="p-1" v-if="'image3' in product"  width="30" height="30" :src="product['image3']"/><img v-else src="" width="30"/><img v-else src="/src/assets/img/uploads/no-image.png" width="30"/>
                                             <img class="p-1" v-if="'image4' in product"  width="30" height="30" :src="product['image4']"/><img v-else src="" width="30"/><img v-else src="/src/assets/img/uploads/no-image.png" width="30"/>
                                             <img class="p-1" v-if="'image5' in product"  width="30" height="30" :src="product['image5']"/><img v-else src="" width="30"/><img v-else src="/src/assets/img/uploads/no-image.png" width="30"/>
                                             <img class="p-1" v-if="'image6' in product"   width="30" height="30" :src="product['image6']"/><img v-else src="" width="30"/><img v-else src="/src/assets/img/uploads/no-image.png" width="30"/>
                                             <img class="p-1" v-if="'image7' in product"  width="30" height="30" :src="product['image7']"/><img v-else src="" width="30"/><img v-else src="/src/assets/img/uploads/no-image.png" width="30"/>
                                             <img title="Miniatura" class="p-1" v-if="'image8' in product"  width="30" height="30" :src="product['image8']"/><img v-else src="/src/assets/img/uploads/no-image.png" width="30"/>
                                         </span>
                                     </td>
                                     <td v-show="fields['attributes'].show">
                                         <template v-if="'category' in product" v-for="(attribute,key) in product.category.attributes" :key="key">
                                             <ul>
                                                 <li v-if="attribute.name in product">
                                                     <template v-if="attribute.type != 'DECIMAL'">
                                                         {{attribute.description}} {{product[attribute.name]}}
                                                     </template>
                                                     <template v-else>
                                                         {{attribute.description}} {{product[attribute.name].value}} {{product[attribute.name].unit}}
                                                     </template>
                                                 </li>
                                             </ul>
                                         </template>
                                     </td>
                                     <td><a class="btn" title="Vedi/Modifica" :href="'/product/bulk/?company='+this.company.id+'&marketplace='+this.marketplace.id+'&id='+product.id"><i class="bi bi-eye"></i></a></td>
                                 </tr>
                             </tbody>
                         </table>
                     </div>
                 </div>
             </div>
             
         <Footer/>
         </section>
             
 
         <HeaderNav :company.sync="company" :collapse.sync="collapse" @update:collapse="this.collapse=!this.collapse" />
         <Sidebar :collapse.sync="collapse" :company.sync="company" :companies.sync="companies" @update:company="(index) => changeCompany(index)" parent="products" child="bulk" @update:collapse="(collapse=false)"/>
     </div>
 </template>
 
 <script>
 
 import Sidebar from "../../../components/Sidebar.vue";
 import HeaderNav from "../../../components/HeaderNav.vue";
 import Footer from "../../../components/Footer.vue";
 import { useToast } from "vue-toastification";
 function initialState (){
   return {
 
             listStage:true,
 
             actionToDo:null,
             actionMarket:null,
             products:[],
             fields: {
                 id: { name :"ID",show:false },
                 sku:{ name :"SKU",show:true },
                 productType: {name :"Tipo",show:true},
                 category:{name:"Categoria",show:true},
                 bulk_products_qty:{name:"Prodotti/Quantità",show:true},
                 inStockQty:{name:"Qtà disponibile",show:true},
                 gtin:{name :"GTIN",show:true},
                 brand:{name :"Marca",show:true},
                 title:{name :"Titolo", show:true},
                 short_description:{ name:"Descrizione Breve",show:true},
                 description: { name :"Descrizione",show:false},
                 keywords:{name :"Parole chiave",show:true},
                 bullet_point:{name :"Punti di forza",show:false},
                 images:{name :"Immagini",show:false},
                 attributes:{name :"Attributi",show:false},
             },
             marketplaces:[],
             marketplaceKey:"",
             marketplace:null,
             marketplaceImg:"",
             search:"",
             filter:false,
             varie:false,
             filters:{
                 sku:{ value:"", action:"==",active:false},
                 title:{ value:"", action:"cc", active:false},
                 description:{value:"", action:"cc", active:false},
                 short_description:{value:"", action:"cc", active:false},
                 images:{ value:true,  active:false},
 
                 keywords:{value :"",active:false},
                 bullet_point:{name :"Punti di forza (Bullet Point)",show:false},
                 attributes:{value:[], active:false}
             },
             collapse:false,
             company:{},
             companies:[],
 
             //Edit product
             product:{},
 
             loading:false,
 
 
             checkboxSelected:{},
             checkboxAllMarketplace:true,
             checkboxMarketplace:{},
 
             count:null,
             limit:20,
             offset:0,
             previous:null,
             next:null,
             
 
 
 
 
 
 
         }
 }
 export default{
     data(){
         return initialState();
     },
     setup(){
         const toast = useToast();
         return { toast }
     },
     mounted(){
         this.init();
     },
     computed:{
             nselected(){
                 var i=0;
                 for(var [key,obj] of Object.entries(this.checkboxSelected)){
                     if(obj){
                         i++;
                     }
                 }
                 return i;
             }
         
         },
     methods:{
         async getProductsCategories(){
             for(let i=0;i<this.products.length;i++){
                 await this.axios.get("/api/products/categories/?company="+this.company.id+"&marketplace="+this.marketplace.id+"&bulk="+this.products[i].id).then((res)=>{
                     if(res.data.results.length>0){
                         this.products[i]["category"]=res.data.results[0];
                         
                     }
              
                 }).catch((error)=>{
                     this.toast.error(error);
                 })
             }
             this.loading=false;
         },
         calculate(text,product){
            
             if(product.category!=null){
                 if("attributes" in product.category){
                     for(var i=0;i<product.category.attributes.length;i++){
                         let search=product.category.attributes[i].name
                         let type=product.category.attributes[i].type
                         let value=""
                         let unit=""
                         if(type=="DECIMAL"){
                             if(search in product){
                                 value=product[search]["value"]
                                 unit=product[search]["unit"]
                             }
                         }
                         else{
                             value=product[search]
                         }
                         if(value==undefined){
                             value="";
                         }
                         var re=new RegExp("%"+search+"%",'g')
                         text=text.replace(re,value)
                         if(type=="DECIMAL"){
                             var reUnit=new RegExp("%"+search+"_unit%",'g')
                             text=text.replace(reUnit,unit)
                         }
                         if((type=="TEXT" || type=="CHAR") && value!=""){
                             var reUpper=new RegExp("%"+search.toUpperCase()+"%",'g')
                             var reTitled=new RegExp("%"+search[0].toUpperCase()+search.slice(1)+"%",'g')
                             text=text.replace(reUpper,value.toUpperCase())
                             text=text.replace(reTitled,value[0].toUpperCase()+value.slice(1))            
                         }
                     
                     }
                     return text
                 }
             }
             return text
             
         },
         async init(){
             this.getCompanies().then(this.getMarketplaces).then(this.getProducts).then(this.getProductsCategories).then(this.getAttributes)
         },
         async getCompanies(){
             try{
                     const res = await this.axios.get("/api/companies/").then((res)=>{
                         
                         if(res.data.results.length==0){
                             this.toast.warning("Nessuna azienda registrata");
                         }
                         else{
                             this.companies=res.data.results;
                             if(this.$route.query.company){
 
                                 for(var i=0;i<this.companies.length;i++){
                                     if(this.companies[i].id==this.$route.query.company){
                                         this.company=this.companies[i];
                                     }
                                 }
                             }
                             else{
                                 this.company=this.companies[0];
                             }
                         }
                             
 
                         
                     }).catch((error)=>{
                         if(error.response!=null){
                         this.toast.error(error.response.data.detail);
                         }
                     })
                 }
                 catch(error) {
                     this.toast.error("Errore indefinito (Azienda)");
                 };
 
         },
         async getMarketplaces(){
             if(this.company!==null){
                 try{
                     const res = await this.axios.get("/api/marketplaces/?company="+this.company.id)
                     this.marketplaces=res.data.results;
                     if(res.data.results.length>0){
                         if(this.$route.query.marketplace!=null){
                             for(var i=0; i<res.data.results.length;i++){
                                 if(res.data.results[i].id==this.$route.query.marketplace){
                                     this.marketplace=res.data.results[i];
                                 }
                             }
                         }
                         else{
                             this.marketplace=res.data.results[0];
                         }
                         this.marketplaceImg="/imgs/"+this.marketplace.code+".png"
                     }
                     else{
                         this.marketplace=null;
                         this.toast.error("Nessun marketplace");
                     }
                 }  
                 catch (error){
                     this.toast.error("Errore indefinito");
                 }  
             }
             
         },
         async getProducts() {
             if(this.marketplace!==null){
                 this.loading=true;
                 var querystring="";
                 for(const [obj,key] of Object.entries(this.filters)){
                     var operator="";
                     var attribute=obj;
                     var value=this.filters[obj].value;
                     var active=this.filters[obj].active;
                     if(attribute!="images" && attribute!="attributes"){
                         operator=(this.filters[obj].action);
                     }
                     if(active){
                         querystring=querystring+"&"+attribute+"="+operator+value
                     }
                 }
             
             try{
                 const res = await this.axios.get("/api/products/bulk/?company="+this.company.id+"&marketplace="+this.marketplace.id+"&offset="+this.offset+"&limit="+this.limit+"&search="+this.search).then((res) => {
                     this.products=[]
                     for(var i=0; i<res.data.results.length; i++){
                         if(res.data.next){
                             this.next=res.data.next;
                         }
                         else{
                             this.next=false;
                         }
                         if(res.data.previous){
                             this.previous=res.data.previous;
                         }
                         else{
                             this.previous=false;
                         }
                         this.count=res.data.count;
                         var obj=res.data.results[i];
                         var product = {
                             "id":obj.id,
                             "sku":obj.sku,
                             "productType":"Composto",
                             "gtin":obj.gtin,
                             "gtin_type":obj.gtin_type,
                             "bulk_products_qty":obj.bulk_products_qty,
                             "inStockQty":obj.inStockQty
                         }
                         for(var k=0; k<obj.text_eav.length;k++){
                             if(obj.text_eav[k].marketplace==this.marketplace.id){
                                 product[obj.text_eav[k].attribute]=obj.text_eav[k].value;
                             }
                         }
                         for(var k=0; k<obj.int_eav.length;k++){
                             if(obj.int_eav[k].marketplace==this.marketplace.id){
                                 product[obj.int_eav[k].attribute]=obj.int_eav[k].value;
                             }
                         }
                         for(var k=0; k<obj.char_eav.length;k++){
                             if(obj.char_eav[k].marketplace==this.marketplace.id){
                                 product[obj.char_eav[k].attribute]=obj.char_eav[k].value;
                             }
                         }
                         for(var k=0; k<obj.decimal_eav.length;k++){
                             if(obj.decimal_eav[k].marketplace==this.marketplace.id){
                                 product[obj.decimal_eav[k].attribute]={}
                                 product[obj.decimal_eav[k].attribute]["value"]=obj.decimal_eav[k].value
                                 product[obj.decimal_eav[k].attribute]["unit"]=obj.decimal_eav[k].unit
                             }
                         }
                         for(var k=0; k<obj.boolean_eav.length;k++){
                             if(obj.boolean_eav[k].marketplace==this.marketplace.id){
                                 product[obj.boolean_eav[k].attribute]=obj.boolean_eav[k].value;
                             }
                         }
                         for(var k=0; k<obj.url_eav.length;k++){
                             if(obj.url_eav[k].marketplace==this.marketplace.id){
                                 product[obj.url_eav[k].attribute]=obj.url_eav[k].value;
                             }
                         }
                         this.products.push(product);
                     };
                     if(this.products.length==0){
                         this.listStage=false;
                     }
                     
                 });
             }
             catch(error){
                 this.toast.error("Errore indefinito");
             }
         }
             
         },
         
         changeCompany(key){
             
             window.location.href='/products/bulk?company='+this.companies[key].id;
             
         },
         changeMarketplace(event){
             window.location.href='/products/bulk?company='+this.company.id+'&marketplace='+event.target.value
         },
         
         
         expand(value){
             if(value==="filter"){
                 this.filter= !this.filter;
                 this.varie=false;
             }
             else if(value==="varie"){
                 this.varie= !this.varie;
                 
                 this.filter=false;
             }
         },
         filtersReset(){
             this.filters={
                 sku:{ value:"", action:"==",active:false},
                 title:{ value:"", action:"cc", active:false},
                 description:{value:"", action:"cc", active:false},
                 short_description:{value:"", action:"cc", active:false},
                 images:{ value:true,  active:false},
                 attributes:{value:[], active:false}
             }
             this.getProducts(this.marketplaceKey);
         },
         
         editProduct(key){
             this.$router.push("/product/bulk?company="+this.company.id+"&id="+key);         
         },
         shutdownProducts(){
 
         },
         checkbox(id,event){
             this.checkboxSelected[id]=event.target.checked;
             if(event.target.checked==false){
                 delete(this.checkboxSelected[id])
             }
         },
         
         selectAllProducts(value){
             for(var i=0; i<this.products.length;i++){
                 this.checkboxSelected[this.products[i].id]=value;
             }
         },
         deSelectAllProducts(){
             for(var key of Object.keys(this.checkboxSelected)){
                 delete(this.checkboxSelected[key])
             }
         },
         
         sendSearch(){
             if(this.search.length==0 || this.search.length>2){
                 this.getProducts().then(this.getProductsCategories).then(this.getAttributes)
             }
         },  
         
         
         async doAction(){
             var id_list=[]
             for(var [id,value] of Object.entries(this.checkboxSelected)){
                 if(value==true){
                     id_list.push(parseInt(id))
                 }
             }
             if(this.actionToDo=="duplicate"){
                 var success=[]
                 var errors=[]

                 for(var [key,product] of Object.entries(this.products)){
                     if(id_list.includes(product.id)){
                         var data={}
                         data["sku"]=product.sku
                         data["gtin"]=product.gtin
                         data["gtin_type"]=product.gtin_type
                         
                         
                         
                         await this.axios.post("/api/products/bulk/?company="+this.company.id+"&marketplace="+this.actionMarket,data).then((res)=>{
                             success.push("Prodotto "+product.sku+ " creato!")
                         }).catch((error)=>{
                             errors.push(error.response.data.detail)
                         })
                         
                         
                     }
                 }
                 if(success.length>0){
                     var messageS=""
                     for(var i=0;i<success.length;i++){
                         messageS+=success[i]+"\n"
                     }
                     this.toast.success(messageS)
                 }
                 if(errors.length>0){
                     var messageE=""
                     for(var i=0;i<errors.length;i++){
                         messageE+=errors[i]+"\n"
                     }
                     this.toast.error(messageE)
                 }
             }
             else if(this.actionToDo=="delete"){
                 for(var i=0;i<id_list.length;i++){
                     await this.axios.delete("/api/products/bulk/"+id_list[i]+"/?company="+this.company.id+"&marketplace="+this.marketplace.id).then((res)=>{
                         this.toast.success("Prodotti eliminati")
                     }).catch((error)=>{
                         this.toast.error(error);
                     })
 
                 }
                this.checkboxSelected={}
                 this.getProducts().then(this.getProductsCategories).then(this.getAttributes)
             }
         },
 
 
     },
     components:{Sidebar,HeaderNav,Footer}
 
 
     
 
 }
 </script>
 