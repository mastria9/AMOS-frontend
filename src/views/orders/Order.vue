<template>
    <div id="root" class="root hd--expanded hd--sticky mn--sticky" :class="{ 'mn--max' : !collapse, 'mn--min' : collapse, }">
        <section  class="content" id="content" >


        <div class="content__header content__boxed overlapping">
            <div class="content__wrap">
                    <!-- Page title and information -->
                    <h1 class="page-title mb-2">Ordine</h1>
                    <h2 class="h5">Stato del tuo ordine</h2>
                    <p></p>
                    <!-- END : Page title and information -->
            </div>
        </div>
        <div class="content__boxed">
            <div class="content__wrap">
                <div class="row bg-light">
                    <div class="col-12 p-2 d-md-flex justify-content-md-end">
                            <a :href="'/orders/?company='+this.company.id" class="btn btn-primary">Tutti gli ordini</a>
                        </div>

                </div>



                <div class="row p-2 bg-light">
                    <div class="col-md-2 mb-3">
                        <div class="card h-100" v-if="!this.loading">
                            <div class="card-header row">
                                <div class="col-2">
                                    <img width="20" class="me-2" :src="'/imgs/'+this.getMarketById(order.marketplace['id']).code+'.png'"/>
                                </div>
                                <div class="col-10">
                                        <h5 class="card-title">
                                        Ordine {{this.order.order_id}} <br/>da {{this.getMarketById(order.marketplace["id"])._code}} {{this.getMarketById(order.marketplace["id"])._country}} <br/>{{this.getMarketById(order.marketplace["id"]).account}}</h5>
                                    </div>
                                    
                            </div>
                            <div class="card-body">
                                <!-- Horizontal Form -->
                                    <p><b>ID</b><h6>{{ this.order.order_id }}</h6></p>
                                    <p><b>Data ordine</b><h6>{{ this.order.order_detail[0]._date }}</h6></p>
                                    <hr/>
                                    <p><b>Destinatario</b>
                                        <h6>{{this.order.order_detail[0].shipping_name}}</h6>
                                        <h6>{{this.order.order_detail[0].shipping_address}}</h6>
                                        <h6>{{this.order.order_detail[0].shipping_cap}} {{this.order.order_detail[0].shipping_city}} ({{this.order.order_detail[0].shipping_state}}) - {{this.order.order_detail[0].shipping_country}}</h6>
                                    </p>
                                    <p><b>Spedisci entro</b><h6>{{this.order.order_detail[0]._max_shipping_date}}</h6></p>
                                    <p><b>Consegna entro</b><h6>{{this.order.order_detail[0]._max_consignment_date}}</h6></p>

                                    <hr/>
                                    <p>
                                        <b>Totale articoli € (IVA incl.)</b>
                                        <h6>€ {{this.order.order_price}}</h6>
                                    </p>
                                    <p>
                                        <b>Totale Spedizione € (iva incl.)</b>
                                        <h6>€ {{this.order.shipping_price}}</h6>
                                    </p>
                                    <hr/>
                                    <div class="row">
                                        <div>
                                            <h4 class="d-md-flex justify-content-md-start">Totale Ordine (iva incl.)</h4>
                                            <h3 class="d-md-flex justify-content-md-start">€ {{this.order.order_total}}</h3>
                                        </div>
                                    </div>
                                        
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4 mb-3"  v-if="!this.loading">
                        <div class="card h-100">
                            <div class="card-header">
                                <h5 class="card-title"><b class="bi bi-truck me-2 text-primary"></b>Crea Spedizione </h5>
                            </div>
                            <div class="card-body">
                                <div class="row p-2">
                                    <div class="col-12">
                                        <b>Destinatario</b>
                                        <input class="form-control" type="text" v-model="this.shipping.shipping_name"/>
                                    </div>
                                </div>
                                <div class="row p-2">
                                    <div class="col-12">
                                        <b>Telefono</b>
                                        <div class="row">
                                            <div class="col-2 m-auto">
                                                <a :href="'tel:'+this.shipping.shipping_phone"><img width="25" src="/src/assets/img/uploads/telefono.png"/></a>
                                            </div>
                                            <div class="col-10">
                                                <input class="form-control" type="phone" v-model="this.shipping.shipping_phone"/>
                                            </div>
                                        </div>
                                    </div>                                    
                                </div>
                                <div class="row p-2">
                                    <div class="col-12">
                                        <b>Indirizzo</b>
                                        <div class="row">
                                            <div class="col-1 m-auto">
                                                <a target="_blank" :href="'https://www.google.it/maps/place/'+this.shipping.shipping_address+','+this.shipping.shipping_cap+'+'+this.shipping.shipping_city+'+'+this.shipping.shipping_state+'/'">
                                                    <img width="25" src="/src/assets/img/uploads/gmaps.png"/>
                                                </a>
                                            </div>
                                            <div class="col-11">
                                                <input class="form-control" type="text" v-model="this.shipping.shipping_address"/>
                                            </div>
                                        </div>
                                        <b></b>
                                    </div>
                                </div>
                                <div class="row p-2">
                                    <div class="col-6">
                                        <b>CAP</b><input class="form-control" type="text" v-model="this.shipping.shipping_cap"/>
                                    </div>
                                    <div class="col-6">
                                        <b>Città</b>
                                        <input class="form-control" type="text" v-model="this.shipping.shipping_city"/>
                                    </div>
                                </div>
                                <div class="row p-2">
                                    <div class="col-6">
                                        <b>Provincia</b><input class="form-control" type="text" v-model="this.shipping.shipping_state"/>
                                    </div>
                                    <div class="col-6">
                                        <b>Nazione</b>
                                        <select class="form-select" v-model="this.shipping.shipping_country">
                                                    <option value="IT">Italia</option>
                                                    <option value="ES">Spagna</option>
                                                    <option value="FR">Francia</option>
                                                    <option value="BE">Belgio</option>
                                                    <option value="DE">Germania</option>
                                                    <option value="UK">United Kingdom</option>
                                                </select>
                                    </div>
                                </div>
                                <hr/>
                                <div class="row p-2">
                                    <b>Da spedire</b>
                                    <template v-for="product,key in this.shipping.shippedProducts" :key="key">
                                        <div class="col-6">
                                            <h6>{{ product.sku }}</h6>
                                        </div>
                                        <div class="col-6">
                                            <input type="number" min="0" class="form-control" v-model="product.qty">
                                        </div>
                                    </template>
                                </div>
                                <hr/>
                                <div class="row p-2">
                                    <b>Corriere</b>
                                    <select class="form-select" v-model="this.shipping.courier">
                                        <option value="custom">Personale</option>
                                        <option v-for="(courier,key) in this.couriers" :key="key" :value="courier.id">{{ courier.name }} {{ courier.location }} da Magazzino {{ courier.warehouse.name }}</option>
                                    </select>
                                </div>
                                <div class="row p-2">
                                    <div class="col-2">
                                        <b>Colli</b>
                                        <input class="form-control" v-model="this.shipping.pack" type="number" min="1">
                                    </div>
                                    <div class="col-4">
                                        <b>Peso (gr.)</b><input v-model="this.shipping.weight" class="form-control" type="text" min="1">
                                        <small class="text-danger">{{ parseFloat(this.shipping.weight)/1000}} KG</small>
                                    </div>
                                    <div class="col-4">
                                        <b>Volume (mm3)</b><input v-model="this.shipping.volume" class="form-control" type="text" min="1">
                                        <small class="text-danger">{{ parseFloat(this.shipping.volume)/1000000000}} m3</small>
                                    </div>
                                    <div class="col-2 m-auto mb-0">
                                        <button class="btn btn-info" v-on:click="this.calculateWeightAndVolume()">Calcola</button>
                                    </div>
                                </div>
                                <div class="row p-2">
                                    <div class="col-6">
                                        <b>Contrassegno</b>
                                        <select class="form-select" v-model="this.shipping.cod_method">
                                            <option value="C">Contante</option>
                                            <option value="A">Assegno</option>
                                            <option value="D">Nessuno</option>
                                        </select>
                                    </div>
                                    <div class="col-6">
                                        <b>Importo</b>
                                        <input class="form-control" type="number" v-model="this.shipping.cod" :disabled="this.shipping.cod_method=='D'">
                                    </div>
                                </div>
                                <div class="row p-2">
                                    <div class="col-12">
                                        <b>Istruzioni</b>
                                        <input class="form-control" type="text"  v-model="this.shipping.shipping_instructions">
                                    </div>
                                </div>
                                <div class="row p-2">
                                    <button class="btn btn-primary" v-on:click="this.createShipping()" v-if="this.shipping.weight && this.shipping.volume && this.shipping.courier">Crea spedizione</button>
                                </div>
                                <!-- <div class="row p-2">
                                    
                                </div>
                                 
                                
                                 <div class="col-7 d-md-flex justify-content-md-end m-auto">
                                 </div>
                                 <div class="col-5 d-md-flex justify-content-md-end m-auto">
                                     <button v-if="this.courier=='custom'" class="btn btn-primary">Crea spedizione</button>
                                     <button v-else class="btn btn-primary" v-on:click="this.sendShipping()">Crea spedizione con {{this.couriers[this.courier].name}}</button>
                                 </div>-->
                            </div>
                            <div class="card-footer row ">
                                    
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6 mb-3">
                        <div class="card" v-for="shipped,key in this.shippings" :key="key">
                            <div class="card-header">
                                <div class="row">
                                    <div class="col-6">
                                        <h5 class="card-title"><b class="bi bi-truck me-2 text-primary"></b>Spedizione creata</h5>
                                    </div>
                                    <div class="col-6">
                                        <b>Stato:</b>  <template v-if="shipped.status=='N'"><b class="text-danger">In attesa di conferma</b></template>
                                        
                                    </div>
                                </div>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-8">
                                        <table class="table table-sm table-responsive">
                                            <tr><th>Rif. Ordine</th><td colspan="7">{{ this.order.order_id }}</td></tr>
                                            <tr><th>Destinatario</th><td colspan="7">{{ shipped.shipping_name }}, {{shipped.shipping_address}}, {{shipped.shipping_cap}} {{shipped.shipping_city}} {{shipped.shipping_state}}, {{shipped.shipping_country}}</td></tr>
                                            <tr><th>Telefono</th><td colspan="7">{{ shipped.shipping_phone}}</td></tr>
                                        </table>
                                        <table class="table mt-0 pt-0">
                                            <tr>
                                                <td>
                                                    <table>
                                                        <tr>
                                                            <th>Colli</th><td>{{shipped.pack}}</td></tr>
                                                            <tr><th>Peso</th><td>{{shipped.weight}}</td></tr>
                                                            <tr><th>Volume</th><td>{{shipped.volume}}</td></tr>
                                                            <tr><th>Peso/Volume</th><td>{{ shipped_weight_volume }}</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                <td class="bg-light p-2">
                                                    <table class="table ">
                                                        <th>SKU</th><th>Qty</th>
                                                        <tr v-for="prod,qty in shipped.shipped_products" :key="key">
                                                            <th>{{prod.sku}}</th><th>{{prod.qty}}</th>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                    <div class="col-4">
                                        <table class="table">
                                            <tr><th>Tracking</th><td><a :href="shipped.tracking_url">{{shipped.tracking}}</a></td></tr>
                                            <tr><th>LDV</th><td><a href="" ><i style="font-size:1.5rem" class="bi bi-upc-scan"></i></a></td></tr>
                                        </table>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-4 m-auto d-md-flex justify-content-md-start">
                                        <button class="btn btn-success" v-if="!shipped.sent" v-on:click="deleteShipping(shipped.id)">Annulla</button>
                                    </div>
                                    <div class="col-4 m-auto d-md-flex justify-content-md-end">
                                        <button class="btn btn-danger" v-if="!shipped.sent">Conferma</button>
                                    </div>

                                </div>

                            </div>
                            
                        </div>
                        
                    </div>
                </div>


                <div class="row p-2 bg-light">
                    <div class="card">
                        <div class="card-header">
                            <h6 class="card-title"><b class="bi bi-box me-2"></b>Articoli</h6>
                        </div>
                        <div class="card-body">
                            <table class="table table-sm table-striped table-center" v-if="!this.loading">
                                <thead>
                                    <tr>
                                        <th>ID Ordine Prodotto</th>
                                        <th>SKU</th>
                                        <th>Titolo</th>
                                        <th>Quantità</th>
                                        <th>Spedisci entro</th>
                                        <th>Consegna entro</th>
                                        <th>Prezzo € (IVA incl.)</th>
                                        <th>IVA €</th>
                                        <th>Spedizione € (IVA incl.)</th>
                                        <th>IVA Sped. €</th>
                                        <th>B2B</th>
                                        <th>Stato</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(detail,key) in this.order.order_detail" :key="key">
                                        <td><b>{{detail.order_item_id}}</b></td>
                                        <td>
                                            <template v-if="detail.product_type=='S'">
                                                <a :href="'/product/simple/?id='+detail.product_id+'&company='+this.company.id+'&marketplace='+detail.marketplace">{{detail.sku}}</a>
                                            </template>
                                            <template v-else-if="detail.product_type=='M'">
                                                <a :href="'/product/multiple/?id='+detail.product_id+'&company='+this.company.id+'&marketplace='+detail.marketplace">{{detail.sku}}</a>
                                            </template>
                                            <template v-else-if="detail.product_type=='B'">
                                                <a :href="'/product/bulk/?id='+detail.product_id+'&company='+this.company.id+'&marketplace='+detail.marketplace">{{detail.sku}}</a>
                                            </template>
                                            
                                        </td>
                                        <td>{{detail.title}}</td>
                                        <td>{{detail.qty}}</td>
                                        <td>{{detail.max_shipping_date}}</td>
                                        <td>{{detail.max_consignment_date}}</td>
                                        <td>{{detail.price}}</td>
                                        <td>{{detail.iva}}</td>
                                        <td>{{detail.shipping_price}}</td>
                                        <td>{{detail.shipping_iva}}</td>
                                        <td><b v-if="detail.business"><b class="text-primary bi bi-check"></b></b></td>
                                        <td>{{detail._status }}</td>
                                    </tr>
                                </tbody>
                            </table> 
                                

                        </div>

                    </div>
                                            
                </div>
            </div>
        </div>  
    <Footer/>
        </section>
            

        <HeaderNav :company.sync="company" :collapse.sync="collapse" @update:collapse="this.collapse=!this.collapse" />
        <Sidebar :collapse.sync="collapse" :company.sync="company" :companies.sync="companies" @update:company="(index) => changeCompany(index)" parent="orders" @update:collapse="(collapse=false)"/>
    </div>
    
