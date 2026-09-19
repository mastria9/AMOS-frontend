<template>
   <div id="root" class="root hd--expanded hd--sticky mn--sticky" :class="{ 'mn--max' : !collapse, 'mn--min' : collapse, }">
        <section  class="content" id="content">


        <div class="content__header content__boxed overlapping">
            <div class="content__wrap">

                    <!-- Page title and information -->
                    <h1 class="page-title mb-2">Aziende</h1>
                    <h2 class="h5">Stato delle tue Aziende</h2>
                    <p></p>
                    <!-- END : Page title and information -->
            </div>
        </div>
        <div class="content__boxed">
            <div class="content__wrap">
                <div class="row">
                    <div class="col-md-11" style="text-align:left">
                        
                    </div>
                    <div class="col-md-1"></div>
                </div>
            </div>
            <div class="center" v-if="shippings"> 
                <div class="container-fluid">
                    
                    <table v-if="shippings" class="table table-borderless table-striped table-hover table-sm">
                        <thead>
                            <tr><th v-for="(field,key) in fields" :key="key" v-show="field.name!=='ID'">{{field.name}}</th></tr>    
                        </thead>
                        <tbody>
                            <tr v-for="(shipping,index) in shippings" :key="index">
                                <td v-for="(field,key) in fields" :key="key" v-show="key!='id'">{{shipping[key]}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="right">
                <div>
                    <Transition name="slide-fade">
                        <div id="left-col" class="mt-5" v-if="search || filter || sort">
                            
                            <div v-if="search">
                                <h5><b>Ricerca</b></h5>
                                <p><input type="text" class="form-control" placeholder="Cerca per sku,gtin,title,descrizione,ecc..."></p>
                                <p><button type="button" class="mr-2 btn btn-outline">Reset</button><button type="button" class="btn btn-warning ms-2">Cerca</button></p>
                            </div>
                            <div v-if="filter">
                                <h5><b>Filtri</b></h5>
                            </div>
                        </div>
                    </Transition>
                    <div class="pt-5" v-if="marketplace">
                        <div class="p-2"><b>Azioni</b></div>
                        <ul class="nav nav-pills flex-column ">
                            <li class="nav-item"><button class="btn btn-outline" :class="{ active : search  }" v-on:click="expand('search')" title="Cerca"><span class="material-icons">search</span></button></li>
                        </ul>
                        <hr>
                        <ul class="nav nav-pills flex-column">
                            <li class="nav-item"><button class="btn btn-outline" :class="{ active : sort  }" v-on:click="expand('sort')" title="Ordina"><span class="material-icons">sort</span></button></li>
                        </ul>
                        
                        <hr>
                        
                        <ul class="nav nav-pills flex-column">
                            <li class="nav-item"><button class="btn btn-outline" :class="{ active : filter  }" v-on:click="expand('filter')"  title="Filtri"><span class="material-icons">filter_alt</span></button></li>
                        </ul>
                    </div>
                </div>
            </div>
    </div>
    <Footer/>
        </section>
            

        <HeaderNav :company.sync="company" :collapse.sync="collapse" @update:collapse="this.collapse=!this.collapse" />
        <Sidebar :collapse.sync="collapse" :company.sync="company" :companies.sync="companies" @update:company="(index) => changeCompany(index)" parent="dashboard" @update:collapse="(collapse=false)"/>
    </div>
</template>

<script>
import Sidebar from "../../components/Sidebar.vue";
import HeaderNav from "../../components/HeaderNav.vue";
import Footer from "../../components/Footer.vue";
import { useToast } from "vue-toastification";
function initialState (){
  return {
            couriers:[],
            shippings:[],
            fields: {
                id: { name :"ID",show:false },
                order:{name :"Ordine",show:true },
                tracking:{ name :"TRACKING",show:true },
                courier: {name :"Corriere",show:true},
                create:{name :"Creata il",show:true},
                sent:{name :"Spedita il",show:true},
                delivered:{name :"Consegnata il",show:true},
                name: {name :"Destinatario", show:true},
                address:{ name:"Indirizzo",show:true},
                city: { name :"Città",show:true},
                cap: { name :"CAP",show:true},
                country:{name :"Nazione",show:true},
                qty:{name :"Colli",show:true},
                cod:{name :"Contrassegno",show:true},
                list:{name:"Distinta",show:true},
                _status:{name :"Stato",show:true},
                
            },
            marketplaces:[],
            marketplaceKey:"",
            marketplace:null,
            search:false,
            filter:false,
            sort:false,
            filters:{
                
            },
            querystring:"",
            collapse:false,
            company:{},
            companies:[],
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
            this.getCompanies().then(this.getCouriers).then(this.getShippings).then(this.getMarketplaces)
        },
        async getCompanies(){
            try{
                    const res = await this.axios.get("/api/companies/").then((res)=>{
                        this.companies=res.data.results;
                        this.company=res.data.results[0];
                    })
                }
                catch(error) {
                    if(error.response!=null){
                        this.toast.error(error.response.data.detail);
                    }
                    else{
                        this.toast.error("Errore indefinito DITTA");
                    }
                };

        },
        async getCouriers(){
            if(this.company!==null){
                try{
                    const res = await this.axios.get("/api/couriers/?company="+this.company.id)
                    this.couriers=res.data.results;
                    for(var i=0;i<this.couriers.length;i++){

                    }
                }  
                catch (error){
                    this.toast.error("Errore indefinito CORRIERI");
                }  
            }
        },
        async getMarketplaces(){
            if(this.company!==null){
                try{
                    const res = await this.axios.get("/api/marketplaces/?company="+this.company.id)
                    this.marketplaces=res.data.results;
                }  
                catch (error){
                    this.toast.error("Errore indefinito MARKETPLACE");
                }  
            }
        },
        async getShippings() {
            try{
                const res = await this.axios.get("/api/shippings/?company="+this.company.id+this.querystring)
                this.shippings=res.data.results;
            }
            catch(error){
                
                this.toast.error(error.response);
                
                
            }
            
        },
        changeCompany(index){
            var data=initialState();
            data["companies"]=this.companies;
            data["company"]=this.companies[index];
            Object.assign(this.$data,data);
            this.getCouriers().then(this.getShippings).then(this.getMarketplaces);
        },
        
        expand(value){
            
        },
        filtersReset(){
            
        },
        create(order,courier){
            this.axios.post("/api/shippings/?company="+this.company.id+"&order="+order.id+"&courier="+courier.id).then((res)=>{
                this.shipping[key]=res.data.results;
                this.toast.message("Spedizione ordine "+this.shipping[key].order+" creata.")
            }).catch((error)=>{
                this.toast.error("Spedizione ordine "+this.shipping[key].order+" non creata.\n"+error.response.data.detail)
            })
        },
        
        process(key){
            this.axios.post("/api/shippings/"+this.shippings[key].id+"/?company="+this.company.id).then((res)=>{
                this.shipping[key]=res.data.results;
                this.toast.message("Spedizione ordine "+this.shipping[key].order+" confermata.")
            }).catch((error)=>{
                this.toast.error("Spedizione ordine "+this.shipping[key].order+" non confermata.\n"+error.response.data.detail)
            })
        },
        del(key){
            this.axios.delete("/api/shippings/"+this.shippings[key].id+"/?company="+this.company.id).then((res)=>{
                this.shipping[key]=res.data.results;
                this.toast.message("Spedizione ordine "+this.shipping[key].order+" annullata.")
            }).catch((error)=>{
                this.toast.error("Spedizione ordine "+this.shipping[key].order+" non annullata.\n"+error.response.data.detail)
            })
        },
        
        

        
        
        
        
        



    },
    components:{Sidebar,HeaderNav,Footer}


    

}
</script>