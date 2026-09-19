<template>
   <div id="root" class="root hd--expanded hd--sticky mn--sticky" :class="{ 'mn--max' : !collapse, 'mn--min' : collapse, }">
        <section  class="content" id="content">


        <div class="content__header content__boxed overlapping">
            <div class="content__wrap">

                    <!-- Page title and information -->
                    <h1 class="page-title mb-2">Magazzino</h1>
                    <h2 class="h5">Lista dei magazzini</h2>
                    <p></p>
                    <!-- END : Page title and information -->
            </div>
        </div>
        <div class="content__boxed">
            <div class="content__wrap">
                
                    <div class="row p-2 bg-light">
                        <div class="col-3 m-auto">
                                    <div class="m-auto d-md-flex justify-content-md-start">
                                        <b class="p-2">Magazzini </b>
                                        <button class="pt-1 pb-0 btn btn-primary" v-if="this.previous" v-on:click="this.offset=this.offset-this.limit; this.getWarehouses()">&lt;&lt;</button>
                                        <b class="m-2">{{parseFloat(this.offset)+1}} - {{parseFloat(this.offset)+parseFloat(this.limit)}}</b>
                                        <button class="pt-1 pb-0 btn btn-primary" v-if="this.next" v-on:click="this.offset=this.offset+this.limit; this.getWarehouses()">&gt;&gt;</button>
                                    </div>
                                    
                                </div>
                        <div class="col-4 m-auto">
                            <b>Cerca</b>
                            <div class="input-group">
                                <input type="text" class="form-control"  placeholder="Cerca per codice,nome,indirizzo." v-on:keyup.enter="this.sendSearch()" v-model="this.search">
                                <div class="input-group-append"><button class="btn btn-primary" v-on:click="this.sendSearch()">Cerca</button></div>
                            </div>
                            
                        </div>
                        <div class="col-4 m-auto me-0">
                            <b>Visualizza prodotti (n.)</b>
                            <select class="form-select mr-2" v-on:change="this.offset=0; this.limit=$event.target.value; this.getWarehouses();">
                                <option value="20">20</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                                <option value="200">200</option>
                            </select>
                        </div>
                    </div>
                    <div class="row p-2 mt-2 bg-light">
                        <div class="col-xl-12">
                            <div class="card ">
                                <div class="card-header">
                                    <div class="row">
                                        <div class="col-6">
                                            <h4 class="card-title">Informazioni sui tuoi magazzini</h4>
                                            <p class="card-category">Stato dei tuoi magazzini</p>
                                        </div>
                                        <div class="col-6 d-md-flex justify-content-md-end m-auto">
                                            <a :href="'/warehouses/new/?company='+this.company.id" v-if="this.user.is_staff" class="btn btn-primary">Aggiungi Magazzino</a>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-body ">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <div class="table-responsive">
                                                <table class="table">
                                                    <tbody>
                                                        <tr><th>Vendor ID</th><th>Vendor</th><th>Codice Magazzino</th><th>Nome Magazzino</th><th>Indirizzo</th><th>Provincia</th><th>Nazione</th><th></th></tr>
                                                        <tr v-for="(warehouse,key) in this.warehouses" :key="key">
                                                            <td>{{company.vid}}</td>
                                                            <td>{{company.name}}</td>
                                                            <td><b>{{warehouse.code}}</b></td>
                                                            <td><b>{{warehouse.name}}</b></td>
                                                            <td>{{warehouse.address}}</td>
                                                            <td>{{warehouse.province}}</td>
                                                            <td>{{warehouse.country}}</td>                                                            
                                                            <td><a class="btn btn-warning" title="Vedi" :href="'/warehouse?id='+warehouse.id+'&company='+this.company.id">Vedi</a></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                                       
                                            
                </div>
            </div>
                                    
    
    <Footer/>
        </section>
        <HeaderNav :company.sync="company" :collapse.sync="collapse" @update:collapse="this.collapse=!this.collapse" />
        <Sidebar :collapse.sync="collapse" :company.sync="company" :companies.sync="companies" @update:company="(index) => changeCompany(index)" parent="company" @update:collapse="(collapse=false)"/>
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
            company:{},
            companies:[],
            warehouses:[],
            user:{},
            search:"",
            limit:20,
            offset:0,
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
            this.getCompanies().then(this.getWarehouses).then(this.getMe())
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
        async getWarehouses(){
            try{
                    const res = await this.axios.get("/api/warehouses/?company="+this.company.id+"&offset="+this.offset+"&limit="+this.limit+"&search="+this.search).then((res)=>{
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
                        if(res.data.results.length==0 && this.search==""){
                            this.toast.warning("Nessun Magazzino registrato");
                        }
                        else{
                            this.warehouses=res.data.results;
                        }
                            

                        
                    }).catch((error)=>{
                        if(error.response!=null){
                        this.toast.error(error.response.data.detail);
                        }
                    })
                }
                catch(error) {
                    this.toast.error("Errore indefinito (Magazzini)");
                };

        },
        
        async getMe(){
            try{
                    const res = await this.axios.get("/api/me/").then((res)=>{
                        this.user=res.data.results[0];
                        if(this.user.is_staff){
                            
                        }
                        
                    }).catch((error)=>{
                        if(error.response!=null){
                        this.toast.error(error.response.data.detail);
                        }
                    })
                }
                catch(error) {
                    this.toast.error("Errore indefinito (Recupero Utente)");
                };

        },
        changeCompany(key){
            
            window.location.href='/warehouses?company='+this.companies[key].id;
            
        },
        sendSearch(){
            if(this.search.length==0 || this.search.length>2){
                this.getWarehouses()
            }
        },  

        
        
        
        
        
        
        



    },
    components:{Sidebar,HeaderNav,Footer}


    

}
</script>