</template>

<script>

import Sidebar from "../../components/Sidebar.vue";
import HeaderNav from "../../components/HeaderNav.vue";
import Footer from "../../components/Footer.vue";
import { useToast } from "vue-toastification";
function initialState (){
  return {
    collapse:false,
            couriers:[],
            courier:"custom",
            orders:[],
            fields: {
                id: { name :"ID",show:false },
                order_id:{ name :"Num Ordine",show:true },
                marketplaceDescription: {name :"Marketplace",show:true},
                _date:{name :"Data",show:true},
                _status:{name :"Stato",show:true},
                customer:{name :"Ordinato da", show:true},
                shipping:{ name:"Spedito con",show:false},
                
                // description: { name :"Descrizione",show:false},
                // images:{name :"Immagini",show:true},
                // keywords:{name :"Parole chiave",show:false},
                // bullet_point:{name :"Punti di forza (Bullet Point)",show:false},
                // attributes:{name :"Attributi",show:false},
            },
            marketplaces:[],
            tot_articles:0,
            tot_shippings:0,
            shippings:[],
            shipping:{},
            
            search:false,
            filter:false,
            varie:false,
            filters:{
                date:{ value:"", action:"==",active:false},
                marketplace:{value:"",action:"==",active:false},
                status:{ value:"", action:"cc", active:false},
                shipping:{value:"", action:"cc", active:false},
                customer:{value:"", action:"cc", active:false},
            },
            company:{},
            companies:[],

            //Edit product
            order:{},
            
            loading:true,


            selected:{},

            count:null,
            limit:20,
            page:1,
            next:null,
            previous:null,






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
        
    },
	methods:{
        async init(){
            
            this.getCompanies().then(this.getMarketplaces).then(this.getOrder).then(this.getCouriers).then(this.getShippings).then(this.calculateWeightAndVolume)
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
                }  
                catch (error){
                    this.toast.error("Errore indefinito");
                }  
            }
        },

        async getCouriers(){
                try{
                    const res = await this.axios.get("/api/couriers/?company="+this.company.id+"&active=1")
                    this.couriers=res.data.results;
                }  
                catch (error){
                    this.toast.error("Errore indefinito");
                }  
        },
        async getShippings(){
                try{
                    const res = await this.axios.get("/api/shippings/?company="+this.company.id+"&marketplace="+this.order.marketplace.id+"&order="+this.order.id)

                    this.shippings=res.data.results;
                    for(let i=0;i<this.shippings.shippedProducts.length;i++){
                        for(let k=0;i<this.shipping.shippedProducts.length;k++){
                            if(this.shippings.shippedProducts[i].sku==this.shipping.shippedProducts[i].sku){
                                this.shipping.shippedProducts[i].qty-=this.shippings.shippedProducts[i].qty
                            }
                        }
                    }
                }  
                catch (error){
                    this.toast.error("Errore indefinito");
                }  
        },

        

        
        async getOrder() {
            
        
            try{
                const res = await this.axios.get("/api/orders/"+this.$route.query.id+"/?company="+this.company.id).then((res) => {
                    
                    this.order=res.data;
                    this.shipping["shippedProducts"]=[]
                    for(let i=0;i<this.order.order_detail.length;i++){
                        let shipProd={}
                        shipProd["sku"]=this.order.order_detail[i].sku
                        shipProd["qty"]=this.order.order_detail[i].qty
                        shipProd["product_type"]=this.order.order_detail[i].product_type
                        this.shipping.shippedProducts.push(shipProd)
                    }
                    let order_detail=this.order.order_detail[0]
                    this.shipping["marketplace"]=order_detail["marketplace"]
                    this.shipping["order_id"]=this.order.id
                    this.shipping["shipping_name"]=order_detail["shipping_name"]
                    this.shipping["shipping_address"]=order_detail["shipping_address"]
                    this.shipping["shipping_phone"]=order_detail["shipping_phone"]
                    this.shipping["shipping_city"]=order_detail["shipping_city"]
                    this.shipping["shipping_cap"]=order_detail["shipping_cap"]
                    this.shipping["shipping_country"]=order_detail["shipping_country"]
                    this.shipping["shipping_state"]=order_detail["shipping_state"]
                    this.shipping["shipping_instructions"]=order_detail["shipping_instructions"]
                    this.shipping["cod_method"]="D"
                    this.shipping["cod"]=0
                    this.shipping["pack"]=1
                    this.shipping.volume=0
                    this.shipping.weight=0
                    
                    

                    for(let i=0;i<this.order.order_detail.length;i++){
                        this.shipping["cod"]+=parseFloat(this.order.order_detail[i].price)+parseFloat(this.order.order_detail[i].shipping_price)
                    }
                    this.loading=false;
                });
            }
            catch(error){
                this.toast.error("Errore indefinito");
            }
        
            
        },
        
        changeCompany(key){
            window.location.href='/orders/?company='+this.companies[key].id;
            
        },
        
        
        
        createShipping(){
            let shipping=this.shipping
            for(var i=0;i<shipping.shippedProducts.length;i++){
                if(shipping.shippedProducts[i].qty==0){
                    shipping.shippedProducts.splice(i,1)
                }
            }
            if(shipping.shippedProducts.length<1){
                this.toast.error("Nessun articolo inserito nella spedizione")
                return
            }
            
            this.axios.post("/api/shippings/?company="+this.company.id,shipping).then((res)=>{
                this.toast.success("Spedizione creata")
            }).catch((error)=>{
                this.toast.error(res)
            })
        },
        confirmShipping(){

        },
        deleteShipping(id){
            this.axios.delete("/api/shippings/"+id+"/?company="+this.company.id).then((res)=>{
                this.toast.success("Spedizione eliminata")
                this.$router.go()
            }).catch((error)=>{
                this.toast.error(res)
            })
        },
        
        
        async calculateWeightAndVolume(){
            
            let weight=0;
            let volume=0;
            
            for(let i=0;i<this.order.order_detail.length;i++){
                
                for(let k=0;k<this.shipping.shippedProducts.length;k++){
                    if(this.order.order_detail[i].sku==this.shipping.shippedProducts[k].sku){
                        console.log("OK")
                        let type=null
                        if(this.order.order_detail[i].product_type=="S"){
                            type="simple"
                        }
                        else if(this.order.order_detail[i].product_type=="M"){
                            type="multiple"
                        }
                        else if(this.order.order_detail[i].product_type=="B"){
                            type="bulk"
                        }
                        else{
                            this.toast.warning("Non posso calcolare automaticamente il peso e il volume")
                            return;
                        }
                        let res= await this.axios.get('/api/products/'+type+'/'+this.order.order_detail[i].product_id+'/?company='+this.company.id+'&marketplace='+this.order.order_detail[i].marketplace).then((response)=>{
                            if(type=="simple"){
                                weight=weight+parseFloat(response.data.item.weight)*parseInt(this.shipping.shippedProducts[k].qty)
                                volume=volume+(parseFloat(response.data.item.length)*parseFloat(response.data.item.height)*parseFloat(response.data.item.width)*parseInt(this.shipping.shippedProducts[k].qty))
                                
                            }
                        })
                        console.log(this.order.order_detail[i]["product_id"])
    
                    }
                    
                }
            }
            
            this.shipping.weight=weight
            this.shipping.volume=volume
        
        },
        

        
        

        getMarketById(id){
            for(var i=0;i<this.marketplaces.length;i++){
                if(id==this.marketplaces[i].id){
                    return this.marketplaces[i];
                }
            }
        },

    },
    components:{
        Sidebar,Footer,HeaderNav
        
    }


    

}
</script>
<style scoped>

#left-col{
    position:fixed;
    width:400px;
    right:var(--right-width);
    
  padding: 10px ;
    color: rgb(26, 26, 26);
    min-height:100px;

  background:
    linear-gradient(white, white) padding-box,
    linear-gradient(to right, #FFA534, #FFA534) border-box;
    
  border-right : 5px solid transparent;
  border-left : 5px solid transparent;
  border-top : 1px solid transparent;
  border-bottom : 1px solid transparent;
  

        }

td{
    padding:5px 5px 5px 5px;
}
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(500px);
  opacity: 0;
}
.z-9{
    z-index:999999;
}
</style>