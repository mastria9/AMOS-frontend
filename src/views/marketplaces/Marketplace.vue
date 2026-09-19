<template>
   <div id="root" class="root hd--expanded hd--sticky mn--sticky" :class="{ 'mn--max' : !collapse, 'mn--min' : collapse, }">
        <section  class="content" id="content">


            <div class="content__header content__boxed overlapping">
                <div class="content__wrap">

                        <!-- Page title and information -->
                        <h1 class="page-title mb-2">Marketplace</h1>
                        <h2 class="h5">Stato del tuo Marketplace</h2>
                        <p></p>
                        <!-- END : Page title and information -->
                </div>
            </div>
        <div class="content__boxed">
            <div class="content__wrap">
                <div class="row bg-light p-2">
                    <div class="col-12 d-md-flex justify-content-md-end">
                        <a class="btn btn-warning" @click="this.$router.push('/marketplaces?company='+this.company.id)">Tutti i Marketplaces</a>
                    </div>
                </div>
            
                <div class="row bg-light mt-2" v-if="this.marketplace">
                    <div class="col-md-6 m-auto">
                        <div class="card ">
                            <div class="card-header">
                                <div class="row">
                                    <div class="col-7">
                                        <h4 class="card-title">{{this.marketplace.account}}</h4>
                                        <p class="card-category"><b>{{this.marketplace.code}} {{this.marketplace.country}}</b></p>
                                    </div>
                                    <div class="col-5 d-md-flex justify-content-md-end m-auto">
                                        <template v-if="user.is_staff">
                                            <button class="btn btn-danger" v-on:click="this.setMarketplaceStatus()" v-if="marketplace.status==true">Disattiva</button>
                                            <button class="btn btn-success" v-on:click="this.setMarketplaceStatus()" v-if="marketplace.status==false">Attiva</button>
                                        </template>
                                    </div>        
                                </div>
                            </div>
                            
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="table-responsive">
                                            <table class="table">
                                                <tbody>
                                                    <tr><th>Account</th><th>{{marketplace.account}}</th></tr>
                                                    <tr><th>Tipo</th><td>{{marketplace.code}}</td></tr>
                                                    <tr><th>Nazione</th><td>{{marketplace.country}}<img class="ml-2" :src="'/src/assets/img/flags/'+marketplace.country+'.png'"/></td></tr>
                                                    <template v-if="!this.modify.marketplace">
                                                        <tr><th>Sito Web</th><td>{{marketplace.website}}</td></tr>
                                                        <tr><th>API Endpoint</th><td>{{marketplace.endpoint}}</td></tr>
                                                        <tr><th>API User</th><td>{{marketplace.endpoint_user}}</td></tr>
                                                        <tr><th>API Password</th><td>{{marketplace.endpoint_password}}</td></tr>
                                                    </template>
                                                    <template v-else>
                                                        <tr><th>Sito Web</th><td><input class="form-control" type="url" v-model="marketplace.website"/></td></tr>
                                                        <tr><th>API Endpoint</th><td><input type="url" class="form-control"  v-model="marketplace.endpoint"/></td></tr>
                                                        <tr><th>API User</th><td><input type="text" class="form-control" v-model="marketplace.endpoint_user"/></td></tr>
                                                        <tr><th>API Password</th><td><input type="text" class="form-control" v-model="marketplace.endpoint_password"/></td></tr>
                                                    </template>
                                                    <tr><th>Stato</th><th><template v-if="marketplace.status"><b class="bi bi-check mr-4"></b>ATTIVO</template><template v-else>NON ATTIVO</template></th></tr>
                                                    
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-6 text-left">
                                        <button v-if="!modify.marketplace" class="btn btn-info" v-on:click="this.modify.marketplace=!this.modify.marketplace">Modifica</button>
                                        <button v-if="modify.marketplace" class="btn btn-info" v-on:click="this.$router.go()" >Annulla</button>
                                    </div>
                                    <div class="col-6 text-right">
                                        <button v-if="modify.marketplace" class="btn btn-success" v-on:click="this.saveMarketplace()">Invia modifiche</button>
                                    </div>
                                </div>
                                
                            </div>
                            <div class="card-footer d-md-flex justify-content-md-center m-auto">
                                <button v-if="user.is_superuser && !marketplace.status" class="btn btn-danger" v-on:click="this.deleteMarketplace()"> !!! Elimina definitivamente !!! </button>
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
            marketplace:null,
            modify:{
                marketplace:false,
            },
            me:{},
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
            if(this.$route.query.id!=null){
                this.getMe().then(this.getCompanies).then(this.getCompany).then(this.getMarketplace)
            }
        },
        async getCompanies(){
            try{
                    const res = await this.axios.get("/api/companies/").then((res)=>{
                        this.companies=res.data.results;
                    }).catch((error)=>{
                        if(error.response!=null){
                            this.toast.error(String(error.response.status)+" "+String(error.response.statusText))
                        }
                    })
                }
                catch(error) {
                    this.toast.error("Errore indefinito (Azienda)");
                };

        },
        async getCompany(){
            try{
                    const res = await this.axios.get("/api/companies/"+this.$route.query.company+"/").then((res)=>{
                        this.company=res.data;
                    }).catch((error)=>{
                        if(error.response!=null){
                            this.toast.error(String(error.response.status)+" "+String(error.response.statusText))
                        }
                    })
                }
                catch(error) {
                    this.toast.error("Errore indefinito (Azienda)");
                };

        },

        async getMarketplace(){
            try{
                    const res = await this.axios.get("/api/marketplaces/"+this.$route.query.id+"/?company="+this.company.id).then((res)=>{
                        this.marketplace=res.data;

                    }).catch((error)=>{
                        if(error.response!=null){
                            this.toast.error(String(error.response.status)+" "+String(error.response.statusText))
                        }
                    })
                }
                catch(error) {
                    this.toast.error("Errore indefinito (Marketplace)");
                };

        },
        
        saveMarketplace(){
            this.axios.put("/api/marketplaces/"+this.marketplace.id+"/?company="+this.company.id,this.marketplace).then((res)=>{
                        this.toast.success("Modifiche salvate");
                        this.$router.go();
                    }).catch((error)=>{
                        if(error.response!=null){
                            this.toast.error(String(error.response.status)+" "+String(error.response.statusText))
                        }
                    })
        },
        
        setMarketplaceStatus(){
            var data={};
            data["status"]=!this.marketplace.status;
            this.axios.put("/api/marketplaces/"+this.marketplace.id+"/?company="+this.company.id,data).then((res)=>{
                        if(res.data.status){
                            this.toast.success("Marketplace attivato");
                            this.init();
                        }
                        else{
                            this.toast.error("Marketplace disattivato");
                            this.init();
                        }
                        
                    }).catch((error)=>{
                        if(error.response!=null){
                            this.toast.error(String(error.response.status)+" "+String(error.response.statusText))
                        }
                    })
        },
        
        
        
        async getMe(){
            try{
                    const res = await this.axios.get("/api/me/").then((res)=>{
                        this.user=res.data.results[0];
                        if(this.user.is_staff){
                            this.getAllUsers();
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
        
        
        
        
        deleteMarketplace(){
            this.axios.delete("/api/marketplaces/"+this.marketplace.id+"/?company="+this.company.id).then((res)=>{
                        this.toast.success("Marketplace eliminato definitivamente");
                        this.$router.go("/marketplaces");
                        
                    }).catch((error)=>{
                        if(error.response!=null){
                            this.toast.error(String(error.response.status)+" "+String(error.response.statusText));
                        }
                    })
        },
        
        changeCompany(key){
            
            window.location.href='/marketplaces/new/?company='+this.companies[key].id;
            
        }
        



    },
    components:{Sidebar,HeaderNav,Footer}


    

}
</script>
