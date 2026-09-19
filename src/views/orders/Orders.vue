<template>
  <div id="root" class="root hd--expanded hd--sticky mn--sticky" :class="{ 'mn--max' : !collapse, 'mn--min' : collapse, }">
        <section  class="content" id="content">


        <div class="content__header content__boxed overlapping">
            <div class="content__wrap">

                    <!-- Page title and information -->
                    <h1 class="page-title mb-2">Ordini</h1>
                    <h2 class="h5">Stato dei tuoi ordini</h2>
                    <p></p>
                    <!-- END : Page title and information -->
            </div>
        </div>
        <div class="content__boxed">
            <div class="content__wrap">
                
                 <div class="row p-2 bg-light">
                        
                        <div class="col-4 m-auto">
                            <b>Cerca</b>
                            <div class="input-group">
                                <input type="text" class="form-control"  placeholder="Cerca per codice,destinatario,indirizzo,città,cap,provincia,telefono..." v-on:keyup.enter="this.offset=0; this.limit=20; this.getOrders()" v-model="this.search">
                                <div class="input-group-append"><button class="btn btn-primary" v-on:click="this.offset=0; this.limit=20; this.getOrders()">Cerca</button></div>
                            </div>
                        </div>
                        <div class="col-4"></div>
                        <div class="col-4 m-auto me-0">
                            <b>Visualizza ordini (n.)</b>
                            <select class="form-select mr-2" v-on:change="this.offset=0; this.limit=$event.target.value; this.getOrders();">
                                <option value="20">20</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                                <option value="200">200</option>
                            </select>
                        </div>
                    </div>
                    <div class="row p-2 bg-light mt-1">
                                <div class="col-9 m-auto">
                                    <div class="m-auto mb-4 d-md-flex justify-content-md-start">
                                        <b class="p-2">Ordini </b>
                                        <button class="pt-1 pb-0 btn btn-primary" v-if="this.previous" v-on:click="this.offset=this.offset-this.limit; this.getOrders()">&lt;&lt;</button>
                                        <b class="m-2">{{parseFloat(this.offset)+1}} - {{parseFloat(this.offset)+parseFloat(this.limit)}}</b>
                                        <button class="pt-1 pb-0 btn btn-primary" v-if="this.next" v-on:click="this.offset=this.offset+this.limit; this.getOrders()">&gt;&gt;</button>
                                    </div>
                                    <div>
                                        <span v-if="nselected>0" style="color:red;">{{nselected}} di {{count}} Selezionati</span><span v-else>{{nselected}} di {{count}} Selezionati </span><br/>
                                        <a href="#" v-on:click="selectAllItems(true)"><i><b>Seleziona visibili</b></i></a><span class="p-2"><i><b>/</b></i></span><a href="#" v-on:click="selectAllItems(false)"><i><b>Deseleziona visibili</b></i></a><span class="p-2"><i><b>/</b></i></span><a href="#" v-on:click="this.deSelectAllItems(false)"><i><b>Deseleziona tutti</b></i></a>

                                    </div>
                                </div>
                                
                                <div class="row col-3 m-auto d-md-flex justify-content-md-end">
                                  
                                  
                                    </div>
                                    
                                
                                <hr/>
                    </div>
                <div class="row p-2 bg-light">
                        <div class="col-12 mt-4 pt-4" v-if="loading"><span class="spinner-border  text-warning" role="status"></span></div>
                        
                        <table v-if="!loading" class="table table-striped table-center">
                            <thead>
                                <tr>
                                    <th></th><th>ID</th><th>Marketplace</th><th>Data ordine</th><th>Spedire entro</th><th>Consegna entro</th><th>Destinatario</th><th>Indirizzo</th><th>Città</th><th>CAP</th><th>Provincia</th><th>Nazione</th><th>Telefono</th><th>Totale</th><th>Stato ordine</th><th>Visualizza</th>
                                </tr>
                            </thead>
                            <tbody>
                                <template v-for="(order,index) in this.orders" :key="index">
                                    <tr>
                                        <td><input :id="'check'+order.id" type="checkbox" v-on:change="checkbox(order.id,$event)" v-model="checkboxSelected[order.id]"></td>
                                        <td><b>{{order.order_id}}</b></td>
                                        <td><img width="20" class="me-2" :src="'/imgs/'+this.getMarketById(order.marketplace['id']).code+'.png'"/>{{this.getMarketById(order.marketplace["id"])._country}}</td>
                                        <td>{{order.order_detail[0]._date}}</td>
                                        <td>{{order.order_detail[0]._max_shipping_date}}</td>
                                        <td>{{order.order_detail[0]._max_consignment_date}}</td>
                                        <td><b>{{(order.order_detail[0].shipping_name||"").toUpperCase()}}</b></td>
                                        <td><a target="_blank" :href="'https://www.google.it/maps/place/'+order.order_detail[0].shipping_address+','+order.order_detail[0].shipping_cap+'+'+order.order_detail[0].shipping_city+'+'+order.order_detail[0].shipping_state+'/'"><i class="me-2 bi-globe-europe-africa"></i>{{(order.order_detail[0].shipping_address||"").toUpperCase()}}</a></td>
                                        <td>{{(order.order_detail[0].shipping_city||"").toUpperCase()}}</td>
                                        <td>{{order.order_detail[0].shipping_cap}}</td>
                                        <td>{{(order.order_detail[0].shipping_state||"").toUpperCase()}}</td>
                                        <td><img :src="'/src/assets/img/flags/'+(order.order_detail[0].shipping_country||'').toUpperCase()+'.png'"/><b class="ms-2">{{(order.order_detail[0].shipping_country||"").toUpperCase()}}</b></td>
                                        <td><a :href="'tel:'+order.order_detail[0].shipping_phone">{{order.order_detail[0].shipping_phone}}</a></td>
                                        <td>{{(parseFloat(order.order_price)+parseFloat(order.shipping_price)).toFixed(2)}}</td>
                                        <td>{{order.order_detail[0]._status}}</td>
                                        <td><template v-if="order.order_detail[0].business"><b>B2B</b></template></td>
                                        <td><a class="btn btn-outline-primary" :href="'/order/?id='+order.id+'&company='+this.company.id"><i class="bi bi-eye"></i></a></td>

                                    </tr>
                                    <!-- <template v-if="order.show">
                                    <tr style="background-color:white !important; border:2px solid var(--warning);">
                                        <td colspan="1"></td>
                                        <td colspan="11">
                                            <table class="table table-borderless">
                                                <tr style="background-color:unset !important;">
                                                    <th colspan="2"></th><th>SKU</th><th colspan="2">Titolo</th><th>Qtà</th><th>Prezzo art.</th><th>IVA art.</th><th>Prezzo sped.</th><th>IVA sped.</th>
                                                </tr>
                                                <tr v-for="(val,key) in order.order_detail" :key="key" :val="val" style="background-color:unset !important;">
                                                    <td colspan="2"></td>
                                                    <td><b>{{val.sku}}</b></td>
                                                    <td colspan="2">{{val.title}}</td>
                                                    <td>{{val.qty}}</td>
                                                    <td>{{val.price}}</td>
                                                    <td>{{val.iva}}</td>
                                                    <td>{{val.shipping_price}}</td>
                                                    <td>{{val.shipping_iva}}</td>
                                                </tr>
                                                
                                                <tr style="border-top:1px solid black"><td colspan="11"></td></tr>
                                                
                                                <tr style="background:var(--warning)"><td colspan="6"></td><th>{{order.order_price}}</th><th>{{order.order_iva}}</th><th>{{order.shipping_price}}</th><th>{{order.shipping_iva}}</th></tr>
                                                <tr><td colspan="11"></td></tr>
                                                <tr><td colspan="8"></td><th style="border-top:1px solid black">Tot ordine</th><th style="border-top:1px solid black">{{(parseFloat(order.order_price)+parseFloat(order.shipping_price)).toFixed(2)}}</th></tr>
                                                <tr><td colspan="8"></td><th>Totale IVA</th><th>{{(parseFloat(order.order_iva)+parseFloat(order.shipping_iva)).toFixed(2)}}</th></tr>
                                                <tr><td colspan="8"></td><th>Totale IVA incl.</th><th>{{order.order_shipping_total}}</th></tr>
                                            </table>
                                            <hr/>
                                            <button class="btn btn-warning float-right">Modifica</button>
                                        </td>
                                    </tr>
                                    
                                    </template> -->
                                </template>
                                
                                
                                        
                                        
                                        
                                        
                                    <!-- <td v-for="(field,key) in fields" :key="key" v-show="key!='id'"><template v-if="key=='order_id'"><b>{{order[key]}}</b></template><template v-else>{{order[key]}}</template></td> -->
                            </tbody>
                        </table>
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
import Footer from "../../components/Footer.vue";
import HeaderNav from "../../components/HeaderNav.vue";
import { useToast } from "vue-toastification";
function initialState (){
  return {

            listStage:true,
            collapse:false,
            search:"",
            orders:[],
            fields: {
                id: { name :"ID",show:false },
                order_id:{ name :"Num Ordine",show:true },
                marketplaceDescription: {name :"Marketplace",show:true},
                date:{name :"Data",show:true},
                _status:{name :"Stato",show:true},
                customer:{name :"Ordinato da", show:true},
                shipping:{ name:"Spedito con",show:false},
            },
            marketplaces:[],
            marketplace:"",
            
            company:{},
            companies:[],

            
            order:{},
            
            loading:false,


            checkboxSelected:{},

            count:null,
            limit:20,
            offset:0,
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
            this.getCompanies().then(this.getMarketplaces).then(this.getOrders)
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
                    })
                }
                catch(error) {
                    if(error.response!=null){
                        this.toast.error(error.response.data.detail);
                    }
                    else{
                        this.toast.error("Errore indefinito");
                    }
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
        async getOrders() {
            this.loading=true;
            var querystring="";
            
        
            try{
                const res = await this.axios.get("/api/orders/?company="+this.company.id+"&limit="+this.limit+"&offset="+this.offset+"&search="+this.search+"&marketplace="+this.marketplace).then((res) => {
                    this.orders=res.data.results;
                    this.loading=false;
                });
            }
            catch(error){
                this.toast.error("Errore indefinito");
            }
        
            
        },
        
        
        
        
        deleteOrder(){
            var url="/api/orders/delete/?company="+this.company.id
            this.axios.post(url,this.checkboxSelected).then((res) => {
                this.toast.success("Ordine cancellato")
                this.checkboxSelected={};
                this.getOrders();
            }).catch((error)=>{
                this.toast.error(error.response.detail)
                this.getOrders();
            })
            
        },


        checkbox(id,event){
            this.checkboxSelected[id]=event.target.checked;
            if(event.target.checked==false){
                delete(this.checkboxSelected[id])
            }
        },

        selectAllOrders(value){
            for(var i=0; i<this.orders.length;i++){
                this.checkboxSelected[this.orders[i].id]=value;
            }
        },
        

        getMarketById(id){
            for(var i=0;i<this.marketplaces.length;i++){
                if(id==this.marketplaces[i].id){
                    return this.marketplaces[i];
                }
            }
        },
        changeCompany(key){
             
            window.location.href='/orders/?company='+this.companies[key].id;
             
        },

    },
    components:{Sidebar,HeaderNav,Footer}


    

}
</script>
<style scoped>



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